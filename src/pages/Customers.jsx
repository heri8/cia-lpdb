import React, { useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { customersAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Customers = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 10;

    const fetchCustomers = useCallback(() => {
        const params = {
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
        };
        return customersAPI.getAll(params);
    }, [currentPage, searchTerm]);

    const { data, loading, error, refetch } = useApi(fetchCustomers);

    const isArrayResponse = Array.isArray(data);

    const customers = isArrayResponse ? data : (data?.items || []);
    const totalItems = isArrayResponse ? customers.length : (data?.total_items || 0);
    const totalPages = isArrayResponse ? (customers.length > 0 ? 1 : 0) : (data?.total_pages || 0);

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

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }

    const handleViewDetail = (customerId) => {
        navigate(`/customers/${customerId}`);
    };

    const getGradeClass = (grade) => {
        const normalizedGrade = grade?.toUpperCase();
        const classes = {
            A: "bg-green-100 text-green-800",
            B: "bg-blue-100 text-blue-800",
            C: "bg-yellow-100 text-yellow-800",
        };
        return classes[normalizedGrade] || "bg-gray-100 text-gray-800";
    };

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
                <div className="p-6 text-center text-red-600">
                    <i className="fas fa-exclamation-triangle mr-2"></i> Gagal memuat data: {error.message}
                </div>
            );
        }

        if (customers.length === 0) {
            return (
                <div className="p-10 text-center text-gray-500">
                    <i className="fas fa-users-slash fa-3x mb-3 text-gray-300"></i>
                    <h2 className="text-xl font-semibold">Tidak ada data nasabah ditemukan.</h2>
                    <p className="text-sm">Coba ubah kata kunci pencarian Anda.</p>
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
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Nasabah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipe Nasabah
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kota Domisili
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Grade Koperasi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition">
                                    {/* ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-medium text-gray-900">{customer.id}</p>
                                    </td>
                                    {/* Nama */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-gray-900">{customer.nama || '-'}</p>
                                    </td>
                                    {/* Tipe Nasabah */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-500">{customer.tipe_nasabah || '-'}</p>
                                    </td>
                                    {/* Kota Domisili */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-500">{customer.kota_domisili || '-'}</p>
                                    </td>
                                    {/* Grade Koperasi */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-medium ${getGradeClass(customer.grade_koperasi)}`}
                                        >
                                            {customer.grade_koperasi || 'N/A'}
                                        </span>
                                    </td>
                                    {/* Aksi */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetail(customer.id)}
                                                className="text-primary-600 hover:text-primary-700 p-1 rounded"
                                                title="Lihat Detail Nasabah"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Kontrol Pagination (Jika totalItems > pageSize) */}
                <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200 bg-white">
                    <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{fromItem}</span> sampai <span className="font-medium">{toItem}</span> dari <span className="font-medium">{totalItems}</span> nasabah
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

    return (
        <div className="p-4 lg:p-6">
            <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    Daftar Nasabah
                </h1>

                {/* Search Bar */}
                <div className="flex justify-between items-center mb-6 space-x-4">
                    <input
                        type="text"
                        placeholder="Cari Nama atau Kota Domisili Nasabah..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {/* <button
                        className="w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition font-medium"
                    >
                        <i className="fas fa-plus mr-2"></i> Tambah Nasabah
                    </button> */}
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