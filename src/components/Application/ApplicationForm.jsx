// src/components/Applications/ApplicationForm.jsx

import React, { useState } from "react";
import InputField from "./InputField"; // 💡 Import InputField
import { applicationsAPI } from "../../services/api";

const SECTOR_OPTIONS = [
    { value: "SEKTOR_RIIL", label: "Sektor Riil" },
    { value: "JASA", label: "Jasa" },
    { value: "PERDAGANGAN", label: "Perdagangan" },
];

const ApplicationForm = ({ initialData = {}, onSaveSuccess, applicationId = null }) => {
    const isEditing = !!applicationId;

    const [formData, setFormData] = useState({
        nomor_proposal_internal: initialData.nomor_proposal_internal || "",
        tanggal_proposal: initialData.tanggal_proposal || new Date().toISOString().substring(0, 10),
        jumlah_pembiayaan_diajukan: initialData.jumlah_pembiayaan_diajukan || 0,
        tujuan_pembiayaan: initialData.tujuan_pembiayaan || "",
        suku_bunga_diminta: initialData.suku_bunga_diminta || 0,
        tenor_diminta_bulan: initialData.tenor_diminta_bulan || 12,
        tipe_sektor: initialData.tipe_sektor || SECTOR_OPTIONS[0].value,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (type === 'number') {
            newValue = parseFloat(value);
            if (isNaN(newValue)) newValue = 0;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSaveApplication = async () => {
        setSaveMessage(null);
        setIsSaving(true);

        try {
            let response;
            if (isEditing) {
                response = await applicationsAPI.update(applicationId, formData);
            } else {
                response = await applicationsAPI.create(formData);
            }

            setSaveMessage(`Data aplikasi ${isEditing ? 'diperbarui' : 'dibuat'} dengan ID ${response.id} berhasil!`);
            if (onSaveSuccess) onSaveSuccess(response.id);

        } catch (error) {
            console.error("Gagal menyimpan aplikasi:", error);
            setSaveMessage(`Gagal menyimpan: ${error.message || 'Terjadi kesalahan'}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                {isEditing ? "Edit Aplikasi" : "Buat Aplikasi Baru"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <InputField
                    id="nomor_proposal_internal"
                    label="Nomor Proposal Internal"
                    placeholder="Contoh: 001/APP/11/2025"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.nomor_proposal_internal}
                    onChange={handleInputChange}
                />

                <InputField
                    id="tanggal_proposal"
                    label="Tanggal Proposal"
                    type="date"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.tanggal_proposal}
                    onChange={handleInputChange}
                />

                <InputField
                    id="jumlah_pembiayaan_diajukan"
                    label="Jumlah Pembiayaan Diajukan (IDR)"
                    type="number"
                    min={1000}
                    step={1000}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.jumlah_pembiayaan_diajukan}
                    onChange={handleInputChange}
                />

                <InputField
                    id="tenor_diminta_bulan"
                    label="Tenor Diminta (Bulan)"
                    type="number"
                    min={1}
                    step={1}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.tenor_diminta_bulan}
                    onChange={handleInputChange}
                />

                <InputField
                    id="suku_bunga_diminta"
                    label="Suku Bunga Diminta (%)"
                    type="number"
                    min={0}
                    step={0.01}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.suku_bunga_diminta}
                    onChange={handleInputChange}
                />

                <InputField
                    id="tipe_sektor"
                    label="Tipe Sektor"
                    type="select"
                    options={SECTOR_OPTIONS}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    isSaving={isSaving}
                    value={formData.tipe_sektor}
                    onChange={handleInputChange}
                />

                {/* Text Area */}
                <div className="lg:col-span-3">
                    <InputField
                        id="tujuan_pembiayaan"
                        label="Tujuan Pembiayaan"
                        placeholder="Deskripsikan tujuan penggunaan dana pembiayaan..."
                        isTextArea
                        formData={formData}
                        handleInputChange={handleInputChange}
                        isSaving={isSaving}
                        value={formData.tujuan_pembiayaan}
                        onChange={handleInputChange}
                    />
                </div>

            </div>

            {/* Tombol Simpan */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center">
                {/* Pesan Konfirmasi Simpan */}
                {saveMessage && (
                    <div className={`mr-4 mb-3 sm:mb-0 p-3 text-sm font-semibold rounded-xl transition-opacity duration-300 ${saveMessage.includes("berhasil") ? "text-green-700 bg-green-100 border border-green-200" : "text-red-700 bg-red-100 border border-red-200"}`}>
                        {saveMessage}
                    </div>
                )}
                <button
                    onClick={handleSaveApplication}
                    disabled={isSaving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/50 w-full sm:w-auto justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <><i className="fas fa-spinner fa-spin -ml-1 mr-3 h-5 w-5"></i>Menyimpan...</>
                    ) : (
                        <><i className="fas fa-save mr-2"></i>Simpan Aplikasi</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ApplicationForm;