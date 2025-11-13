import React, { lazy, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { documentsAPI, applicationsAPI } from "../services/api";

const ApplicationInfo = lazy(() => import("../components/Application/ApplicationInfo"));
const DocumentUpload = lazy(() => import("../components/Upload/DocumentUpload"));
const DocumentStatus = lazy(() => import("../components/Application/DocumentStatus"));
const ActivityHistory = lazy(() => import("../components/Upload/ActivityHistory"));

const Upload = () => {
    const { id } = useParams();
    const applicationId = id;

    const [activeTrigger, setActiveTrigger] = useState(null);
    const [extractionMessage, setExtractionMessage] = useState(null);

    const fetchApplicationDetail = useCallback(
        () => applicationsAPI.getById(applicationId),
        [applicationId]
    );

    const {
        data: applicationData,
        loading: loadingApplication,
        error: errorApplication,
        refetch: refetchApplication,
    } = useApi(fetchApplicationDetail, [applicationId]);

    // 1. Definisikan fungsi API yang akan dipanggil oleh useApi
    const fetchDocuments = useCallback(
        () => documentsAPI.getUploadedDocuments(applicationId),
        [applicationId]
    );

    const fetchHistory = useCallback(
        () => documentsAPI.getUploadHistory(applicationId),
        [applicationId]
    );

    const fetchDocumentStatus = React.useCallback(async () => {
        if (!id) return [];
        return documentsAPI.getUploadedDocuments(id);
    }, [id]);
    const { data: documents, loading: loadingDocs, error: errorDocs } = useApi(fetchDocumentStatus, [applicationId]);

    // 2. Panggil useApi untuk fetching data
    const {
        data: uploadedDocuments,
        loading: loadingDocuments,
        error: errorDocuments,
        refetch: refetchDocuments,
    } = useApi(fetchDocuments, [applicationId]);

    const {
        data: uploadHistory,
        loading: loadingHistory,
        error: errorHistory,
        refetch: refetchHistory,
    } = useApi(fetchHistory, [applicationId]);

    const handleUploadComplete = () => {
        refetchDocuments();
        refetchHistory();
    };

    const handleTriggerAI = async (triggerName, apiEndpointFunction) => {
        if (!applicationId) return;
        setExtractionMessage(null);
        setActiveTrigger(triggerName);

        try {
            await apiEndpointFunction(applicationId);

            setExtractionMessage({ type: 'success', text: `${triggerName} berhasil dipicu. Data aplikasi akan diperbarui.` });

            // Perbarui data aplikasi dan, jika perlu, dokumen
            refetchApplication();
            if (triggerName === 'Ekstraksi Dokumen') {
                refetchDocuments();
            }

        } catch (error) {
            const msg = error.response?.data?.message || `Gagal memicu ${triggerName}. Silakan cek log.`;
            setExtractionMessage({ type: 'error', text: msg });
        } finally {
            setActiveTrigger(null);
            // Hapus pesan setelah 7 detik
            setTimeout(() => setExtractionMessage(null), 7000);
        }
    };

    const aiTriggers = [
        {
            name: 'Ekstraksi Dokumen',
            icon: 'magic',
            // ASUMSI: documentsAPI.triggerExtraction sudah ada
            handler: () => handleTriggerAI('Ekstraksi Dokumen', applicationsAPI.runAIExtraction)
        },
        {
            name: 'Analisis Yuridis',
            icon: 'gavel',
            // ASUMSI: applicationsAPI.triggerLegalAnalysis sudah ada
            handler: () => handleTriggerAI('Analisis Yuridis', applicationsAPI.runJuridicalAnalysis)
        },
        {
            name: 'Analisis Bisnis',
            icon: 'chart-line',
            // ASUMSI: applicationsAPI.triggerBusinessAnalysis sudah ada
            handler: () => handleTriggerAI('Analisis Bisnis', applicationsAPI.runBusinessAnalysis)
        },
        {
            name: 'Analisis Risiko',
            icon: 'shield-alt',
            // ASUMSI: applicationsAPI.triggerRiskAnalysis sudah ada
            handler: () => handleTriggerAI('Analisis Risiko', applicationsAPI.runRiskAnalysis)
        },
    ];

    // 3. Gabungkan status loading dan error
    const isLoading = loadingDocuments || loadingHistory;
    const isError = errorDocuments || errorHistory;

    if (!applicationId) {
        return (
            <div className="flex-1 overflow-auto p-4 lg:p-6">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl max-w-6xl mx-auto">
                    <p className="font-semibold">Kesalahan Navigasi</p>
                    <p className="text-sm">ID Aplikasi tidak ditemukan di URL.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 overflow-auto p-4 lg:p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i>
                    <p className="text-gray-600 font-medium">Memuat data aplikasi...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 overflow-auto p-4 lg:p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl max-w-6xl mx-auto">
                    <p className="font-semibold">Terjadi Kesalahan Saat Memuat Data</p>
                    <p className="text-sm">
                        Gagal memuat dokumen atau riwayat unggahan: {isError}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-4 lg:p-6">
            {/* Tombol Kembali */}
            <Link
                to={`/applications`}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
            >
                <i className="fas fa-arrow-left mr-2"></i> Kembali ke Daftar Aplikasi
            </Link>

            {/* Judul Halaman */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Upload & Analisis Dokumen: {applicationData?.nomor_proposal_internal || applicationId}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl shadow-soft border border-gray-100">
                <span className="font-semibold text-gray-700 mr-2 self-center">Trigger Analisis:</span>
                {aiTriggers.map((trigger) => (
                    <button
                        key={trigger.name}
                        onClick={trigger.handler}
                        disabled={activeTrigger !== null}
                        className={`px-4 py-2 text-sm rounded-xl transition font-medium shadow-md
                                ${activeTrigger === trigger.name
                                ? 'bg-yellow-500 text-white cursor-wait'
                                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                            }`}
                    >
                        {activeTrigger === trigger.name ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i> Memproses...</>
                        ) : (
                            <><i className={`fas fa-${trigger.icon} mr-2`}></i> {trigger.name}</>
                        )}
                    </button>
                ))}
            </div>

            {/* Pesan Umpan Balik Ekstraksi */}
            {extractionMessage && (
                <div className={`mb-8 p-4 rounded-xl ${extractionMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    <p className="font-semibold text-sm">{extractionMessage.text}</p>
                </div>
            )}

            {/* Menampilkan Detail Aplikasi (Read-Only) */}
            <div className="mb-8">
                <ApplicationInfo applicationData={applicationData} />
            </div>

            <div className="mt-8">
                <DocumentUpload
                    applicationId={applicationId}
                    uploadedDocuments={uploadedDocuments || []}
                    onUploadComplete={handleUploadComplete}
                />
            </div>

            {/* Riwayat Unggahan */}
            <div className="mt-8">
                <ActivityHistory
                    history={uploadHistory || []}
                />
            </div>

            <div className="mt-8">
                <DocumentStatus
                    documents={documents || []}
                />
            </div>
        </div>
    );
};

export default Upload;
