import React from "react";
import moment from "moment";

const formatRupiah = (number) => {
    if (number === null || number === undefined) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(number));
};

const DisplayField = ({ label, value, isFullWidth = false }) => (
    <div className={`p-3 bg-gray-50 rounded-xl border border-gray-200 ${isFullWidth ? 'lg:col-span-3' : ''}`}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
        </p>
        <p className="text-sm font-semibold text-gray-800 break-words">
            {value || '-'}
        </p>
    </div>
);

const ApplicationInfo = ({ applicationData }) => {

    if (!applicationData) {
        return (
            <div className="p-6 text-center text-gray-500">
                Data aplikasi tidak tersedia.
            </div>
        );
    }

    // --- Data yang Diformat ---
    const dataDisplay = [
        // Informasi Utama
        { label: "ID Aplikasi", value: applicationData.id },
        { label: "ID Nasabah", value: applicationData.nasabah_id || '-' },
        { label: "No. Proposal Internal", value: applicationData.nomor_proposal_internal || '-' },
        { label: "Tanggal Proposal", value: applicationData.tanggal_proposal ? moment(applicationData.tanggal_proposal).format('DD MMMM YYYY') : '-' },
        { label: "Status Pengajuan", value: applicationData.status_pengajuan || '-' },

        // Detail Pembiayaan
        { label: "Jumlah Diajukan", value: formatRupiah(applicationData.jumlah_pembiayaan_diajukan) },
        { label: "Tenor Diminta", value: applicationData.tenor_diminta_bulan ? `${applicationData.tenor_diminta_bulan} Bulan` : '-' },
        { label: "Suku Bunga Diminta", value: applicationData.suku_bunga_diminta ? `${Number(applicationData.suku_bunga_diminta).toFixed(2)} %` : '-' },
        { label: "Tujuan Pembiayaan", value: applicationData.tujuan_pembiayaan || '-', isFullWidth: true }, // Menggunakan full width
        { label: "Tipe Sektor", value: applicationData.tipe_sektor || '-' },

        // Hasil Analisis
        { label: "Skor Final", value: applicationData.skor_final || '-' },
        { label: "Hasil Analisis Bisnis", value: applicationData.hasil_bisnis || '-' },
        { label: "Skor Analisis Bisnis", value: applicationData.skor_bisnis || '-' },
        { label: "Hasil Analisis Yuridis", value: applicationData.hasil_yuridis || '-' },
        { label: "Skor Analisis Yuridis", value: applicationData.skor_yuridis || '-' },
        { label: "Hasil Analisis Risiko", value: applicationData.hasil_risiko || '-' },
        { label: "Skor Analisis Risiko", value: applicationData.skor_risiko || '-' },

        // Metadata
        { label: "Tanggal Dibuat", value: applicationData.created_at ? moment(applicationData.created_at).format('DD MMMM YYYY HH:mm') : '-' },
    ];


    return (
        <div className="p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                Informasi Aplikasi
            </h3>

            {/* Grid Detail Aplikasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataDisplay.map((item, index) => (
                    <div key={index} className={item.isFullWidth ? 'lg:col-span-3' : ''}>
                        <DisplayField
                            label={item.label}
                            value={item.value}
                        />
                    </div>
                ))}
            </div>

            {/* Catatan Final Analis (Area Text Lebih Besar) */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <DisplayField
                    label="Catatan Final Analis"
                    value={applicationData.catatan_final_analis || 'Belum ada catatan final.'}
                />
            </div>
        </div>
    );
};

export default ApplicationInfo;