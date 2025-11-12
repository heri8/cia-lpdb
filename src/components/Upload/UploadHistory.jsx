import React, { useState } from "react";
import moment from "moment";

const UploadHistory = ({ history = [] }) => {
    // State untuk mengontrol apakah semua item ditampilkan atau hanya MAX_ITEMS
    const [showAll, setShowAll] = useState(false);

    // Batasan maksimal item yang ditampilkan di awal
    const MAX_ITEMS = 3;

    // Menentukan daftar item yang akan ditampilkan
    const itemsToShow = showAll ? history : history.slice(0, MAX_ITEMS);

    // Cek apakah ada lebih dari MAX_ITEMS item
    const hasMore = history.length > MAX_ITEMS;

    const toggleShowAll = () => {
        setShowAll(prev => !prev);
    };

    // Mengurutkan history berdasarkan uploaded_at dari yang terbaru (opsional, tapi disarankan)
    const sortedHistory = [...history].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
    const finalItemsToShow = showAll ? sortedHistory : sortedHistory.slice(0, MAX_ITEMS);


    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Unggahan Dokumen ({history.length} item)</h2>

            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">

                {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Belum ada riwayat unggahan dokumen untuk aplikasi ini.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {finalItemsToShow.map((item, index) => (
                            <li key={item.id || index} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {item.nama_file_asli || 'Nama File Tidak Diketahui'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tipe Dokumen: <span className="font-medium text-gray-700">{item.tipe_dokumen || 'Lainnya'}</span>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {item.uploaded_at ? moment(item.uploaded_at).format('DD MMM YYYY, HH:mm') : 'Tanggal Tidak Diketahui'}
                                </p>
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
                            {showAll ? (
                                <>
                                    <i className="fas fa-chevron-up mr-2"></i> Tampilkan Lebih Sedikit
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-chevron-down mr-2"></i> Tampilkan Semua ({history.length - MAX_ITEMS} lainnya)
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadHistory;