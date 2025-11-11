// src/pages/CustomerDetail.jsx
import React, { useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useApi } from '../hooks/useApi';
import { customersAPI } from '../services/api'; // Pastikan sudah diimpor

// Fungsi helper untuk mendapatkan badge grade (dari Customers.jsx)
const getGradeClass = (grade) => {
    const normalizedGrade = grade?.toUpperCase();
    const classes = {
        A: "bg-green-100 text-green-800",
        B: "bg-blue-100 text-blue-800",
        C: "bg-yellow-100 text-yellow-800",
    };
    return classes[normalizedGrade] || "bg-gray-100 text-gray-800";
};

// Fungsi helper untuk mendapatkan badge status pengajuan (dari Applications.jsx)
const getStatusClass = (status) => {
    const normalizedStatus = status?.toUpperCase();
    const classes = {
        BARU: "bg-blue-100 text-blue-800",
        DRAFT: "bg-gray-100 text-gray-800",
        LAYAK: "bg-green-100 text-green-800",
        BERSYARAT: "bg-yellow-100 text-yellow-800",
        TIDAK_LAYAK: "bg-red-100 text-red-800",
    };

    if (normalizedStatus?.includes("LAYAK BERSYARAT")) return classes.BERSYARAT;
    if (normalizedStatus?.includes("LAYAK")) return classes.LAYAK;
    if (normalizedStatus?.includes("TIDAK LAYAK")) return classes.TIDAK_LAYAK;
    if (normalizedStatus === "BARU") return classes.BARU;

    return classes.DRAFT;
};


const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCustomerDetail = useCallback(async () => {
        if (!id) return null;
        // 💡 Asumsi customersAPI memiliki metode getById(id)
        return customersAPI.getById(id);
    }, [id]);

    const { data: customer, loading, error } = useApi(fetchCustomerDetail, [id]);

    if (loading) {
        return (
            <div className="p-10 text-center text-blue-500">
                <i className="fas fa-spinner fa-spin mr-2"></i> Memuat detail nasabah ID: {id}...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600">
                <i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat data nasabah: {error.message}
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="p-10 text-center text-gray-500">
                <h2 className="text-xl font-semibold">Nasabah tidak ditemukan.</h2>
                <Link to="/customers" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Kembali ke Daftar Nasabah
                </Link>
            </div>
        );
    }

    const customerDetails = [
        { label: "ID Nasabah", value: customer.id },
        { label: "Tipe Nasabah", value: customer.tipe_nasabah },
        { label: "NPWP Institusi", value: customer.npwp_institusi || '-' },
        { label: "NIK Koperasi", value: customer.nomor_nik_koperasi || '-' },
        { label: "Kota Domisili", value: customer.kota_domisili || '-' },
        { label: "Alamat Lengkap", value: customer.alamat_lengkap || '-' },
        { label: "Email", value: customer.email || '-' },
        { label: "Nomor Telepon", value: customer.nomor_telepon || '-' },
        { label: "Nomor Akta Pendirian", value: customer.nomor_akta_pendirian || '-' },
        { label: "Tanggal Akta Pendirian", value: customer.tanggal_akta_pendirian ? moment(customer.tanggal_akta_pendirian).format('DD MMM YYYY') : '-' },
        { label: "Tanggal Dibuat", value: customer.created_at ? moment(customer.created_at).format('DD MMM YYYY HH:mm') : '-' },
    ];

    const historiPengajuan = customer.histori_pengajuan || [];


    return (
        <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Detail Nasabah: {customer.nama}
                </h1>
                <Link
                    to="/customers"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    <i className="fas fa-arrow-left mr-2"></i> Kembali ke Daftar
                </Link>
            </div>

            {/* Bagian 1: Informasi Dasar Nasabah */}
            <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <i className="fas fa-info-circle mr-2 text-primary-500"></i> Informasi Dasar
                    <span
                        className={`ml-4 px-3 py-1 text-xs rounded-full font-bold ${getGradeClass(customer.grade_koperasi)}`}
                    >
                        Grade: {customer.grade_koperasi || 'N/A'}
                    </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {customerDetails.map((item, index) => (
                        <div key={index}>
                            <p className="text-sm font-medium text-gray-500">{item.label}</p>
                            <p className="text-base font-semibold text-gray-900 break-words">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tombol Aksi */}
                {/* <div className="mt-8 pt-4 border-t border-gray-100 flex space-x-4">
                    <button
                        onClick={() => navigate(`/applications/new?customer_id=${customer.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                    >
                        <i className="fas fa-file-alt mr-2"></i> Ajukan Aplikasi Baru
                    </button>
                    <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                    >
                        <i className="fas fa-edit mr-2"></i> Edit Data Nasabah
                    </button>
                </div> */}
            </div>

            {/* Bagian 2: Riwayat Pengajuan */}
            <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <i className="fas fa-history mr-2 text-yellow-500"></i> Riwayat Pengajuan Kredit ({historiPengajuan.length})
                </h2>

                {historiPengajuan.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
                        <p>Belum ada riwayat pengajuan kredit untuk nasabah ini.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No. Proposal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Aplikasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status Pengajuan
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {historiPengajuan.map((history) => (
                                    <tr key={history.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900">{history.nomor_proposal_internal}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-500">{history.id}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${getStatusClass(history.status_pengajuan)} font-medium`}
                                            >
                                                {history.status_pengajuan}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => navigate(`/applications/${history.id}`)}
                                                className="text-primary-600 hover:text-primary-700 p-1 rounded"
                                                title="Lihat Detail Aplikasi"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetail;