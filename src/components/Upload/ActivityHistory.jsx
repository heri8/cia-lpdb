import React, { useState } from 'react';

const INITIAL_DISPLAY_LIMIT = 5;
const formatActivityTime = (timestamp) => {
    if (!timestamp) return '-';
    try {
        // Menggunakan date-fns atau moment di lingkungan nyata akan lebih baik, 
        // namun untuk scope ini, kita gunakan Date standard.
        const date = new Date(timestamp);

        // Pastikan Date objek valid
        if (isNaN(date)) {
            return 'Tanggal tidak valid';
        }

        // Format: 12 Nov 2025, 17:48
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        // Tangani error parsing
        return 'Tanggal tidak valid';
    }
};

const activityTypeMap = {
    // Tipe untuk analisis selesai (Skor Final)
    selesai: {
        icon: 'fas fa-check-circle',
        color: 'text-green-500',
        bg: 'bg-green-500',
        label: 'Analisis Selesai',
    },
    // Tipe untuk scoring per kategori (Yuridis, Bisnis, Risiko, dll.)
    scoring: {
        icon: 'fas fa-calculator',
        color: 'text-blue-500',
        bg: 'bg-blue-500',
        label: 'Proses Scoring',
    },
    // Tipe untuk unggahan dokumen
    upload: {
        icon: 'fas fa-file-upload',
        color: 'text-purple-500',
        bg: 'bg-purple-500',
        label: 'Unggah Dokumen',
    },
    // Tipe default untuk aktivitas lain
    default: {
        icon: 'fas fa-info-circle',
        color: 'text-gray-500',
        bg: 'bg-gray-500',
        label: 'Aktivitas Lain',
    }
};

const ActivityHistory = ({ history = [] }) => {
    const [showAll, setShowAll] = useState(false);

    const sortedHistory = [...history].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    const displayedHistory = showAll
        ? sortedHistory
        : sortedHistory.slice(0, INITIAL_DISPLAY_LIMIT);

    const shouldShowToggle = sortedHistory.length > INITIAL_DISPLAY_LIMIT;
    const isExpanded = showAll;

    const renderActivityItem = (activity, index) => {
        const typeInfo = activityTypeMap[activity.type] || activityTypeMap.default;
        const isLast = index === sortedHistory.length - 1;

        return (
            <li key={activity.id} className="relative">
                {!isLast && (
                    <div
                        className="absolute left-[11.5px] top-6 h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                    ></div>
                )}

                <div className="relative flex items-start space-x-3">
                    <div className="z-10">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${typeInfo.bg}`}>
                            <i className={`${typeInfo.icon} text-white text-xs`}></i>
                        </span>
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5 pb-4">
                        <p className="text-sm font-semibold text-gray-900">
                            {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            <span className="font-medium mr-2">{typeInfo.label}</span>
                            &bull; {formatActivityTime(activity.timestamp)}
                        </p>
                    </div>
                </div>
            </li>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 mt-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                Riwayat Aktifitas Aplikasi
            </h2>

            {sortedHistory.length > 0 ? (
                <ul role="list" className="-mb-6">
                    {displayedHistory.map(renderActivityItem)}
                </ul>
            ) : (
                <div className="text-center p-4 bg-gray-50 rounded-xl text-gray-500">
                    Belum ada riwayat aktivitas untuk aplikasi ini.
                </div>
            )}

            {shouldShowToggle && (
                <div className={`flex justify-center mt-6 pt-4 ${isExpanded ? 'border-t border-gray-100' : ''}`}>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition text-sm flex items-center"
                    >
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} mr-2`}></i>
                        {isExpanded
                            ? `Sembunyikan Detail (${sortedHistory.length} item)`
                            : `Tampilkan Selengkapnya (${sortedHistory.length - INITIAL_DISPLAY_LIMIT} item lainnya)`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory;