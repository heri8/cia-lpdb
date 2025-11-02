const RequiredDocuments = () => {
  const documents = [
    {
      icon: "file-pdf",
      title: "Form Aplikasi",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "file-contract",
      title: "Akta/AD-ART/SK",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "chart-line",
      title: "RAT",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "table",
      title: "RK 6 Bulan",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "balance-scale",
      title: "LK (Neraca/LR/AK)",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "id-card",
      title: "KTP",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "building",
      title: "NIB/NPWP/Izin",
      description: "Wajib",
      status: "Belum",
      statusColor: "text-red-500",
    },
    {
      icon: "home",
      title: "Dokumen Agunan",
      description: "Opsional",
      status: "Opsional",
      statusColor: "text-gray-400",
    },
  ];

  return (
    <div className="mb-8">
      <h4 className="font-medium text-gray-800 mb-4">
        Dokumen yang Diperlukan
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center p-3 border border-gray-200 rounded-xl file-item"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <i className={`fas fa-${doc.icon} text-blue-500`}></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{doc.title}</p>
              <p className="text-xs text-gray-500">{doc.description}</p>
            </div>
            <span className={`text-xs ${doc.statusColor}`}>{doc.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequiredDocuments;
