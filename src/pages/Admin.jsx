const Admin = () => {
  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@cia-lpdb.com",
      role: "Analis Senior",
      status: "Aktif",
      lastLogin: "2 jam yang lalu",
    },
    {
      id: 2,
      name: "John Analyst",
      email: "john@cia-lpdb.com",
      role: "Analis",
      status: "Aktif",
      lastLogin: "1 hari yang lalu",
    },
    {
      id: 3,
      name: "Jane Reviewer",
      email: "jane@cia-lpdb.com",
      role: "Reviewer",
      status: "Non-aktif",
      lastLogin: "1 minggu yang lalu",
    },
  ];

  const auditLogs = [
    {
      id: 1,
      user: "Admin User",
      action: "Login ke sistem",
      timestamp: "2023-11-12 14:30:25",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      user: "John Analyst",
      action: "Upload dokumen APL-2023-0014",
      timestamp: "2023-11-12 13:15:10",
      ip: "192.168.1.101",
    },
    {
      id: 3,
      user: "Admin User",
      action: "Konfigurasi sistem diubah",
      timestamp: "2023-11-12 10:45:30",
      ip: "192.168.1.100",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* User Management */}
      <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 lg:mb-0">
            Manajemen Pengguna
          </h2>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
            <i className="fas fa-plus mr-2"></i> Tambah Pengguna
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Terakhir
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-900">{user.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-500">{user.lastLogin}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 p-1 rounded">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                        <i className="fas fa-key"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
          Log Audit
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{log.user}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-900">{log.action}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                  </td>
                  <td className="px-4 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {log.ip}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
