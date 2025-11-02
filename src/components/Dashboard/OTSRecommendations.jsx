const OTSRecommendations = () => {
  const recommendations = [
    {
      id: "APL-2023-0011",
      name: "CV. Sejahtera Bersama",
      issue: "Perbaikan dokumen agunan utama",
      time: "2 jam lalu",
      type: "warning",
    },
    {
      id: "APL-2023-0009",
      name: "PT. Bina Usaha",
      issue: "Lengkapi izin usaha yang berlaku",
      time: "5 jam lalu",
      type: "danger",
    },
    {
      id: "APL-2023-0008",
      name: "UD. Sumber Rejeki",
      issue: "Perbaikan laporan keuangan 6 bulan terakhir",
      time: "1 hari lalu",
      type: "warning",
    },
  ];

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
    };
    return classes[type] || classes.warning;
  };

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
                    <i className="far fa-clock mr-1"></i> Diperbarui {rec.time}
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
