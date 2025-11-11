// src/pages/ApplicationDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { applicationsAPI } from '../services/api';
import ApplicationInfo from '../components/Application/ApplicationInfo';

const ApplicationDetail = () => {
    const { id } = useParams();

    // Fungsi fetch data spesifik berdasarkan ID
    const fetchApplicationDetail = React.useCallback(async () => {
        if (!id) return null;
        return applicationsAPI.getById(id);
    }, [id]);

    // Panggil useApi
    const { data: application, loading, error } = useApi(fetchApplicationDetail, [id]);

    if (loading) {
        return (
            <div className="p-10 text-center text-blue-500">
                <i className="fas fa-spinner fa-spin mr-2"></i> Memuat detail aplikasi ID: {id}...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600">
                <i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat data aplikasi: {error.message}
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-10 text-center text-gray-500">
                <i className="fas fa-search fa-3x mb-3 text-gray-300"></i>
                <h2 className="text-xl font-semibold">Aplikasi tidak ditemukan.</h2>
            </div>
        );
    }

    const applicationTitle = application.nomor_proposal_internal || `Detail Aplikasi ID: ${application.id}`;

    // Tampilkan data menggunakan ApplicationInfo atau custom UI
    return (
        <div className="p-4 lg:p-6">
            <div className="mb-4">
                <Link
                    to="/applications"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                    <i className="fas fa-arrow-left mr-2"></i> Kembali ke Daftar
                </Link>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">{applicationTitle}</h1>

            <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                <ApplicationInfo
                    applicationData={application}
                />
            </div>

            {/* Tambahkan bagian lain seperti Riwayat Status, Dokumen, atau Komentar di sini */}
            {/* <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Status</h2>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-600">
                    Fitur riwayat status belum diimplementasikan.
                </div>
            </div> */}
        </div>
    );
};

export default ApplicationDetail;