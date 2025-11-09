import { useState, useMemo } from "react";
import { applicationsAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import ApplicationInfo from "../components/Upload/ApplicationInfo";
import Modal from "../components/Application/Modal";
import { useNavigate } from "react-router-dom";

const mockApplications = [
  {
    id: "APL-2023-0020",
    name: "Koperasi Jaya Baru",
    date: "20 Nov 2023",
    score: 88,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0019",
    name: "PT. Lima Sekawan",
    date: "19 Nov 2023",
    score: 65,
    status: "Pending Review",
  },
  {
    id: "APL-2023-0018",
    name: "CV. Makmur Jaya",
    date: "18 Nov 2023",
    score: 95,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0017",
    name: "UD. Berkah Ilahi",
    date: "17 Nov 2023",
    score: 72,
    status: "Layak Bersyarat",
  },
  {
    id: "APL-2023-0016",
    name: "PT. Sentosa Bersama",
    date: "16 Nov 2023",
    score: 50,
    status: "Tidak Layak",
  },
  {
    id: "APL-2023-0015",
    name: "PT. Sentosa Makmur",
    date: "14 Nov 2023",
    score: 92,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0014",
    name: "CV. Global Mandiri",
    date: "12 Nov 2023",
    score: 77,
    status: "Layak Bersyarat",
  },
  {
    id: "APL-2023-0013",
    name: "UD. Sumber Rejeki",
    date: "11 Nov 2023",
    score: 45,
    status: "Tidak Layak",
  },
  {
    id: "APL-2023-0012",
    name: "PT. Maju Jaya Abadi",
    date: "10 Nov 2023",
    score: 85,
    status: "Layak (Diproses)",
  },
  {
    id: "APL-2023-0011",
    name: "Koperasi Unit Desa",
    date: "09 Nov 2023",
    score: 68,
    status: "Pending Review",
  },
  // Tambahkan 10 item lagi untuk mengisi 2 halaman penuh
  {
    id: "APL-2023-0010",
    name: "PT. Sukses Selalu",
    date: "08 Nov 2023",
    score: 81,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0009",
    name: "CV. Cahaya Abadi",
    date: "07 Nov 2023",
    score: 70,
    status: "Layak Bersyarat",
  },
  {
    id: "APL-2023-0008",
    name: "UD. Fast Food",
    date: "06 Nov 2023",
    score: 55,
    status: "Tidak Layak",
  },
  {
    id: "APL-2023-0007",
    name: "PT. Logistik Cepat",
    date: "05 Nov 2023",
    score: 90,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0006",
    name: "Kop. Tani Makmur",
    date: "04 Nov 2023",
    score: 62,
    status: "Pending Review",
  },
  {
    id: "APL-2023-0005",
    name: "PT. Retail Besar",
    date: "03 Nov 2023",
    score: 79,
    status: "Layak Bersyarat",
  },
  {
    id: "APL-2023-0004",
    name: "CV. Konstruksi",
    date: "02 Nov 2023",
    score: 40,
    status: "Tidak Layak",
  },
  {
    id: "APL-2023-0003",
    name: "UD. Jasa Bersih",
    date: "01 Nov 2023",
    score: 83,
    status: "Layak (Diproses)",
  },
  {
    id: "APL-2023-0002",
    name: "PT. Digital Kreatif",
    date: "31 Okt 2023",
    score: 98,
    status: "Layak (Disetujui)",
  },
  {
    id: "APL-2023-0001",
    name: "Kop. Simpan Pinjam",
    date: "30 Okt 2023",
    score: 58,
    status: "Pending Review",
  },
];

const Applications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColor, setFilterColor] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const {
  //   data: applications,
  //   loading,
  //   error,
  //   refetch,
  // } = useApi(applicationsAPI.getAll);

  const applications = mockApplications;
  const loading = false;
  const error = null;

  const handleUploadClick = (applicationId) => {
    // Arahkan ke halaman Upload dan kirim ID Aplikasi melalui state
    navigate("/upload", { state: { applicationId } });
  };

  const getStatusColorFromStatus = (status) => {
    if (status.includes("Disetujui")) return "green";
    if (status.includes("Diproses")) return "blue";
    if (status.includes("Bersyarat")) return "yellow";
    if (status.includes("Tidak Layak")) return "red";
    return "gray";
  };

  const getStatusClass = (color) => {
    const classes = {
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      blue: "bg-blue-100 text-blue-800",
      gray: "bg-gray-100 text-gray-700",
    };
    return classes[color] || classes.gray;
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 70) return "bg-warning";
    return "bg-danger";
  };

  const { paginatedApplications, totalPages, totalFilteredItems } =
    useMemo(() => {
      let filtered = applications.map((app) => ({
        ...app,
        statusColor: getStatusColorFromStatus(app.status),
      }));

      // 1. Filter by Status Color
      if (filterColor !== "all") {
        filtered = filtered.filter((app) => app.statusColor === filterColor);
      }

      // 2. Filter by Search Term
      if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (app) =>
            app.name.toLowerCase().includes(lowerCaseSearch) ||
            app.id.toLowerCase().includes(lowerCaseSearch)
        );
      }

      // 💡 Hitung total item yang difilter dan total halaman
      const totalFilteredItems = filtered.length;
      const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

      // Pastikan halaman saat ini valid
      if (currentPage > totalPages && totalPages > 0) {
        // Jika halaman saat ini tidak valid, reset ke halaman terakhir.
        // Catatan: Dalam kode nyata, Anda mungkin ingin menggunakan setState di luar useMemo,
        // namun untuk menyederhanakan, kita asumsikan state telah diperbarui atau kita hanya menghitung ulang.
      }

      // 💡 Logika Pagination: Menentukan indeks awal dan akhir
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Memotong array hasil filter untuk mendapatkan data halaman saat ini
      const paginatedApplications = filtered.slice(startIndex, endIndex);

      return { paginatedApplications, totalPages, totalFilteredItems };
    }, [applications, filterColor, searchTerm, currentPage, itemsPerPage]); // Tambahkan dependensi pagination

  // --- Utility untuk Pagination UI ---
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
          Daftar Aplikasi Pinjaman
        </h1>
        <p className="text-gray-500 mb-6">
          Kelola dan pantau semua aplikasi pinjaman yang telah didaftarkan.
        </p>

        {/* Controls Section (Search & Filter) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Cari ID Aplikasi atau Nama Perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <div className="flex space-x-3 w-full md:w-auto">
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
            >
              <option value="all">Semua Status</option>
              <option value="green">Layak (Disetujui)</option>
              <option value="blue">Layak (Diproses)</option>
              <option value="yellow">Layak Bersyarat</option>
              <option value="red">Tidak Layak</option>
              <option value="gray">Pending Review/Lainnya</option>
            </select>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition text-sm font-medium"
            >
              <i className="fas fa-plus mr-2"></i> Aplikasi Baru
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  ID Aplikasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Nama Perusahaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tgl Pengajuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor Kredit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    {/* ... (Kolom data tabel) ... */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              app.score
                            )}`}
                            style={{ width: `${app.score}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{app.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                          app.statusColor
                        )} font-medium`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          title="Lihat Detail"
                          className="text-primary-600 hover:text-primary-700 p-1 rounded"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          title="Unduh Laporan"
                          className="text-gray-500 hover:text-gray-700 p-1 rounded"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button
                          onClick={() => handleUploadClick(app.id)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded transition"
                          title="Upload Dokumen"
                        >
                          <i className="fas fa-upload"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada aplikasi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-2 sm:mb-0">
            <p>
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
              <span className="font-semibold">
                {Math.min(currentPage * itemsPerPage, totalFilteredItems)}
              </span>{" "}
              dari total{" "}
              <span className="font-semibold">{totalFilteredItems}</span>{" "}
              aplikasi
              {totalFilteredItems !== applications.length &&
                ` (total data: ${applications.length})`}
            </p>
          </div>

          <div className="flex space-x-1 items-center">
            {/* Items Per Page Selector */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset ke halaman 1 saat mengubah items per page
              }}
              className="px-2 py-1 border border-gray-300 rounded-lg text-xs"
            >
              <option value="5">5/halaman</option>
              <option value="10">10/halaman</option>
              <option value="20">20/halaman</option>
            </select>

            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>

            {/* Page Number Buttons (Disederhanakan) */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg font-medium text-xs transition ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
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
