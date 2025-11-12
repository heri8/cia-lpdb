// src/components/Admin/RuleForm.jsx

import React, { useState, useEffect } from "react";

const RuleForm = ({ initialData, onSave, isSaving, saveError, saveMessage }) => {
    const [formData, setFormData] = useState(initialData);

    // Sinkronisasi state internal dengan prop external saat modal dibuka
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleBobotChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9.]/g, '');
        setFormData(prev => ({
            ...prev,
            [name]: numericValue,
        }));
    };

    const handleSkalaChange = (skalaId, field, value) => {
        setFormData(prev => ({
            ...prev,
            skala_rules: prev.skala_rules.map(skala =>
                skala.id === skalaId ? { ...skala, [field]: value } : skala
            ),
        }));
    };

    const handleWeightsSubmit = (e) => {
        e.preventDefault();
        const weightsData = {
            bobot_u: formData.bobot_u,
            bobot_sr: formData.bobot_sr,
            bobot_sp: formData.bobot_sp,
        };
        onSaveWeights(formData.id, weightsData);
    };

    const handleSkalaSubmit = (e, skala) => {
        e.preventDefault();
        const skalaData = {
            skala_dihasilkan: skala.skala_dihasilkan,
            label_skala: skala.label_skala,
            nilai_1: skala.nilai_1,
        };
        onSaveSkala(skala.id, skalaData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim data bobot dan skala_rules yang sudah diubah
        onSave(formData);
    };

    // Fungsi untuk mengurutkan skala_rules agar tampil lebih rapi
    const sortedSkalaRules = [...formData.skala_rules].sort((a, b) =>
        b.skala_dihasilkan - a.skala_dihasilkan
    );


    return (
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">
                {formData.nama_variabel} ({formData.variabel_kode})
            </h4>

            {/* Pesan Simpan */}
            {saveMessage && (
                <div className="p-3 text-sm font-semibold rounded-xl text-green-700 bg-green-100 border border-green-200">
                    <i className="fas fa-check-circle mr-2"></i> {saveMessage}
                </div>
            )}
            {saveError && (
                <div className="p-3 text-sm font-semibold rounded-xl text-red-700 bg-red-100 border border-red-200">
                    <i className="fas fa-exclamation-triangle mr-2"></i> Error: {saveError}
                </div>
            )}

            {/* Bagian Edit Bobot */}
            <form onSubmit={handleWeightsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="col-span-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Bobot Variabel</h5>
                    </div>
                    {['bobot_u', 'bobot_sr', 'bobot_sp'].map(bobotKey => (
                        <div key={bobotKey}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {bobotKey.toUpperCase().replace('_', ' ')}
                            </label>
                            <input
                                type="text"
                                name={bobotKey}
                                value={formData[bobotKey]}
                                onChange={handleBobotChange}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    ))}
                    <div className="flex items-end justify-start">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:bg-yellow-400 w-full"
                        >
                            {isSaving ? (<i className="fas fa-spinner fa-spin"></i>) : 'Simpan Bobot'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Bagian Edit Skala Rules */}
            <div className="space-y-4">
                <h5 className="font-semibold text-gray-700 border-b border-gray-100 pb-2">Skala dan Nilai Hasil</h5>

                {sortedSkalaRules.map((skala) => (
                    // 💡 Bungkus setiap skala dengan form terpisah
                    <form
                        key={skala.id}
                        onSubmit={(e) => handleSkalaSubmit(e, skala)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
                    >
                        <div className="col-span-1">
                            <span className="font-medium text-blue-600 block text-xs uppercase">
                                Skala {skala.skala_dihasilkan}
                            </span>
                            <p className="font-semibold text-gray-900">{skala.label_skala}</p>
                        </div>

                        {/* Edit Nilai Skala Dihasilkan */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nilai Bobot</label>
                            <input
                                type="text"
                                value={skala.nilai_1}
                                onChange={(e) => handleSkalaChange(skala.id, 'nilai_1', e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                            />
                        </div>

                        {/* Edit Label Skala */}
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                            <input
                                type="text"
                                value={skala.label_skala}
                                onChange={(e) => handleSkalaChange(skala.id, 'label_skala', e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                            />
                        </div>

                        {/* Tombol Simpan Skala */}
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 w-full"
                            >
                                {isSaving ? (<i className="fas fa-spinner fa-spin"></i>) : 'Simpan Skala'}
                            </button>
                        </div>
                    </form>
                ))}
            </div>
        </div>
    );
};

export default RuleForm;