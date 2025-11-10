import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { adminAPI } from "../services/api";
import { USER_ROLES } from "../contexts/AuthContext";

const INITIAL_FORM_DATA = {
    email: "",
    nama_lengkap: "",
    role: Object.keys(USER_ROLES)[0], // Default ke role pertama (misal: ADMIN)
    status_aktif: true,
    password: "",
    // Tambahkan konfirmasi password untuk UI yang lebih baik
    confirm_password: "",
};

const AddUserModal = ({ isOpen, onClose, onCreateUser, loading, error }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [localError, setLocalError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);

        // Validasi Sederhana
        if (formData.password !== formData.confirm_password) {
            setLocalError("Password dan Konfirmasi Password tidak cocok.");
            return;
        }

        if (!formData.email || !formData.nama_lengkap || !formData.password || !formData.role) {
            setLocalError("Semua kolom wajib diisi.");
            return;
        }

        // Kirim data yang dibutuhkan API
        const dataToSubmit = {
            email: formData.email,
            nama_lengkap: formData.nama_lengkap,
            role: formData.role,
            status_aktif: formData.status_aktif,
            password: formData.password,
        };

        onCreateUser(dataToSubmit);
        // Reset form setelah kirim (akan direset oleh parent setelah sukses)
    };

    // Atur ulang state lokal saat modal ditutup/dibuka
    if (!isOpen && formData.email !== "" || localError) {
        setFormData(INITIAL_FORM_DATA);
        setLocalError(null);
    }


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Tambah Pengguna Baru</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {(localError || error) && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {localError || error}
                        </div>
                    )}

                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            name="nama_lengkap"
                            value={formData.nama_lengkap}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                {Object.values(USER_ROLES).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Aktif */}
                        <div className="flex items-end h-full">
                            <div className="flex items-center">
                                <input
                                    id="status_aktif"
                                    type="checkbox"
                                    name="status_aktif"
                                    checked={formData.status_aktif}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="status_aktif" className="ml-2 block text-sm font-medium text-gray-700">
                                    Aktif
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                            ) : (
                                <i className="fas fa-user-plus mr-2"></i>
                            )}
                            Buat Pengguna
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Admin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createUserLoading, setCreateUserLoading] = useState(false);
    const [createUserError, setCreateUserError] = useState(null);
    const {
        data: users,
        loading: loadingUsers,
        error: errorUsers,
        refetch: refetchUsers
    } = useApi(adminAPI.getAllUsers);
    const {
        data: auditLogs,
        loading: loadingLogs,
        error: errorLogs
    } = useApi(adminAPI.getAuditLogs);

    const handleCreateUser = async (userData) => {
        setCreateUserLoading(true);
        setCreateUserError(null);
        try {
            await adminAPI.createUser(userData);
            alert("Pengguna berhasil ditambahkan!");
            setIsModalOpen(false);
            refetchUsers();
        } catch (err) {
            console.error("Create User Error:", err);
            setCreateUserError(err.message || "Gagal membuat pengguna.");
        } finally {
            setCreateUserLoading(false);
        }
    };

    const getStatusClass = (status) => {
        if (status === "Aktif")
            return "bg-green-100 text-green-800";
        if (status === "Non-aktif")
            return "bg-red-100 text-red-800";
        return "bg-gray-100 text-gray-800";
    };

    return (
        <>
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* User Management */}
                <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2 lg:mb-0">
                            Manajemen Pengguna
                        </h2>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
                            <i className="fas fa-plus mr-2"></i> Tambah Pengguna
                        </button>
                    </div>

                    {/* Loading/Error State Pengguna */}
                    {loadingUsers && <p className="text-blue-500"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat daftar pengguna...</p>}
                    {errorUsers && <p className="text-red-500"><i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat pengguna: {errorUsers}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Login Terakhir
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(users ?? []).length === 0 && !loadingUsers && !errorUsers ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                            Tidak ada data pengguna.
                                        </td>
                                    </tr>
                                ) : (
                                    (users ?? []).map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800 font-medium">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                                                        user.status
                                                    )} font-medium`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                {user.lastLogin}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex space-x-2">
                                                    <button className="text-primary-600 hover:text-primary-700 p-1 rounded">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="text-danger hover:text-red-700 p-1 rounded">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Log */}
                <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                        Log Audit
                    </h2>

                    {/* Loading/Error State Log Audit */}
                    {loadingLogs && <p className="text-blue-500"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat log audit...</p>}
                    {errorLogs && <p className="text-red-500"><i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat log: {errorLogs}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP Address
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* 💡 Menggunakan (auditLogs ?? []) untuk fallback array kosong */}
                                {(auditLogs ?? []).length === 0 && !loadingLogs && !errorLogs ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                            Tidak ada data log audit.
                                        </td>
                                    </tr>
                                ) : (
                                    (auditLogs ?? []).map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-900">{log.user}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-gray-900">{log.action}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm text-gray-500">{log.timestamp}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {log.ip}
                                                </code>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateUser={handleCreateUser}
                loading={createUserLoading}
                error={createUserError}
            />
        </>
    );
};

export default Admin;
