import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { dashboardAPI } from "../../services/api";

const RecentApplications = () => {
  // const {
  //   data: applications,
  //   loading,
  //   error,
  // } = useApi(dashboardAPI.getRecentApplications);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // TODO: jika api backend sudah ada

  const applications = [
    {
      id: "APL-2023-0012",
      name: "PT. Maju Jaya Abadi",
      score: 85,
      status: "Layak",
    },
    {
      id: "APL-2023-0011",
      name: "CV. Sejahtera Bersama",
      score: 75,
      status: "Layak Bersyarat",
    },
    {
      id: "APL-2023-0010",
      name: "UD. Makmur Sentosa",
      score: 45,
      status: "Tidak Layak",
    },
  ];

  const getStatusClass = (statusText) => {
    const classes = {
      Layak: "bg-green-100 text-green-800",
      "Layak Bersyarat": "bg-yellow-100 text-yellow-800",
      "Tidak Layak": "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return classes[statusText] || classes.default;
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 70) return "bg-warning";
    return "bg-danger";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Aplikasi Terbaru</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Memuat data aplikasi...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-exclamation-triangle mr-2"></i> Gagal Memuat
          Aplikasi
        </p>
        <p className="text-sm">Terjadi kesalahan: {error}</p>
        <p className="text-xs mt-1">Pastikan koneksi API dashboard berjalan.</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Aplikasi Terbaru
        </h3>
        <div className="text-center py-10 text-gray-500">
          <i className="fas fa-inbox text-4xl mb-3"></i>
          <p className="font-medium">Tidak ada aplikasi baru saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Aplikasi Terbaru</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Lihat Semua <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID & Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{app.id}</p>
                    <p className="text-sm text-gray-500">{app.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          app.score
                        )}`}
                        style={{ width: `${app.score}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{app.score}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                      app.status
                    )} font-medium`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 p-1 rounded">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;
