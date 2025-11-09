import { createContext, useContext, useState, useEffect } from "react";

// ==========================================================
// 1. DEFINISI ROLE
// PERHATIAN: Nilai (value) harus sama dengan role string yang dikembalikan dari API
// ==========================================================
export const USER_ROLES = {
  ADMIN: "ADMIN", // Memiliki akses penuh
  ANALYST: "ANALYST", // Fokus pada data dan upload
  REVIEWER: "REVIEWER", // Akses terbatas untuk melihat
  GUEST: "GUEST",
};

// Buat Context. Gunakan null sebagai default state.
const AuthContext = createContext(null);

// ==========================================================
// 2. HOOK useAuth (Defensive Check)
// ==========================================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Periksa apakah hook dipanggil di dalam AuthProvider
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// ==========================================================
// 3. PROVIDER UTAMA
// ==========================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // FUNGSI INTI RBAC: Cek Izin
  const hasRole = (requiredRoles) => {
    // Pastikan user ada dan requiredRoles adalah array
    if (!user || !Array.isArray(requiredRoles)) return false;

    // Periksa apakah role user saat ini termasuk dalam requiredRoles
    return requiredRoles.includes(user.role);
  };

  // FUNGSI: Login
  const login = (userData) => {
    const { token, name, role } = userData;

    if (token && role) {
      setUser({ name, role });
      setIsAuthenticated(true);
      localStorage.setItem("userToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", name);
    }
  };

  // FUNGSI: Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    // Di App.js atau Router, Anda harus menambahkan logic redirect ke /login
  };

  // FUNGSI: Cek status login saat aplikasi dimuat (Persistence)
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");

    if (token && role && name) {
      setUser({ name, role });
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  // Jika aplikasi sedang memuat (melakukan pengecekan token), tampilkan loading
  if (isLoading) {
    return <div>Loading Authentication...</div>; // Anda bisa ganti dengan spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole, // Export fungsi hasRole
        USER_ROLES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
