import React, { useState, useCallback, useEffect } from "react";
import { applicationsAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import NewApplicationModal from "../components/Application/NewApplicationModal";
import moment from "moment";

const PAGE_SIZE = 10;

const getStatusClass = (status) => {
    const normalizedStatus = status?.toUpperCase();
    const classes = {
        BARU: "bg-blue-100 text-blue-800",
        DRAFT: "bg-gray-100 text-gray-800",
        REVIEW_EKSTRAKSI: "bg-purple-100 text-purple-800",
        LAYAK: "bg-green-100 text-green-800",
        BERSYARAT: "bg-yellow-100 text-yellow-800",
        TIDAK_LAYAK: "bg-red-100 text-red-800",
    };

    if (normalizedStatus?.includes("LAYAK BERSYARAT")) return classes.BERSYARAT;
    if (normalizedStatus?.includes("LAYAK")) return classes.LAYAK;
    if (normalizedStatus?.includes("TIDAK LAYAK")) return classes.TIDAK_LAYAK;
    if (normalizedStatus === "BARU") return classes.BARU;
    if (normalizedStatus === "REVIEW_EKSTRAKSI") return classes.REVIEW_EKSTRAKSI;

    return classes.DRAFT;
};

const Applications = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const pageSize = PAGE_SIZE;
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const openModal = () => setIsModalOpen(true);

    const fetchApplications = useCallback(() => {
        const params = {
            page: currentPage,
            limit: pageSize,
            status_filter: statusFilter,
            search: debouncedSearchTerm,
        };
        return applicationsAPI.getAll(params);
    }, [currentPage, statusFilter, debouncedSearchTerm, pageSize]);

    const { data, loading, error, refetch } = useApi(fetchApplications, [
        currentPage,
        statusFilter,
        debouncedSearchTerm
    ]);

    const handleRefetch = useCallback(() => {
        if (refetch) {
            refetch();
        }
    }, [refetch]);

    const closeModal = () => {
        setIsModalOpen(false);
        handleRefetch();
    };

    const handleNewApplicationCreated = (id) => {
        handleRefetch();
    };

    useEffect(() => {
        if (currentPage !== 1 && (debouncedSearchTerm !== "" || statusFilter !== "")) {
            setCurrentPage(1);
        }
    }, [debouncedSearchTerm, statusFilter]);

    const applications = data?.items || [];
    const totalItems = data?.total_items || 0;
    const totalPages = data?.total_pages || 0;

    const apiCurrentPage = data?.current_page || currentPage;

    const fromItem = totalItems > 0 ? (apiCurrentPage - 1) * pageSize + 1 : 0;
    const toItem = Math.min(apiCurrentPage * pageSize, totalItems);


    const handlePreviousPage = () => {
        if (apiCurrentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (apiCurrentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleViewDetail = (applicationId) => {
        navigate(`/applications/${applicationId}`);
    };

    const handleUploadDoc = (applicationId) => {
        navigate(`/upload/${applicationId}`);
    };

    const renderContent = () => {
        if (loading && applications.length === 0) {
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
                        onClick={handleRefetch}
                        className="ml-4 text-sm font-medium underline mt-2"
                    >
                        Coba Lagi
                    </button>
                </div>
            );
        }

        if (applications.length === 0 && !loading) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-inbox fa-3x mb-3 text-gray-300"></i>
                    <p className="text-lg font-semibold">Tidak ada data aplikasi yang ditemukan.</p>
                    <p className="text-sm">Coba ubah filter atau tambah aplikasi baru.</p>
                </div>
            );
        }

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No.
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No. Proposal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tgl. Proposal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Nasabah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Skor Final
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Pengajuan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app, index) => {
                                const rowNumber = (apiCurrentPage - 1) * pageSize + index + 1;

                                return (
                                    <tr key={app.id} className="hover:bg-gray-50 transition">

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900">{rowNumber}</p>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-900">{app.nomor_proposal_internal || '-'}</p>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {app.tanggal_proposal ? moment(app.tanggal_proposal).format('DD MMMM YYYY') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-900">{app.nama_nasabah}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {app.skor_final || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs rounded-full ${getStatusClass(app.status_pengajuan)} font-medium`}>
                                                {app.status_pengajuan.replace(/_/g, ' ')}
                                            </span>
                                        </td>

                                        {/* Kolom 7: Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2 justify-center">
                                                {/* Tombol Lihat Detail */}
                                                <button
                                                    onClick={() => handleViewDetail(app.id)}
                                                    className="px-2 py-1 bg-blue-500 text-white rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                                    title="Lihat Detail"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>

                                                {/* Tombol Upload Dokumen */}
                                                <button
                                                    onClick={() => handleUploadDoc(app.id)}
                                                    className="px-2 py-1 bg-green-500 text-white rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                                    title="Upload Dokumen"
                                                >
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Kontrol Pagination */}
                {totalItems > 0 && totalPages > 1 && (
                    <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200 bg-white">
                        <p className="text-sm text-gray-700">
                            Menampilkan <span className="font-medium">{fromItem}</span> sampai <span className="font-medium">{toItem}</span> dari <span className="font-medium">{totalItems}</span> hasil
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={apiCurrentPage === 1 || loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <i className="fas fa-chevron-left mr-2"></i> Sebelumnya
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={apiCurrentPage >= totalPages || loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Selanjutnya <i className="fas fa-chevron-right ml-2"></i>
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

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
                    {/* <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                        }}
                        className="w-full md:w-1/6 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Semua Status</option>
                        <option value="Layak">Layak</option>
                        <option value="Layak Bersyarat">Layak Bersyarat</option>
                        <option value="Tidak Layak">Tidak Layak</option>
                        <option value="Draft">Draft</option>
                        <option value="REVIEW_EKSTRAKSI">Review Ekstraksi</option>
                    </select> */}

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

            <NewApplicationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onNewApplicationCreated={handleNewApplicationCreated}
            />
        </div>
    );
};

export default Applications;