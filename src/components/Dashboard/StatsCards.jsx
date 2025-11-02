const StatsCards = () => {
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
