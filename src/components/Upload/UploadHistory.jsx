import moment from "moment";

const getEventDetails = (type) => {
    switch (type.toLowerCase()) {
        case 'ekstraksi':
            return {
                icon: 'fas fa-brain', // Ikon untuk aktivitas AI/Ekstraksi
                color: 'text-blue-600 bg-blue-100',
            };
        case 'dokumen': // Contoh jika ada event upload dokumen manual
            return {
                icon: 'fas fa-file-upload',
                color: 'text-green-600 bg-green-100',
            };
        case 'notifikasi':
            return {
                icon: 'fas fa-bell',
                color: 'text-yellow-600 bg-yellow-100',
            };
        default:
            return {
                icon: 'fas fa-info-circle',
                color: 'text-gray-500 bg-gray-100',
            };
    }
};

const UploadHistory = ({ history = [] }) => {
    const sortedHistory = [...history].sort((a, b) =>
        moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return moment(dateString).format('DD MMMM YYYY, HH:mm');
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Riwayat Aktivitas Pemrosesan
            </h2>
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">

                {sortedHistory.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        Belum ada riwayat aktivitas yang tercatat.
                    </p>
                ) : (
                    // Menggunakan list style untuk menampilkan riwayat
                    <ul className="space-y-4">
                        {sortedHistory.map((item) => {
                            const details = getEventDetails(item.type || 'default');
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-start p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                                >
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${details.color}`}>
                                        <i className={`${details.icon} text-lg`}></i>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        {/* Title (judul event) */}
                                        <p className="font-semibold text-gray-900">{item.title}</p>

                                        {/* Timestamp */}
                                        <p className="text-xs text-gray-500 mt-1">
                                            <i className="far fa-clock mr-1"></i>
                                            {formatDate(item.timestamp)}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UploadHistory;
