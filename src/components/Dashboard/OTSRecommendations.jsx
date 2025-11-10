import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { dashboardAPI } from "../../services/api";

const OTSRecommendations = () => {
  const {
    data: recommendations,
    loading,
    error,
  } = useApi(dashboardAPI.getOtsRecommendations);

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);

  // const recommendations = [
  //   {
  //     id: "APL-2023-0011",
  //     name: "CV. Sejahtera Bersama",
  //     issue: "Perbaikan dokumen agunan utama",
  //     timestamp: "2024-11-12T14:30:00Z",
  //     type: "warning",
  //   },
  //   {
  //     id: "APL-2023-0009",
  //     name: "PT. Bina Usaha",
  //     issue: "Lengkapi izin usaha yang berlaku",
  //     timestamp: "2024-11-12T14:30:00Z",
  //     type: "danger",
  //   },
  //   {
  //     id: "APL-2023-0008",
  //     name: "UD. Sumber Rejeki",
  //     issue: "Perbaikan laporan keuangan 6 bulan terakhir",
  //     timestamp: "2024-11-12T14:30:00Z",
  //     type: "warning",
  //   },
  // ];

  const timeSince = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";

    return Math.floor(seconds) + " detik lalu";
  };

  const getTypeClasses = (type) => {
    const classes = {
      warning: {
        border: "border-warning-200",
        bg: "bg-amber-50",
        iconBg: "bg-warning",
        icon: "exclamation-triangle",
        button: "text-warning hover:text-amber-700",
      },
      danger: {
        border: "border-red-200",
        bg: "bg-red-50",
        iconBg: "bg-danger",
        icon: "times-circle",
        button: "text-danger hover:text-red-700",
      },
      info: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        iconBg: "bg-primary-500",
        icon: "lightbulb",
        button: "text-primary-600 hover:text-blue-700",
      },
    };
    return classes[type] || classes.warning;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">
            Rekomendasi OTS (On-The-Spot)
          </h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start p-4 border border-gray-100 rounded-xl bg-gray-50"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-4 mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-exclamation-triangle mr-2"></i> Gagal Memuat
          Rekomendasi
        </p>
        <p className="text-sm">Terjadi kesalahan: {error}</p>
        <p className="text-xs mt-1">Cek koneksi API LLM Anda.</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Rekomendasi OTS (On-The-Spot)
        </h3>
        <div className="text-center py-10 text-gray-500">
          <i className="fas fa-check-circle text-4xl mb-3 text-success"></i>
          <p className="font-medium">
            Semua aplikasi tampak baik, tidak ada rekomendasi OTS saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">
          Rekomendasi OTS (On-The-Spot)
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const typeClasses = getTypeClasses(rec.type);
            return (
              <div
                key={index}
                className={`flex items-start p-4 border rounded-xl ${typeClasses.border} ${typeClasses.bg}`}
              >
                <div
                  className={`p-2 rounded-lg mr-4 mt-1 ${typeClasses.iconBg}`}
                >
                  <i className={`fas fa-${typeClasses.icon} text-white`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {rec.id}: {rec.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{rec.issue}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <i className="far fa-clock mr-1"></i> Diperbarui{" "}
                    {timeSince(rec.timestamp)}
                  </div>
                </div>
                <button className={`ml-2 ${typeClasses.button}`}>
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OTSRecommendations;
