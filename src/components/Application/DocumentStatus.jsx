import React, { useState } from "react";

const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal Tidak Diketahui';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return 'Format Tanggal Invalid';
    }
};

const getStatusClass = (status) => {
    const normalizedStatus = status?.toUpperCase();
    const classes = {
        VALID: 'bg-green-100 text-green-700 border-green-200',
        MENUNGGU_VERIFIKASI: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        DITOLAK: 'bg-red-100 text-red-700 border-red-200',
        DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    // Mapping status yang mungkin
    if (normalizedStatus === 'VALID' || normalizedStatus === 'LENGKAP') return classes.VALID;
    if (normalizedStatus === 'MENUNGGU VERIFIKASI' || normalizedStatus === 'PROSES') return classes.MENUNGGU_VERIFIKASI;
    if (normalizedStatus === 'TIDAK VALID' || normalizedStatus === 'DITOLAK') return classes.DITOLAK;

    // Default
    return classes.DRAFT;
};

// Komponen DocumentStatus
const DocumentStatus = ({ documents = [], title = "Status Dokumen Aplikasi" }) => {
    // State untuk mengontrol apakah semua item ditampilkan atau hanya MAX_ITEMS
    const [showAll, setShowAll] = useState(false);

    // Batasan maksimal item yang ditampilkan di awal
    const MAX_ITEMS = 3;

    // Mengurutkan dokumen berdasarkan uploaded_at dari yang terbaru
    const sortedDocuments = [...documents].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    // Menentukan daftar item yang akan ditampilkan
    const finalItemsToShow = showAll ? sortedDocuments : sortedDocuments.slice(0, MAX_ITEMS);

    // Cek apakah ada lebih dari MAX_ITEMS item
    const hasMore = documents.length > MAX_ITEMS;

    const toggleShowAll = () => {
        setShowAll(prev => !prev);
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{title} ({documents.length} dokumen)</h2>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">

                {documents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Belum ada dokumen yang diunggah untuk aplikasi ini.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {finalItemsToShow.map((item, index) => (
                            <li key={item.id || index} className="py-4 flex justify-between items-start space-x-4">

                                {/* Nama File & Tipe */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={item.nama_file_asli}>
                                        {item.nama_file_asli || 'Nama File Tidak Diketahui'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tipe: <span className="font-medium text-gray-700">{item.tipe_dokumen || 'Lainnya'}</span>
                                    </p>
                                </div>

                                {/* Status & Tanggal */}
                                <div className="flex-shrink-0 flex flex-col items-end space-y-2">
                                    {/* Badge Status */}
                                    {/* <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusClass(item.status || 'DRAFT')}`}
                                    >
                                        {(item.status || 'DRAFT').replace(/_/g, ' ').toUpperCase()}
                                    </span> */}
                                    {/* Tanggal Upload */}
                                    <p className="text-xs text-gray-400">
                                        {formatDate(item.uploaded_at)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Tombol Read More/Collapse */}
                {hasMore && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                        <button
                            onClick={toggleShowAll}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition flex items-center mx-auto"
                        >
                            <i className={`fas ${showAll ? 'fa-chevron-up' : 'fa-chevron-down'} mr-2`}></i>
                            {showAll ? 'Tampilkan Lebih Sedikit' : `Tampilkan Semua (${documents.length - MAX_ITEMS} lainnya)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentStatus;