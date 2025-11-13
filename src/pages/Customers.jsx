import React, { useState, useCallback, useMemo, useEffect } from "react";
import { customersAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

// Ukuran halaman yang digunakan untuk client-side pagination
const PAGE_SIZE = 10;

// Fungsi helper untuk menentukan warna grade
const getGradeClass = (grade) => {
    const normalizedGrade = grade?.toUpperCase();
    const classes = {
        A: "bg-green-100 text-green-800",
        B: "bg-blue-100 text-blue-800",
        C: "bg-yellow-100 text-yellow-800",
        D: "bg-orange-100 text-orange-800",
    };
    return classes[normalizedGrade] || "bg-gray-100 text-gray-800";
};

const Customers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // 1. Mengambil semua data nasabah (tanpa pagination di sisi backend)
    // Asumsi: Backend menggunakan parameter skip/limit
    const fetchAllCustomers = useCallback(() => {
        // Kita fetch semua data (misalnya 1000 data) untuk diolah di client
        return customersAPI.getAll({ skip: 0, limit: 1000 });
    }, []);

    // Gunakan useApi untuk fetching data
    const { data: allCustomers, loading, error, refetch } = useApi(fetchAllCustomers, []);

    // Data mentah
    const customersData = allCustomers || [];

    // 2. Client-Side Filtering
    const filteredCustomers = useMemo(() => {
        if (!debouncedSearchTerm) {
            return customersData;
        }

        const lowerCaseSearch = debouncedSearchTerm.toLowerCase();

        return customersData.filter(customer =>
            customer.nama.toLowerCase().includes(lowerCaseSearch) ||
            customer.kota_domisili?.toLowerCase().includes(lowerCaseSearch) ||
            customer.tipe_nasabah.toLowerCase().includes(lowerCaseSearch)
        );
    }, [customersData, debouncedSearchTerm]);

    // 3. Client-Side Pagination Logic
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredCustomers.slice(startIndex, endIndex);
    }, [filteredCustomers, currentPage]);

    // Menghitung Item "Dari" dan "Sampai" untuk tampilan UI
    const fromItem = totalItems > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    const toItem = Math.min(currentPage * PAGE_SIZE, totalItems);

    // 4. Kontrol Pagination
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

    // Reset halaman ke 1 ketika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);


    // 5. Render Content (Loading, Error, Data Kosong)
    const renderContent = () => {
        if (loading) {
            return (
                <div className="p-6 text-center text-blue-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Memuat data nasabah...
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

        if (customersData.length === 0 && !loading) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-users-slash fa-3x mb-3 text-gray-300"></i>
                    <p className="text-lg font-semibold">Tidak ada data nasabah yang ditemukan di server.</p>
                </div>
            );
        }

        if (paginatedCustomers.length === 0 && !loading && debouncedSearchTerm) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-search-minus fa-3x mb-3 text-gray-300"></i>
                    <p className="text-lg font-semibold">Tidak ada nasabah yang cocok dengan kriteria pencarian.</p>
                </div>
            );
        }

        return (
            <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">Nama Nasabah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Tipe Nasabah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Kota Domisili</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Grade</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCustomers.map((customer, index) => {
                                // Penomoran Baris yang Benar
                                const rowNumber = (currentPage - 1) * PAGE_SIZE + index + 1;

                                return (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition">

                                        {/* No. */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900">{rowNumber}</p>
                                        </td>

                                        {/* Nama Nasabah */}
                                        <td className="px-6 py-4">
                                            <p className="text-gray-900 font-semibold">{customer.nama}</p>
                                        </td>

                                        {/* Tipe Nasabah */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-700">{customer.tipe_nasabah}</p>
                                        </td>

                                        {/* Kota Domisili */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-700">{customer.kota_domisili || '-'}</p>
                                        </td>

                                        {/* Grade */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs rounded-full ${getGradeClass(customer.grade_koperasi)} font-bold`}>
                                                {customer.grade_koperasi || 'N/A'}
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => navigate(`/customers/${customer.id}`)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded-xl text-xs font-medium hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                                                title="Lihat Detail"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
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
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <i className="fas fa-chevron-left mr-2"></i> Sebelumnya
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-50 rounded-xl border border-gray-300">
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages}
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    Daftar Nasabah
                </h1>

                {/* Filter dan Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                    <input
                        type="text"
                        placeholder="Cari Nama, Kota, atau Tipe Nasabah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Konten Table */}
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Customers;