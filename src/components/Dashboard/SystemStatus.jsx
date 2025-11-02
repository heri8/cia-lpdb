const SystemStatus = () => {
  const systems = [
    {
      name: "OCR Service",
      status: "Normal",
      statusColor: "success",
      dotColor: "bg-success",
    },
    {
      name: "Scoring Engine",
      status: "Normal",
      statusColor: "success",
      dotColor: "bg-success",
    },
    {
      name: "LLM Service",
      status: "Load Tinggi",
      statusColor: "warning",
      dotColor: "bg-warning",
    },
    {
      name: "Database",
      status: "Normal",
      statusColor: "success",
      dotColor: "bg-success",
    },
  ];

  const getStatusClass = (color) => {
    const classes = {
      success: "text-success bg-green-100",
      warning: "text-warning bg-yellow-100",
    };
    return classes[color] || classes.success;
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Status Sistem</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {systems.map((system, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <span className={`status-dot ${system.dotColor}`}></span>
                <span className="font-medium">{system.name}</span>
              </div>
              <span
                className={`text-xs ${getStatusClass(
                  system.statusColor
                )} px-2 py-1 rounded-full font-medium`}
              >
                {system.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
