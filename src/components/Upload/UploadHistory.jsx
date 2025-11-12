import moment from "moment";

const UploadHistory = ({ applicationId, history = [] }) => {

    const getStatusClass = (color) => {
        const classes = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
        };
        return classes[color] || classes.green;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return moment(dateString).format('DD MMMM YYYY, HH:mm');
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Riwayat Unggahan Dokumen
            </h2>
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* 💡 Perubahan Header Tabel */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Tipe Dokumen
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                Nama File
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                Tanggal Unggah
                            </th>
                            {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                Aksi
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* 💡 Mengiterasi data dokumen yang baru */}
                        {history.length > 0 ? (
                            history.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-900">
                                            {doc.tipe_dokumen}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-gray-900 truncate" title={doc.nama_file_asli}>
                                            {doc.nama_file_asli}
                                        </p>
                                        {/* Tampilkan path penyimpanan jika perlu */}
                                        {/* <p className="text-xs text-gray-500">{doc.path_penyimpanan}</p> */}
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(doc.uploaded_at)}
                                        </p>
                                    </td>
                                    {/* <td className="px-4 py-4">
                                        <button
                                            className="text-blue-600 hover:text-blue-700 p-1 rounded"
                                            onClick={() => alert(`Aksi untuk dokumen ID: ${doc.id}`)}
                                        >
                                            <i className="fas fa-download mr-1"></i> Unduh
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                    Belum ada dokumen yang diunggah untuk aplikasi ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UploadHistory;
