import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import InputField from "../Application/InputField";

// Opsi Role yang tersedia
const ROLE_OPTIONS = [
    { value: "ADMIN", label: "Administrator" },
    { value: "ANALYST", label: "Analis Kredit" },
    { value: "USER", label: "Pengguna Umum" },
];

// State awal untuk formulir
const INITIAL_FORM_DATA = {
    email: "",
    nama_lengkap: "",
    role: ROLE_OPTIONS[0].value,
    status_aktif: true,
    password: "",
    confirm_password: "",
};

const UserForm = ({ initialData = {}, onSave }) => {
    const isEditing = !!initialData.id;

    // Inisialisasi state dengan data awal jika mode edit
    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        ...initialData,
        // Pastikan password dan confirm_password dikosongkan saat mode edit
        password: "",
        confirm_password: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null); // Pesan sukses/gagal

    // Sinkronisasi data awal saat initialData berubah (saat modal dibuka)
    useEffect(() => {
        setFormData({
            ...INITIAL_FORM_DATA,
            ...initialData,
            password: "",
            confirm_password: "",
        });
        setMessage(null);
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // --- VALIDASI ---
        if (formData.password !== formData.confirm_password) {
            setMessage({ type: 'error', text: "Password dan Konfirmasi Password tidak cocok." });
            return;
        }

        // Jika mode buat (create), password wajib diisi
        if (!isEditing && !formData.password) {
            setMessage({ type: 'error', text: "Password wajib diisi untuk pengguna baru." });
            return;
        }

        // Data yang dikirim ke API
        const dataToSend = {
            email: formData.email,
            nama_lengkap: formData.nama_lengkap,
            role: formData.role,
            status_aktif: formData.status_aktif,
        };

        // Hanya tambahkan password jika ada isinya
        if (formData.password) {
            dataToSend.password = formData.password;
        }

        setIsSaving(true);

        try {
            if (isEditing) {
                // Panggil API update
                await adminAPI.updateUser(initialData.id, dataToSend);
                setMessage({ type: 'success', text: "Pengguna berhasil diperbarui." });
            } else {
                // Panggil API create
                await adminAPI.createUser(dataToSend);
                setMessage({ type: 'success', text: "Pengguna baru berhasil ditambahkan." });
            }

            // Beri jeda sebentar sebelum menutup modal
            setTimeout(() => onSave(), 1500);

        } catch (error) {
            const msg = error.response?.data?.message || `Gagal menyimpan pengguna: ${error.message}`;
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            {/* Pesan Sukses/Gagal */}
            {message && (
                <div className={`p-3 mb-4 text-sm font-semibold rounded-xl ${message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-200' : 'text-red-700 bg-red-100 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <InputField
                    id="nama_lengkap"
                    label="Nama Lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    isSaving={isSaving}
                />

                <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contoh@lpdb.com"
                    isSaving={isSaving}
                />

                <InputField
                    id="role"
                    label="Role Pengguna"
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={handleInputChange}
                    isSaving={isSaving}
                />

                {/* Checkbox Status Aktif */}
                <div className="flex items-center pt-8">
                    <input
                        id="status_aktif"
                        name="status_aktif"
                        type="checkbox"
                        checked={formData.status_aktif}
                        onChange={handleInputChange}
                        disabled={isSaving}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="status_aktif" className="ml-3 text-sm font-medium text-gray-700">
                        Status Aktif
                    </label>
                </div>

                {/* Password Fields */}
                <InputField
                    id="password"
                    label={isEditing ? "Password (Kosongkan jika tidak diubah)" : "Password"}
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isEditing ? "••••••••" : "Masukkan password"}
                    isSaving={isSaving}
                />

                <InputField
                    id="confirm_password"
                    label="Konfirmasi Password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    placeholder="Ulangi password"
                    isSaving={isSaving}
                />
            </div>

            {/* Tombol Simpan */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <><i className="fas fa-spinner fa-spin mr-2"></i> Menyimpan...</>
                    ) : (
                        <><i className="fas fa-save mr-2"></i> Simpan Pengguna</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default UserForm;