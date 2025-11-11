// src/App.jsx
import { lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ApiProvider } from "./contexts/ApiContext";
import { AuthProvider, USER_ROLES, useAuth } from "./contexts/AuthContext";

const Layout = lazy(() => import("./components/Layout/Layout"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Upload = lazy(() => import("./pages/Upload"));
const Applications = lazy(() => import("./pages/Applications"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Configuration = lazy(() => import("./pages/Configuration"));
const Admin = lazy(() => import("./pages/Admin"));
const RoleRouteGuard = lazy(() => import("./components/Auth/RoleRouteGuard"));
const Customers = lazy(() => import("./pages/Customers"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));

const ApiConfiguration = lazy(() => import("./pages/ApiConfiguration"));

const AppRouter = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout onLogout={logout}>
              {" "}
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route
                  path="/api-configuration"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[USER_ROLES.ADMIN]}
                    >
                      <ApiConfiguration />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.ANALYST]}
                    >
                      <Analytics />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/upload/:id"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.ANALYST]}
                    >
                      <Upload />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.ANALYST,
                        USER_ROLES.REVIEWER,
                      ]}
                    >
                      <Dashboard />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <RoleRouteGuard requiredRoles={[USER_ROLES.ADMIN]}>
                      <Admin />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/configuration"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.ANALYST]}
                    >
                      <Configuration />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/applications"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.ANALYST,
                        USER_ROLES.REVIEWER,
                      ]}
                    >
                      <Applications />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/applications/:id"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.ANALYST,
                        USER_ROLES.REVIEWER,
                      ]}
                    >
                      <ApplicationDetail />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/customers"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.ANALYST,
                        USER_ROLES.REVIEWER,
                      ]}
                    >
                      <Customers />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="/customers/:id"
                  element={
                    <RoleRouteGuard
                      requiredRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.ANALYST,
                        USER_ROLES.REVIEWER,
                      ]}
                    >
                      <CustomerDetail />
                    </RoleRouteGuard>
                  }
                />

                <Route
                  path="*"
                  element={
                    <div className="p-6 text-center">
                      <h2 className="text-2xl font-bold">
                        404 - Halaman Tidak Ditemukan
                      </h2>
                      <p className="text-gray-500 mt-2">
                        Periksa URL Anda atau kembali ke Dashboard.
                      </p>
                      <button
                        onClick={() => (window.location.href = "/dashboard")}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Kembali ke Dashboard
                      </button>
                    </div>
                  }
                />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h2 className="text-2xl font-bold">
              404 - Halaman Tidak Ditemukan
            </h2>
          </div>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ApiProvider>
      <Router>
        {" "}
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Router>
    </ApiProvider>
  );
}

export default App;
