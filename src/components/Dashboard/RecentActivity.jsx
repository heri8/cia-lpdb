const RecentActivity = () => {
  const activities = [
    {
      icon: "file-upload",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      title: "Aplikasi APL-2023-0012 diunggah",
      time: "2 jam yang lalu",
    },
    {
      icon: "check-circle",
      iconBg: "bg-green-100",
      iconColor: "text-success",
      title: "Skoring selesai untuk APL-2023-0011",
      time: "4 jam yang lalu",
    },
    {
      icon: "robot",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      title: "Analisis LLM dilakukan untuk 5 aplikasi",
      time: "6 jam yang lalu",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex">
              <div className={`p-2 rounded-lg mr-3 ${activity.iconBg}`}>
                <i
                  className={`fas fa-${activity.icon} ${activity.iconColor}`}
                ></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
