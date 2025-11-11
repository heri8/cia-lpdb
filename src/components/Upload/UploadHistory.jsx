const UploadHistory = ({ applicationId, history = [] }) => {

    const getStatusClass = (color) => {
        const classes = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
        };
        return classes[color] || classes.green;
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                {/* 💡 Tampilkan ID Aplikasi */}
                <h3 className="text-lg font-semibold text-gray-800">
                    Riwayat Upload Dokumen Aplikasi #{applicationId}
                </h3>
                {/* <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Lihat Semua <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </button> */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID Aplikasi
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal Upload
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {history.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-4">
                                    <p className="font-medium text-gray-900">{item.id}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-gray-900">{item.name}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-sm text-gray-500">{item.date}</p>
                                </td>
                                <td className="px-4 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full ${getStatusClass(
                                            item.statusColor
                                        )} font-medium`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <button className="text-primary-600 hover:text-primary-700 p-1 rounded">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UploadHistory;
