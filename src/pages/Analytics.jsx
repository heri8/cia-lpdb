const Analytics = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h1>
        <p className="text-gray-600">Halaman analytics akan segera tersedia.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 lg:p-6 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-2">Trend Aplikasi</h3>
            <p className="text-sm text-gray-600">
              Analisis trend aplikasi bulanan
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 lg:p-6 rounded-2xl border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-2">
              Distribusi Skor
            </h3>
            <p className="text-sm text-gray-600">
              Distribusi skor kredit aplikasi
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 lg:p-6 rounded-2xl border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-2">Kinerja Analis</h3>
            <p className="text-sm text-gray-600">Performance metrics analis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
