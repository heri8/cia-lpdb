import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { dashboardAPI } from "../../services/api";

const StatsCards = () => {
  // TODO: ketika api backend sudah siap
  // const { data: apiData, loading, error } = useApi(dashboardAPI.getStats);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const getColorClasses = (color) => {
    const classes = {
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-500",
        progress: "bg-blue-500",
        glow: "",
      },
      success: {
        bg: "bg-green-50",
        text: "text-success",
        progress: "bg-success",
        glow: "glow-success",
      },
      warning: {
        bg: "bg-yellow-50",
        text: "text-warning",
        progress: "bg-warning",
        glow: "glow-warning",
      },
      danger: {
        bg: "bg-red-50",
        text: "text-danger",
        progress: "bg-danger",
        glow: "glow-danger",
      },
    };
    return classes[color] || classes.blue;
  };

  /*
  contoh data balikan dari backend
    {
      "totalApplications": 142,
      "totalApproved": 78,
      "totalConditional": 35,
      "totalRejected": 29,
      "trend": "12% dari bulan lalu"
    }
  */

  const formatStatsData = (data) => {
    if (!data) return [];

    const totalApplications = data.totalApplications || 0;

    const calculateProgress = (value) => {
      return totalApplications > 0
        ? Math.round((value / totalApplications) * 100)
        : 0;
    };

    return [
      {
        title: "Total Aplikasi",
        value: totalApplications.toString(),
        trend: data.trend || "Data bulan ini",
        icon: "file-alt",
        color: "blue",
        progress: 100,
        valueColor: "text-gray-800",
      },
      {
        title: "Layak",
        value: (data.totalApproved || 0).toString(),
        description: "≥80 skor",
        icon: "check-circle",
        color: "success",
        progress: calculateProgress(data.totalApproved || 0),
        valueColor: "text-success",
      },
      {
        title: "Layak Bersyarat",
        value: (data.totalConditional || 0).toString(),
        description: "70-79.9 skor",
        icon: "exclamation-circle",
        color: "warning",
        progress: calculateProgress(data.totalConditional || 0),
        valueColor: "text-warning",
      },
      {
        title: "Tidak Layak",
        value: (data.totalRejected || 0).toString(),
        description: "<60 skor",
        icon: "times-circle",
        color: "danger",
        progress: calculateProgress(data.totalRejected || 0),
        valueColor: "text-danger",
      },
    ];
  };

  // const stats = apiData ? formatStatsData(apiData) : [];

  // data dummy
  const stats = [
    {
      title: "Total Aplikasi",
      value: "142",
      trend: "12% dari bulan lalu",
      icon: "file-alt",
      color: "blue",
      progress: 100,
      valueColor: "text-gray-800",
    },
    {
      title: "Layak",
      value: "78",
      description: "≥80 skor",
      icon: "check-circle",
      color: "success",
      progress: 55,
      valueColor: "text-success",
    },
    {
      title: "Layak Bersyarat",
      value: "35",
      description: "70-79.9 skor",
      icon: "exclamation-circle",
      color: "warning",
      progress: 25,
      valueColor: "text-warning",
    },
    {
      title: "Tidak Layak",
      value: "29",
      description: "<60 skor",
      icon: "times-circle",
      color: "danger",
      progress: 20,
      valueColor: "text-danger",
    },
  ];

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-soft p-5 border border-gray-100 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mt-3"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="mt-4">
              <div className="progress-bar">
                <div className="h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 lg:col-span-4 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
        <p className="font-semibold mb-2">
          <i className="fas fa-exclamation-triangle mr-2"></i> Gagal Memuat Data
          Statistik
        </p>
        <p className="text-sm">Terjadi kesalahan: {error}</p>
        <p className="text-xs mt-1">
          Cek koneksi API Anda di halaman Konfigurasi.
        </p>
      </div>
    );
  }

  return (
    <>
      {stats.map((stat, index) => {
        const colorClasses = getColorClasses(stat.color);
        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-soft p-5 card-hover border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold mt-1 ${stat.valueColor}`}>
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.trend ? (
                    <span className="text-xs text-success bg-green-50 px-2 py-1 rounded-full">
                      <i className="fas fa-arrow-up mr-1"></i>
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {stat.description}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`${colorClasses.bg} p-3 rounded-xl ${colorClasses.glow}`}
              >
                <i
                  className={`fas fa-${stat.icon} ${colorClasses.text} text-xl`}
                ></i>
              </div>
            </div>
            <div className="mt-4">
              <div className="progress-bar">
                <div
                  className={`progress-fill ${colorClasses.progress}`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default StatsCards;
