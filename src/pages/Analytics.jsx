import { useApi } from "../hooks/useApi";
import { analyticsAPI } from "../services/api";

const TrendCard = ({ title, bulanIni, bulanLalu }) => {
    const diff = bulanIni - bulanLalu;
    const isPositiveTrend = diff >= 0;
    const percentage =
        bulanLalu > 0
            ? ((Math.abs(diff) / bulanLalu) * 100).toFixed(1)
            : (bulanIni > 0 ? 100 : 0).toFixed(1);

    const trendIcon = isPositiveTrend
        ? "fas fa-arrow-up text-success"
        : "fas fa-arrow-down text-danger";
    const trendColor = isPositiveTrend ? "text-success" : "text-danger";
    const trendBg = isPositiveTrend ? "bg-green-50" : "bg-red-50";

    return (
        <div className="bg-white rounded-2xl shadow-soft p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <i className="fas fa-chart-line text-blue-500 text-xl p-2 bg-blue-50 rounded-lg"></i>
            </div>
            <p className="text-4xl font-bold text-gray-900">{bulanIni.toLocaleString('id-ID')}</p>
            <p className="text-sm text-gray-500 mt-1">
                Bulan Lalu: {bulanLalu.toLocaleString('id-ID')}
            </p>

            <div className="flex items-center mt-3">
                <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${trendBg} ${trendColor}`}
                >
                    <i className={`${trendIcon} mr-1`}></i>
                    {percentage}%
                </span>
                <span className="text-xs text-gray-500 ml-2">
                    {isPositiveTrend ? "Peningkatan" : "Penurunan"} dari bulan lalu
                </span>
            </div>
        </div>
    );
};

// Komponen Pembantu: Distribusi Skor
const ScoreDistributionCard = ({ distribution }) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

    const getScoreClasses = (score) => {
        switch (score) {
            case "A": return { color: "text-success", bg: "bg-green-100" };
            case "B": return { color: "text-blue-500", bg: "bg-blue-100" };
            case "C": return { color: "text-warning", bg: "bg-yellow-100" };
            case "D": return { color: "text-danger", bg: "bg-red-100" };
            default: return { color: "text-gray-500", bg: "bg-gray-100" };
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Distribusi Skor Aplikasi
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Total {total} aplikasi yang telah diskoring.
            </p>

            <div className="space-y-4">
                {Object.entries(distribution).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([score, count]) => {
                    const { color, bg } = getScoreClasses(score);
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                        <div key={score}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-medium ${color}`}>Skor {score}</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {count.toLocaleString('id-ID')} ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="progress-bar h-2">
                                <div
                                    className={`progress-fill ${color.replace('text', 'bg')}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Analytics = () => {
    const { data, loading, error } = useApi(analyticsAPI.getDashboardAnalytics);

    const trendData = data?.trend_aplikasi || { bulan_ini: 0, bulan_lalu: 0 };
    const scoreData = data?.distribusi_skor || { A: 0, B: 0, C: 0, D: 0 };

    if (loading) {
        return (
            <div className="p-4 lg:p-6 text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i>
                <p className="text-gray-600">Memuat data Analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 lg:p-6">
                <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Gagal memuat data dashboard: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard Analytics Aplikasi Pinjaman
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Kolom Kiri/Atas: Trend Aplikasi */}
                <div className="xl:col-span-1 space-y-6">
                    <TrendCard
                        title="Total Aplikasi Bulan Ini"
                        bulanIni={trendData.bulan_ini}
                        bulanLalu={trendData.bulan_lalu}
                    />

                    {/* Anda dapat menambahkan kartu lain di sini (misal: Rata-rata Skor, dsb.) */}
                    <div className="bg-white rounded-2xl shadow-soft p-5 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Insight Cepat</h3>
                        <p className="text-sm text-gray-600">
                            Gunakan Asisten LLM untuk mendapatkan analisis yang lebih mendalam mengenai tren dan distribusi skor ini.
                        </p>
                    </div>
                </div>

                {/* Kolom Kanan/Bawah: Distribusi Skor */}
                <ScoreDistributionCard
                    distribution={scoreData}
                />

            </div>

            {/* Anda bisa menambahkan bagian lain di sini, seperti grafik atau tabel detail */}
            <div className="mt-6">
                {/* Placeholder untuk Grafik */}
            </div>

        </div>
    );
};

export default Analytics;
