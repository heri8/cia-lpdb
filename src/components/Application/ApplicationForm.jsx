// src/components/Applications/ApplicationForm.jsx

import React, { useState } from "react";
import InputField from "./InputField";
import { applicationsAPI } from "../../services/api";

const SECTOR_OPTIONS = [
    { value: "SEKTOR_RIIL", label: "Sektor Riil" },
    { value: "SIMPAN_PINJAM", label: "Simpan Pinjam" },
];

const INITIAL_FORM_DATA = {
    // Data Nasabah/Koperasi
    nama_koperasi: "",
    npwp_institusi: "",
    nomor_nik_koperasi: "",
    grade_koperasi: "A",
    kota_domisili: "",

    // Data Aplikasi
    nomor_proposal_internal: "",
    tanggal_proposal: new Date().toISOString().substring(0, 10),
    jumlah_pembiayaan_diajukan: 0,
    tujuan_pembiayaan: "",
    suku_bunga_diminta: 0,
    tenor_diminta_bulan: 0,
    tipe_sektor: SECTOR_OPTIONS[0].value,
};

const ApplicationForm = ({ initialData = {}, onSaveSuccess, applicationId = null }) => {
    const isEditing = !!applicationId;

    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        ...initialData,
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

        if (!formData.nama_koperasi || !formData.nomor_proposal_internal || formData.jumlah_pembiayaan_diajukan <= 0) {
            setSaveMessage("Harap lengkapi semua field wajib (Nama Koperasi, No. Proposal, Jumlah Pembiayaan).");
            setIsSaving(false);
            return;
        }

        try {
            let response;
            if (isEditing) {
                response = await applicationsAPI.update(applicationId, formData);
                setSaveMessage("Aplikasi berhasil diperbarui!");
            } else {
                response = await applicationsAPI.create(formData);
                setSaveMessage("Aplikasi baru berhasil dibuat! Menuju halaman detail...");
            }
            setTimeout(() => {
                onSaveSuccess(response.id || applicationId);
            }, 1500);

        } catch (error) {
            console.error("Gagal menyimpan aplikasi:", error);
            setSaveMessage(`Gagal menyimpan: ${error.message || 'Terjadi kesalahan'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const allFormDisabled = isSaving || isEditing;

    return (
        <div className="p-4">

            {/* ⭐️ BAGIAN 1: INFORMASI NASABAH (KOPERASI) */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                    Informasi Koperasi / Nasabah
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="nama_koperasi"
                        label="Nama Koperasi"
                        value={formData.nama_koperasi}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Masukkan nama koperasi"
                    />
                    <InputField
                        id="grade_koperasi"
                        label="Grade Koperasi"
                        value={formData.grade_koperasi}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Contoh: A, B, atau C"
                    />
                    <InputField
                        id="npwp_institusi"
                        label="NPWP Institusi"
                        value={formData.npwp_institusi}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Masukkan NPWP institusi"
                    />
                    <InputField
                        id="nomor_nik_koperasi"
                        label="NIK Koperasi"
                        value={formData.nomor_nik_koperasi}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Masukkan NIK koperasi"
                    />
                    <InputField
                        id="kota_domisili"
                        label="Kota Domisili"
                        value={formData.kota_domisili}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Contoh: Jakarta, Bekasi"
                    />
                    {/* Tambahan field untuk menjaga alignment */}
                    <div className="hidden md:block"></div>
                </div>
            </div>

            {/* ⭐️ BAGIAN 2: FORMULIR APLIKASI */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                    Informasi Proposal Aplikasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        id="nomor_proposal_internal"
                        label="No. Proposal Internal"
                        value={formData.nomor_proposal_internal}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                        placeholder="Contoh: PRO-001/2025"
                    />
                    <InputField
                        id="tanggal_proposal"
                        label="Tanggal Proposal"
                        type="date"
                        value={formData.tanggal_proposal}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                    />
                    <InputField
                        id="jumlah_pembiayaan_diajukan"
                        label="Jumlah Pembiayaan Diajukan (IDR)"
                        type="number"
                        value={formData.jumlah_pembiayaan_diajukan}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                    />
                    <InputField
                        id="suku_bunga_diminta"
                        label="Suku Bunga Diminta (%)"
                        type="number"
                        step="0.01"
                        value={formData.suku_bunga_diminta}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                    />
                    <InputField
                        id="tenor_diminta_bulan"
                        label="Tenor Diminta (Bulan)"
                        type="number"
                        value={formData.tenor_diminta_bulan}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                    />
                    <InputField
                        id="tipe_sektor"
                        label="Tipe Sektor"
                        options={SECTOR_OPTIONS}
                        value={formData.tipe_sektor}
                        onChange={handleInputChange}
                        isDisabled={allFormDisabled}
                        isSaving={isSaving}
                    />
                    <div className="md:col-span-2">
                        <InputField
                            id="tujuan_pembiayaan"
                            label="Tujuan Pembiayaan"
                            isTextArea
                            value={formData.tujuan_pembiayaan}
                            onChange={handleInputChange}
                            isDisabled={allFormDisabled}
                            isSaving={isSaving}
                            placeholder="Jelaskan secara singkat tujuan pembiayaan ini..."
                        />
                    </div>
                </div>
            </div>

            {/* Tombol Simpan */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end items-center">
                {/* Pesan Konfirmasi Simpan */}
                {saveMessage && (
                    <div className={`mr-4 mb-3 sm:mb-0 p-3 text-sm font-semibold rounded-xl transition-opacity duration-300 ${saveMessage.includes("berhasil") ? "text-green-700 bg-green-100 border border-green-200" : "text-red-700 bg-red-100 border border-red-200"}`}>\
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