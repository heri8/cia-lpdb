import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: "chart-pie", label: "Dashboard" },
    { path: "/upload", icon: "file-upload", label: "Upload Dokumen" },
    { path: "/applications", icon: "list", label: "Daftar Aplikasi" },
    { path: "/analytics", icon: "chart-bar", label: "Analytics" },
    { path: "/configuration", icon: "cog", label: "Konfigurasi" },
    { path: '/api-configuration', icon: 'server', label: 'API Config' },
    { path: "/admin", icon: "shield-alt", label: "Admin & Audit" },
  ];

  const handleLinkClick = () => {
    // Tutup sidebar ketika link diklik di mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar untuk desktop */}
      <div
        className={`
        sidebar-gradient w-64 text-white flex flex-col fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header Sidebar dengan Close Button untuk mobile */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-brain text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">CIA LPDB</h1>
              <p className="text-xs text-gray-400">
                Credit Intelligence Analytics
              </p>
            </div>
          </div>

          {/* Close Button untuk mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <i
                  className={`fas fa-${item.icon} w-5 text-center mr-3 ${
                    isActive ? "text-blue-400" : ""
                  }`}
                ></i>
                <span className={`${isActive ? "font-medium" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info dan Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Analis Senior</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-xl transition hover:text-white"
          >
            <i className="fas fa-sign-out-alt w-5 text-center mr-3"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
