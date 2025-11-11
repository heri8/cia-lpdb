import { useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { adminAPI } from "../services/api";
import moment from "moment";

import Modal from "../components/Application/Modal";
import UserForm from "../components/Admin/UserForm";

const getRoleClass = (role) => {
    const classes = {
        ADMIN: "bg-purple-100 text-purple-800",
        ANALYST: "bg-blue-100 text-blue-800",
        // Tambahkan role lain jika ada
    };
    return classes[role?.toUpperCase()] || "bg-gray-100 text-gray-800";
};

const getStatusClass = (status) => {
    return status
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
};

const getActionClass = (action) => {
    const normalizedAction = action?.toUpperCase() || '';
    if (normalizedAction.includes("LOGIN")) return "bg-green-100 text-green-800";
    if (normalizedAction.includes("CREATE")) return "bg-blue-100 text-blue-800";
    if (normalizedAction.includes("UPDATE")) return "bg-yellow-100 text-yellow-800";
    if (normalizedAction.includes("DELETE")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
};

const Admin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(() => adminAPI.getAllUsers(), []);
    const { data: users, loading: loadingUsers, error: errorUsers, refetch: refetchUsers } = useApi(fetchUsers, []);

    const fetchAuditLogs = useCallback(() => adminAPI.getAuditLogs({ limit: 50 }), []); // Tambahkan limit
    const { data: logs, loading: loadingLogs, error: errorLogs } = useApi(fetchAuditLogs, []);

    const handleOpenModal = (user = {}) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        refetchUsers();
    };

    // --- LOADING DAN ERROR STATES KESELURUHAN ---
    if (loadingUsers || loadingLogs) {
        return (
            <div className="p-8 text-center">
                <i className="fas fa-spinner fa-spin text-2xl mr-2"></i> Memuat data Admin...
            </div>
        );
    }

    const hasError = errorUsers || errorLogs;

    if (hasError) {
        return (
            <div className="p-8 text-center text-red-600">
                Gagal memuat data: {errorUsers?.message || errorLogs?.message || 'Terjadi kesalahan jaringan.'}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        <i className="fas fa-tools mr-2"></i> Halaman Administrator
                    </h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                    >
                        <i className="fas fa-user-plus mr-2"></i> Tambah Pengguna
                    </button>
                </div>

                {/* -------------------------------------------------------- */}
                {/* ---------- BAGIAN 1: PENGELOLAAN PENGGUNA ---------- */}
                {/* -------------------------------------------------------- */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 mt-8 border-b pb-2">
                    Pengelolaan Pengguna Sistem
                </h2>

                <div className="rounded-2xl overflow-hidden shadow-soft border border-gray-100 bg-white mb-10">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Nama & Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-4/12">Login Terakhir</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users && users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-semibold text-gray-900">{user.nama_lengkap}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusClass(user.status_aktif)}`}>
                                            {user.status_aktif ? "Aktif" : "Non-aktif"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.last_login
                                            ? moment(user.last_login).format("DD MMM YYYY, HH:mm:ss")
                                            : "-"}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        {/* <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100"
                                            title="Edit Pengguna"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!users || users.length === 0) && (
                        <div className="p-6 text-center text-gray-500">
                            Tidak ada data pengguna ditemukan.
                        </div>
                    )}
                </div>


                {/* -------------------------------------------------------- */}
                {/* ---------- BAGIAN 2: LOG AUDIT SISTEM ---------- */}
                {/* -------------------------------------------------------- */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 mt-8 border-b pb-2">
                    Log Audit Sistem
                </h2>

                <div className="rounded-2xl overflow-hidden shadow-soft border border-gray-100 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">ID Log</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Waktu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">Pelaku (Email)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Aksi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6/12">Deskripsi Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs && logs.map((log) => (
                                // Asumsi log memiliki properti: id, user_email, action, timestamp, details
                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {moment(log.timestamp).format("DD MMM YYYY, HH:mm:ss")}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.user_email || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getActionClass(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 break-words">
                                        {log.details || "Tidak ada detail tambahan."}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!logs || logs.length === 0) && (
                        <div className="p-6 text-center text-gray-500">
                            Tidak ada log aktivitas ditemukan.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Edit/Tambah User */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedUser?.id ? `Edit Pengguna: ${selectedUser.nama_lengkap || selectedUser.email}` : "Tambah Pengguna Baru"}
            >
                <UserForm
                    initialData={selectedUser}
                    onSave={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Admin;
