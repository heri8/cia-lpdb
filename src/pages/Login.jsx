import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // ----------------------------------------------------
      // INI ADALAH BLOK SIMULASI API (Ganti ketika backend siap)
      // ----------------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (
        credentials.email === "admin@lpdb.com" &&
        credentials.password === "password"
      ) {
        // Panggil fungsi login yang menyimpan token, role, dan nama pengguna
        // Menggunakan data dummy ADMIN
        login({
          token: "dummy_admin_token_12345",
          name: "Admin LPDB",
          role: "ADMIN",
        });

        // Redirect ke halaman Dashboard setelah berhasil login
        navigate("/dashboard", { replace: true });
      } else if (
        credentials.email === "analis@lpdb.com" &&
        credentials.password === "password"
      ) {
        // CONTOH DUMMY ANALYST
        login({
          token: "dummy_analyst_token",
          name: "Analyst LPDB",
          role: "ANALYST",
        });
        navigate("/dashboard", { replace: true });
      } else {
        // Gagal login
        throw new Error("Email atau Password salah.");
      }
      // ----------------------------------------------------
    } catch (err) {
      // Tampilkan error jika login gagal
      console.error("Login Gagal:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: digunakan jika api backend sudah siap
  const handleSubmitBackup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);

      if (response && response.token && response.role) {
        login(response);

        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Respons API tidak valid.");
      }
    } catch (err) {
      console.error("Login Gagal:", err);
      setError("Login Gagal: Periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CIA LPDB</h1>
              <p className="text-sm text-gray-500">
                Credit Intelligence Analytics
              </p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
            <p className="mt-2 text-sm text-gray-600">
              Masuk ke sistem analisis kredit terintegrasi
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-3"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
                  placeholder="email@perusahaan.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Lupa password?
                </a>
              </div>
            </div> */}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Memproses...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Masuk
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Atau masuk dengan
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
              >
                <i className="fab fa-google text-red-500 mr-2"></i>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
              >
                <i className="fab fa-microsoft text-blue-500 mr-2"></i>
                Microsoft
              </button>
            </div>
          </div> */}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2025 CIA LPDB. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image/Background */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>

        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-white text-center">
            
            {/* Animated Icon */}
            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
              <i className="fas fa-chart-line text-white text-3xl"></i>
            </div>

            <h3 className="text-3xl font-bold mb-4">
              Credit Intelligence Analytics
            </h3>

            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Sistem analisis kredit terintegrasi dengan teknologi AI untuk
              membantu proses evaluasi dan scoring aplikasi pinjaman secara
              efisien dan akurat.
            </p>

            {/* Features List */}
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-blue-100">AI-Powered Credit Scoring</span>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-blue-100">
                  Real-time Document Processing
                </span>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-blue-100">
                  Advanced Analytics Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
