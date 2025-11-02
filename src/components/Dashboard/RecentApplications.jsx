const RecentApplications = () => {
  const applications = [
    {
      id: "APL-2023-0012",
      name: "PT. Maju Jaya Abadi",
      score: 85,
      status: "Layak",
      statusColor: "green",
    },
    {
      id: "APL-2023-0011",
      name: "CV. Sejahtera Bersama",
      score: 75,
      status: "Layak Bersyarat",
      statusColor: "yellow",
    },
    {
      id: "APL-2023-0010",
      name: "UD. Makmur Sentosa",
      score: 45,
      status: "Tidak Layak",
      statusColor: "red",
    },
  ];

  const getStatusClass = (color) => {
    const classes = {
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
    };
    return classes[color] || classes.green;
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 70) return "bg-warning";
    return "bg-danger";
  };

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
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                      app.statusColor
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
