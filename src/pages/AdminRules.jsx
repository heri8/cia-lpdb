import React, { useCallback, useState } from "react";
import { useApi } from "../hooks/useApi";
import { adminAPI } from "../services/api";
import RuleList from "../components/Admin/RuleList";
import RuleForm from "../components/Admin/RuleForm";
// import Modal from "../components/Application/Modal";
import Modal from "../components/Modal";

const AdminRules = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);

    const [isReadOnlyMode, setIsReadOnlyMode] = useState(true);

    const fetchRules = useCallback(() => adminAPI.getRules(), []);

    const {
        data: rules,
        loading: isLoading,
        error: fetchError,
        refetch: refetchRules
    } = useApi(fetchRules);

    const handleShowRule = (rule) => {
        setSelectedRule(rule);
        setIsReadOnlyMode(true);
        setIsModalOpen(true);
    };

    const handleEdit = (rule) => {
        setSelectedRule(rule);
        setIsReadOnlyMode(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRule(null);
        setSaveError(null);
        setSaveMessage(null);
    };

    const handleSaveWeights = async (variabelId, weightsData) => {
        setIsSaving(true);
        setSaveError(null);
        setSaveMessage(null);

        try {
            await adminAPI.updateVariableWeights(variabelId, weightsData);
            setSaveMessage(`Bobot Variabel ${variabelId} berhasil diperbarui.`);
            refetchRules();
        } catch (error) {
            const msg = error.data?.message || "Gagal menyimpan bobot variabel.";
            setSaveError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSkala = async (skalaId, skalaData) => {
        setIsSaving(true);
        setSaveError(null);
        setSaveMessage(null);

        try {
            await adminAPI.updateSkalaRule(skalaId, skalaData);
            setSaveMessage(`Skala ID ${skalaId} berhasil diperbarui.`);
            refetchRules();
        } catch (error) {
            const msg = error.data?.message || "Gagal menyimpan skala rule.";
            setSaveError(msg);
        } finally {
            setIsSaving(false);

            if (!saveError) {
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSelectedRule(null);
                }, 1500);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center text-blue-500">
                <i className="fas fa-spinner fa-spin mr-2"></i> Memuat Data Aturan Scoring...
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="p-6 text-center text-red-600">
                <i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat data aturan: {fetchError}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-4 lg:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Administrasi Aturan Scoring AI
            </h1>

            {/* Komponen Daftar Aturan */}
            <RuleList
                rules={rules || []}
                onEdit={handleEdit}
                onShow={handleShowRule}
            />

            {/* Modal Edit Rule */}
            {selectedRule && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={isReadOnlyMode ? `Detail Rule: ${selectedRule.nama_variabel}` : `Edit Rule: ${selectedRule.nama_variabel}`}
                >
                    <RuleForm
                        initialData={selectedRule}
                        onSaveWeights={handleSaveWeights}
                        onSaveSkala={handleSaveSkala}
                        isSaving={isSaving}
                        saveError={saveError}
                        saveMessage={saveMessage}
                        isReadOnly={isReadOnlyMode}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminRules;