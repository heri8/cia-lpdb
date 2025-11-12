import React, { useCallback, useState } from "react";
import { useApi } from "../hooks/useApi";
import { adminAPI } from "../services/api";
import RuleList from "../components/Admin/RuleList";
import RuleForm from "../components/Admin/RuleForm";
import Modal from "../components/Application/Modal";

const AdminRules = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);

    const fetchRules = useCallback(() => adminAPI.getRules(), []);

    const {
        data: rules,
        loading: isLoading,
        error: fetchError,
        refetch: refetchRules
    } = useApi(fetchRules);

    const handleEdit = (rule) => {
        setSelectedRule(rule);
        setIsModalOpen(true);
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
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Administrasi Aturan Scoring AI
                </h1>

                {/* Komponen Daftar Aturan */}
                <RuleList rules={rules || []} onEdit={handleEdit} />

                {/* Modal Edit Rule */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Edit Aturan: ${selectedRule?.variabel_kode}`}
                >
                    {selectedRule && (
                        <RuleForm
                            initialData={selectedRule}
                            onSaveWeights={handleSaveWeights}
                            onSaveSkala={handleSaveSkala}
                            isSaving={isSaving}
                            saveError={saveError}
                            saveMessage={saveMessage}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default AdminRules;