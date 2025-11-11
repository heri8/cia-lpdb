import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ onToggleSidebar, onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();
    const adminName = user?.nama || "Admin";

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard Aplikasi Pinjaman";
      case "/upload":
        return "Upload Dokumen";
      case "/applications":
        return "Daftar Aplikasi";
      case "/customers":
        return "Daftar Nasabah";
      case "/analytics":
        return "Analytics";
      case "/configuration":
        return "Konfigurasi";
      case "/admin":
        return "Admin & Audit";
      default:
        return "CIA LPDB";
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Analisis kredit terintegrasi dengan AI";
      case "/upload":
        return "Unggah dan proses dokumen aplikasi pinjaman";
      case "/applications":
        return "Kelola dan pantau aplikasi pinjaman";
      case "/customers":
        return "Kelola dan pantau data nasabah";
      case "/analytics":
        return "Analisis data dan laporan";
      case "/configuration":
        return "Pengaturan sistem";
      case "/admin":
        return "Manajemen pengguna dan audit";
      default:
        return "Credit Intelligence Analytics";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button untuk mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            <i className="fas fa-bars text-lg"></i>
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h2>
            <p className="text-sm text-gray-500">{getPageDescription()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Cari aplikasi..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Search Button untuk mobile */}
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition">
              <i className="fas fa-search"></i>
            </button>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition">
              <i className="fas fa-bell"></i>
            </button>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition">
              <i className="fas fa-cog"></i>
            </button>
          </div>

          {/* User Menu Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-xs"></i>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {adminName}
              </span>
              <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-soft border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                {/* <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <i className="fas fa-user-circle mr-2 text-gray-400"></i>
                  Profile
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  <i className="fas fa-cog mr-2 text-gray-400"></i>
                  Settings
                </button> */}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
