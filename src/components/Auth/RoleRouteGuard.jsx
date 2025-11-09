// src/components/Auth/RoleRouteGuard.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Asumsi Anda menggunakan react-router-dom
import { useAuth } from "../../contexts/AuthContext";

// Komponen ini akan membatasi akses ke halaman
const RoleRouteGuard = ({ children, requiredRoles }) => {
  const { isAuthenticated, user, isLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Logika 1: Cek Otentikasi (WAJIB)
    if (!isAuthenticated) {
      // Redirect ke halaman login jika belum login
      navigate("/login", { replace: true });
      return;
    }

    // Logika 2: Cek Izin Berdasarkan Role
    if (user && !hasRole(requiredRoles)) {
      // Redirect ke dashboard atau halaman 'Akses Ditolak' jika tidak memiliki role yang diizinkan
      console.warn(`Akses Ditolak. User role: ${user.role}`);
      // Anda bisa membuat halaman 403 / Access Denied
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, hasRole, requiredRoles, navigate]);

  // Tampilkan halaman jika isiannya sesuai
  if (isAuthenticated && hasRole(requiredRoles)) {
    return children;
  }

  // Tampilkan loading screen atau null saat logic berjalan
  return <div>Loading...</div>; // Atau kembalikan null untuk tidak menampilkan apa-apa
};

export default RoleRouteGuard;
