import React, { useState, useCallback, useEffect } from "react";
import { applicationsAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import ApplicationInfo from "../components/Upload/ApplicationInfo";
import Modal from "../components/Application/Modal";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

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

    // Default untuk status lain
    return classes.DRAFT;
};

const Applications = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiLoading, setAiLoading] = useState({});
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchApplications = useCallback(() => {
        const params = {
            page: currentPage,
            limit: pageSize,
            status_filter: statusFilter,
            search: debouncedSearchTerm,
        };
        return applicationsAPI.getAll(params);
    }, [currentPage, statusFilter, debouncedSearchTerm]);

    useEffect(() => {
        // Cek jika debouncedSearchTerm bukan nilai awal
        if (debouncedSearchTerm !== "") {
            setCurrentPage(1);
        }
        refetch();
    }, [debouncedSearchTerm]);

    const { data, loading, error, refetch } = useApi(fetchApplications);

    const applications = data?.items || [];
    const totalItems = data?.total_items || 0;
    const totalPages = data?.total_pages || 0;

    const fromItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const toItem = Math.min(currentPage * pageSize, totalItems);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleViewDetail = (applicationId) => {
        navigate(`/applications/${applicationId}`);
    };

    const handleUploadDoc = (applicationId) => {
        navigate(`/upload/${applicationId}`);
    };

    const handleTriggerAnalysis = async (applicationId, analysisType) => {
        const key = `${applicationId}-${analysisType}`;
        if (aiLoading[key]) return;

        setAiLoading(prev => ({ ...prev, [key]: true }));

        let apiCall;
        let successMessage;

        switch (analysisType) {
            case 'ekstraksi':
                apiCall = applicationsAPI.runAIExtraction(applicationId);
                successMessage = "Ekstraksi AI";
                break;
            case 'bisnis':
                apiCall = applicationsAPI.runBusinessAnalysis(applicationId);
                successMessage = "Analisis Bisnis";
                break;
            case 'yuridis':
                apiCall = applicationsAPI.runJuridicalAnalysis(applicationId);
                successMessage = "Analisis Yuridis";
                break;
            case 'risiko':
                apiCall = applicationsAPI.runRiskAnalysis(applicationId);
                successMessage = "Analisis Risiko";
                break;
            default:
                setAiLoading(prev => ({ ...prev, [key]: false }));
                return;
        }

        try {
            await apiCall;
            alert(`${successMessage} untuk Aplikasi ID ${applicationId} berhasil dipicu!`);
            refetch(); // Muat ulang data
        } catch (error) {
            console.error(`Gagal memicu ${successMessage}:`, error);
            alert(`Gagal memicu ${successMessage}: ${error.message}`);
        } finally {
            setAiLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="p-6 text-center text-blue-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Memuat data aplikasi...
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-xl">
                    <i className="fas fa-exclamation-triangle mr-2"></i> Terjadi kesalahan saat mengambil data.
                    <p className="text-sm mt-1">{error.toString()}</p>
                    <button
                        onClick={refetch}
                        className="ml-4 text-sm font-medium underline mt-2"
                    >
                        Coba Lagi
                    </button>
                </div>
            );
        }

        if (applications.length === 0) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-inbox fa-3x mb-3 text-gray-300"></i>
                    <p className="text-lg font-semibold">Tidak ada data aplikasi yang ditemukan.</p>
                    <p className="text-sm">Coba ubah filter atau tambah aplikasi baru.</p>
                </div>
            );
        }

        // 6. Render Table
        return (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* 1. ID */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                {/* 2. Nomor Proposal */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No. Proposal
                                </th>
                                {/* 3. Tgl. Proposal (Mengganti Tgl. Pengajuan) */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tgl. Proposal
                                </th>
                                {/* 4. Nama Nasabah (Mengganti Nama Perusahaan) */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Nasabah
                                </th>
                                {/* 5. Skor Final (Mengganti Skor) */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Skor Final
                                </th>
                                {/* 6. Status Pengajuan (Mengganti Status) */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Pengajuan
                                </th>
                                {/* 7. Aksi */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => {

                                const isDocUploaded = app.is_doc_uploaded || (app.status_pengajuan !== 'BARU' && app.status_pengajuan !== 'DRAFT');

                                return (
                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                        {/* ... (Kolom 1 - 6 tetap sama) ... */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900">{app.id}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-900">{app.nomor_proposal_internal || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* ... (Tgl. Proposal) ... */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-900">{app.nama_nasabah}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* ... (Skor Final) ... */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(app.status_pengajuan)} font-medium`}>
                                                {app.status_pengajuan}
                                            </span>
                                        </td>

                                        {/* Kolom 7: Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2 justify-center">
                                                {/* Tombol Lihat Detail */}
                                                {/* <button
                                                    onClick={() => handleViewDetail(app.id)}
                                                    className="text-primary-600 hover:text-primary-700 p-1 rounded"
                                                    title="Lihat Detail"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button> */}

                                                {/* Tombol Upload Dokumen */}
                                                <button
                                                    onClick={() => handleUploadDoc(app.id)}
                                                    className="text-green-600 hover:text-green-700 p-1 rounded"
                                                    title="Upload Dokumen"
                                                >
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                </button>

                                                {isDocUploaded && (
                                                    <div className="flex space-x-1 border-l border-gray-200 ml-2 pl-2">
                                                        {/* Ekstraksi AI (Trigger Pertama) */}
                                                        <ButtonAITrigger
                                                            appId={app.id}
                                                            type="ekstraksi"
                                                            label="AI OCR"
                                                            handler={handleTriggerAnalysis}
                                                            isLoading={aiLoading[`${app.id}-ekstraksi`]}
                                                            color="bg-yellow-500"
                                                        />

                                                        {/* Analisis Bisnis */}
                                                        <ButtonAITrigger
                                                            appId={app.id}
                                                            type="bisnis"
                                                            label="Bisnis"
                                                            handler={handleTriggerAnalysis}
                                                            isLoading={aiLoading[`${app.id}-bisnis`]}
                                                            color="bg-purple-500"
                                                        />

                                                        {/* Analisis Yuridis */}
                                                        <ButtonAITrigger
                                                            appId={app.id}
                                                            type="yuridis"
                                                            label="Yuridis"
                                                            handler={handleTriggerAnalysis}
                                                            isLoading={aiLoading[`${app.id}-yuridis`]}
                                                            color="bg-teal-500"
                                                        />

                                                        {/* Analisis Risiko */}
                                                        <ButtonAITrigger
                                                            appId={app.id}
                                                            type="risiko"
                                                            label="Risiko"
                                                            handler={handleTriggerAnalysis}
                                                            isLoading={aiLoading[`${app.id}-risiko`]}
                                                            color="bg-red-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Kontrol Pagination (Tidak Berubah) */}
                <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200 bg-white">
                    <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{fromItem}</span> sampai <span className="font-medium">{toItem}</span> dari <span className="font-medium">{totalItems}</span> hasil
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <i className="fas fa-chevron-left mr-2"></i> Sebelumnya
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages || totalPages === 0 || loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Selanjutnya <i className="fas fa-chevron-right ml-2"></i>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    const ButtonAITrigger = ({ appId, type, label, handler, isLoading, color }) => (
        <button
            onClick={() => handler(appId, type)}
            disabled={isLoading}
            className={`px-2 py-1 ${color} text-white rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed`}
            title={`Trigger Analisis ${label}`}
        >
            {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
            ) : (
                <>{label}</>
            )}
        </button>
    );

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        refetch();
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-blue-500">
                <i className="fas fa-spinner fa-spin text-2xl mr-2"></i> Memuat data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat data:{" "}
                {error}
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    Daftar Aplikasi
                </h1>

                {/* Filter dan Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Cari ID Aplikasi, Nama Perusahaan..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1); // Reset page
                        }}
                        className="w-full md:w-1/6 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Semua Status</option>
                        <option value="Layak">Layak</option>
                        <option value="Layak Bersyarat">Layak Bersyarat</option>
                        <option value="Tidak Layak">Tidak Layak</option>
                        <option value="Draft">Draft</option>
                    </select>
                    <button
                        onClick={openModal}
                        className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
                        <i className="fas fa-plus mr-2"></i> Aplikasi Baru
                    </button>
                </div>

                {/* Konten Table (Hasil renderContent) */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {renderContent()}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Tambah Aplikasi Pinjaman Baru"
            >
                <ApplicationInfo isModal={true} />
            </Modal>
        </div>
    );
};

export default Applications;
