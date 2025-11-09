import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { systemAPI } from "../../services/api";

const SystemStatus = () => {
  //     const {
  //     data: systems,
  //     loading,
  //     error
  //   } = useApi(systemAPI.getStatus);

  // TODO: dihapus ketika api backend sudah ada
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const systems = [
    {
      name: "OCR Service",
      status: "Normal",
      type: "success",
    },
    {
      name: "Scoring Engine",
      status: "Normal",
      type: "success",
    },
    {
      name: "LLM Service",
      status: "Load Tinggi",
      type: "warning",
    },
    {
      name: "Database",
      status: "Normal",
      type: "success",
    },
  ];

  const getStatusClasses = (type) => {
    const classes = {
      success: {
        text: "text-success bg-green-100",
        dot: "bg-success",
      },
      warning: {
        text: "text-warning bg-yellow-100",
        dot: "bg-warning",
      },
      danger: {
        text: "text-danger bg-red-100",
        dot: "bg-danger",
      },
      default: {
        text: "text-gray-500 bg-gray-100",
        dot: "bg-gray-500",
      },
    };
    return classes[type] || classes.default;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Status Sistem</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-gray-200 mr-3 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
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
          Status
        </p>
        <p className="text-sm">Terjadi kesalahan: {error}</p>
        <p className="text-xs mt-1">Status sistem mungkin tidak akurat.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Status Sistem</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {systems?.map((system, index) => {
            const classes = getStatusClasses(system.type);
            return (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className={`status-dot ${classes.dot}`}></span>
                  <span className="font-medium">{system.name}</span>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${classes.text} font-medium`}
                >
                  {system.status}
                </span>
              </div>
            );
          })}

          {(!systems || systems.length === 0) && (
            <div className="text-center py-5 text-gray-500">
              <i className="fas fa-server text-4xl mb-3"></i>
              <p className="font-medium">
                Tidak ada data komponen sistem yang tersedia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
