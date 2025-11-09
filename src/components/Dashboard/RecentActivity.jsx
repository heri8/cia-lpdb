import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { dashboardAPI } from "../../services/api";

const RecentActivity = () => {
  //     const {
  //     data: activities,
  //     loading,
  //     error
  //   } = useApi(dashboardAPI.getRecentActivity);

  // TODO: dihapus ketika api backend sudah ada
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const activities = [
    {
      id: 101,
      title: "Aplikasi APL-2023-0012 diunggah",
      type: "upload",
      timestamp: "2024-11-12T14:30:00Z",
    },
    {
      id: 102,
      title: "Skoring selesai untuk APL-2023-0011",
      type: "scoring",
      timestamp: "2024-11-12T14:30:00Z",
    },
    {
      id: 103,
      title: "Analisis LLM dilakukan untuk 5 aplikasi",
      type: "llm",
      timestamp: "2024-11-12T14:30:00Z",
    },
  ];

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

  const getActivityClasses = (type) => {
    const classes = {
      upload: {
        icon: "file-upload",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-500",
      },
      scoring: {
        icon: "check-circle",
        iconBg: "bg-green-100",
        iconColor: "text-success",
      },
      llm: {
        icon: "robot",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-500",
      },
      config: {
        icon: "cog",
        iconBg: "bg-yellow-100",
        iconColor: "text-warning",
      },
      default: {
        icon: "info-circle",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-500",
      },
    };
    return classes[type] || classes.default;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-exclamation-triangle mr-2"></i> Gagal Memuat
          Aktivitas
        </p>
        <p className="text-sm">Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
        <div className="text-center py-5 text-gray-500">
          <i className="fas fa-history text-4xl mb-3"></i>
          <p className="font-medium">Belum ada aktivitas baru tercatat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const classes = getActivityClasses(activity.type);
            return (
              <div key={index} className="flex">
                <div className={`p-2 rounded-lg mr-3 ${classes.iconBg}`}>
                  <i
                    className={`fas fa-${classes.icon} ${classes.iconColor}`}
                  ></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {timeSince(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
