import React, { useState } from "react";
// import moment from "moment"; // Dihapus dan diganti dengan fungsi native JS
import Modal from "./Modal"; // Sesuaikan path import Modal jika berbeda

// --- 1. Helper Function ---

// Helper function untuk format rupiah
const formatRupiah = (number) => {
    if (number === null || number === undefined || number === "") return "N/A";
    // Menggunakan Number(number) untuk memastikan format bekerja
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(number));
};

// Helper function untuk format tanggal tanpa moment
const formatDateTime = (dateString, showTime = false) => {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            ...(showTime && { hour: "2-digit", minute: "2-digit" }),
        });
    } catch (e) {
        return "-";
    }
};

// --- 2. Komponen DisplayField ---

const DisplayField = ({ label, value, isFullWidth = false }) => (
    <div
        className={`p-3 bg-gray-50 rounded-xl border border-gray-200 ${isFullWidth ? "lg:col-span-3" : ""
            }`}
    >
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
        </p>
        {/* Menggunakan whitespace-pre-wrap untuk menampilkan string dengan line break (\n) */}
        <p className="text-sm font-semibold text-gray-800 break-words whitespace-pre-wrap">
            {value || "-"}
        </p>
    </div>
);

// --- 3. Komponen AnalysisScoreField (Untuk skor yang dapat diklik) ---

const AnalysisScoreField = ({ label, score, detailData, openModal }) => {
    const scoreValue = Number(score);

    // Logic penentuan warna skor
    const scoreColor = (s) => {
        if (s >= 70) return "text-green-600 bg-green-100";
        if (s >= 50) return "text-yellow-600 bg-yellow-100";
        if (s > 0) return "text-orange-600 bg-orange-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p
                    className={`text-xl font-bold ${scoreColor(
                        scoreValue
                    )} px-2 py-1 inline-block rounded-lg`}
                >
                    {score !== null && score !== undefined
                        ? `${scoreValue.toFixed(2)}/100`
                        : "-"}
                </p>
            </div>
            {/* Tampilkan tombol Detail hanya jika ada detailData yang valid */}
            {detailData &&
                detailData.variabel &&
                Object.keys(detailData.variabel).length > 0 && (
                    <button
                        onClick={() => openModal(label, detailData)}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Lihat Detail
                    </button>
                )}
        </div>
    );
};

// --- 4. Komponen AnalysisDetailModal (Untuk menampilkan variabel detail) ---
// Komponen ini dipertahankan karena sudah benar

const AnalysisDetailModal = ({ isOpen, onClose, title, detailData }) => {
    if (!detailData) return null;

    const { variabel, catatan_kualitatif } = detailData;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detail Variabel ${title}`}>
            <div className="space-y-6">
                {/* Bagian Catatan Kualitatif */}
                <div>
                    <h4 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                        Catatan Kualitatif
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-xl">
                        {catatan_kualitatif || "Tidak ada catatan kualitatif."}
                    </p>
                </div>

                {/* Bagian Variabel (Faktor Penentu Skor) */}
                <div>
                    <h4 className="text-lg font-bold text-gray-700 mb-3 border-b pb-2">
                        Skor Variabel
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {variabel &&
                            Object.entries(variabel).map(([key, data]) => (
                                <div
                                    key={key}
                                    className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                                >
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                        {data.nama}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <span className="font-bold text-blue-600 mr-2">
                                            Nilai:{" "}
                                            {data.nilai !== null
                                                ? Number(data.nilai).toFixed(2)
                                                : "-"}
                                        </span>
                                        <span>
                                            (Skala: {data.skala !== null ? data.skala : "-"},
                                            Kontribusi:{" "}
                                            {data.kontribusi !== null
                                                ? Number(data.kontribusi).toFixed(2)
                                                : "-"}
                                            )
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                    {(!variabel || Object.keys(variabel).length === 0) && (
                        <p className="text-gray-500 text-sm">
                            Tidak ada detail variabel yang tersedia.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// --- 5. Main Component: ApplicationInfo ---

const ApplicationInfo = ({ applicationData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalData, setModalData] = useState(null);
    // State baru untuk mengontrol tampilan detail
    const [showFullDetails, setShowFullDetails] = useState(false);

    if (!applicationData) {
        return (
            <div className="p-6 text-center text-gray-500">
                Data aplikasi tidak tersedia.
            </div>
        );
    }

    // Handler untuk membuka modal detail
    const openDetailModal = (title, data) => {
        setModalTitle(title);
        setModalData(data);
        setIsModalOpen(true);
    };

    // Handler untuk toggle detail
    const toggleDetails = () => {
        setShowFullDetails((prev) => !prev);
    };

    // --- Data Informasi Utama ---
    const dataDisplay = [
        // Informasi Utama
        { label: "ID Aplikasi", value: applicationData.id },
        { label: "ID Nasabah", value: applicationData.nasabah_id },
        {
            label: "No. Proposal Internal",
            value: applicationData.nomor_proposal_internal,
        },
        {
            label: "Tanggal Proposal",
            value: formatDateTime(applicationData.tanggal_proposal),
        }, // Menggunakan helper baru
        {
            label: "Jumlah Pembiayaan",
            value: formatRupiah(applicationData.jumlah_pembiayaan_diajukan),
        },
        { label: "Tenor (Bulan)", value: applicationData.tenor_diminta_bulan },
        {
            label: "Suku Bunga Diminta (%)",
            value: applicationData.suku_bunga_diminta
                ? `${Number(applicationData.suku_bunga_diminta).toFixed(2)}%`
                : "-",
        },
        { label: "Tipe Sektor", value: applicationData.tipe_sektor || "-" },
        {
            label: "Tujuan Pembiayaan",
            value: applicationData.tujuan_pembiayaan || "-",
        },
    ];

    // --- Data Skor Analisis ---
    const analysisDisplay = [
        {
            label: "Skor Final",
            value: applicationData.skor_final,
            detailData: null, // Tidak ada detail modal untuk skor final
        },
        {
            label: "Skor Analisis Yuridis",
            value: applicationData.skor_yuridis,
            detailData: applicationData.hasil_yuridis,
        },
        {
            label: "Skor Analisis Bisnis",
            value: applicationData.skor_bisnis,
            detailData: applicationData.hasil_bisnis,
        },
        {
            label: "Skor Analisis Risiko",
            value: applicationData.skor_risiko,
            detailData: applicationData.hasil_risiko,
        },
    ];

    // --- Data Catatan Analis ---
    const finalNotes = applicationData.catatan_final_analis || {};
    const analisis5C = finalNotes.analisis_5c || {};
    const analisisSWOT = finalNotes.analisis_swot || {};

    const statusPengajuan = applicationData.status_pengajuan || "-";

    // Fungsi untuk menentukan kelas warna status (Contoh sederhana)
    const getStatusClass = (status) => {
        const normalizedStatus = status?.toUpperCase();
        if (normalizedStatus?.includes("ANALISIS_SELESAI"))
            return "bg-blue-100 text-blue-800";
        return "bg-gray-100 text-gray-800";
    };

    return (
        <>
            <div className="p-6 bg-white rounded-2xl shadow-soft border border-gray-100">
                {/* 1. Judul dan Status */}
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 flex justify-between items-center">
                    Informasi Aplikasi
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(statusPengajuan)}`}>
                        {statusPengajuan.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </h3>

                {/* 2. Grid Detail Aplikasi (Informasi Utama) - SELALU TERLIHAT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dataDisplay.map((item, index) => (
                        <div key={index}>
                            <DisplayField
                                label={item.label}
                                value={item.value}
                            />
                        </div>
                    ))}
                </div>

                {/* 3. Bagian Skor Analisis Utama (Hasil Scoring) - SELALU TERLIHAT */}
                <h3 className="text-xl font-bold text-gray-800 mt-8 mb-6 border-b border-gray-100 pb-3">
                    Hasil Scoring
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analysisDisplay.map((item, index) => (
                        <div key={index}>
                            <AnalysisScoreField
                                label={item.label}
                                score={item.value}
                                detailData={item.detailData}
                                openModal={openDetailModal}
                            />
                        </div>
                    ))}
                </div>

                {/* 4. Konten Detail Tambahan - HANYA TERLIHAT JIKA showFullDetails TRUE */}
                {showFullDetails && (
                    <div className="mt-8 pt-4">
                        {/* Catatan Kualitatif Per Kategori */}
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                            Catatan Analisis Kualitatif
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DisplayField
                                label="Catatan Analisis Yuridis"
                                value={applicationData.hasil_yuridis?.catatan_kualitatif}
                                isFullWidth={false}
                            />
                            <DisplayField
                                label="Catatan Analisis Bisnis"
                                value={applicationData.hasil_bisnis?.catatan_kualitatif}
                                isFullWidth={false}
                            />
                            <DisplayField
                                label="Catatan Analisis Risiko"
                                value={applicationData.hasil_risiko?.catatan_kualitatif}
                                isFullWidth={false}
                            />
                        </div>

                        {/* Catatan Final Analis (Area Text Lebih Besar) */}
                        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-6 border-b border-gray-100 pb-3">
                            Final Judgement Analis
                        </h3>
                        {/* ... (Rekomendasi, Subjective Judgement, Analisis 5C, SWOT) ... */}

                        {/* Di sini saya berasumsi kode dari Final Judgement, 5C, SWOT, dan Metadata diletakkan */}
                        <DisplayField label="Rekomendasi Final" value={finalNotes.rekomendasi} isFullWidth={true} />
                        <div className="mt-4">
                            <DisplayField label="Subjective Judgement" value={finalNotes.subjective_judgement} isFullWidth={true} />
                        </div>

                        {/* Analisis 5C */}
                        <h4 className="text-lg font-bold text-gray-700 mt-6 mb-4">Analisis 5C</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DisplayField label="Capital" value={analisis5C.capital} />
                            <DisplayField label="Capacity" value={analisis5C.capacity} />
                            <DisplayField label="Character" value={analisis5C.character} />
                            <DisplayField label="Condition" value={analisis5C.condition} />
                            <DisplayField label="Collateral" value={analisis5C.collateral} />
                        </div>

                        {/* Analisis SWOT */}
                        <h4 className="text-lg font-bold text-gray-700 mt-6 mb-4">Analisis SWOT</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            <DisplayField label="Strengths" value={analisisSWOT.strengths} />
                            <DisplayField label="Weaknesses" value={analisisSWOT.weaknesses} />
                            <DisplayField label="Opportunities" value={analisisSWOT.opportunities} />
                            <DisplayField label="Threats" value={analisisSWOT.threats} />
                        </div>

                        {/* Dokumen yang Dikutip */}
                        {finalNotes.sumber_eksternal_dikutip && finalNotes.sumber_eksternal_dikutip.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <DisplayField
                                    label="Sumber Eksternal Dikutip"
                                    value={finalNotes.sumber_eksternal_dikutip.join(', ')}
                                    isFullWidth={true}
                                />
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <DisplayField
                                label="Tanggal Dibuat"
                                value={formatDateTime(applicationData.created_at, true)}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button
                        onClick={() => setShowFullDetails(!showFullDetails)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition flex items-center mx-auto"
                    >
                        <i className={`fas ${showFullDetails ? 'fa-chevron-up' : 'fa-chevron-down'} mr-2`}></i>
                        {showFullDetails ? 'Sembunyikan Detail' : 'Tampilkan Selengkapnya'}
                    </button>
                </div>
            </div>

            {/* Modal untuk Detail Analisis */}
            <AnalysisDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                detailData={modalData}
            />
        </>
    );
};

export default ApplicationInfo;
