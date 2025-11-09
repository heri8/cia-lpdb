import { useState } from "react";
import { useApi } from "../contexts/ApiContext";
import ConnectionChecker from "../components/Configuration/ConnectionChecker";

const ApiConfiguration = () => {
  const { baseURL } = useApi();
  const [apiSettings, setApiSettings] = useState({
    timeout: 10000,
    retryAttempts: 3,
    enableCaching: true,
  });

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Konfigurasi API
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola pengaturan koneksi API dan endpoint
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
              Connected
            </span>
            <span className="text-sm text-gray-500">{baseURL}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Checker */}
          <div className="lg:col-span-2">
            <ConnectionChecker />
          </div>

          {/* API Settings */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pengaturan Request
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeout (ms): {apiSettings.timeout}
                </label>
                <input
                  type="range"
                  min="5000"
                  max="30000"
                  step="1000"
                  value={apiSettings.timeout}
                  onChange={(e) =>
                    setApiSettings((prev) => ({
                      ...prev,
                      timeout: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5s</span>
                  <span>15s</span>
                  <span>30s</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retry Attempts: {apiSettings.retryAttempts}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={apiSettings.retryAttempts}
                  onChange={(e) =>
                    setApiSettings((prev) => ({
                      ...prev,
                      retryAttempts: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Cache Settings */}
          <div className="border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pengaturan Cache
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Enable Caching</p>
                  <p className="text-sm text-gray-600">
                    Cache response untuk performance
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apiSettings.enableCaching}
                    onChange={(e) =>
                      setApiSettings((prev) => ({
                        ...prev,
                        enableCaching: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Auto Refresh</p>
                  <p className="text-sm text-gray-600">
                    Refresh cache secara otomatis
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Endpoints Info */}
          <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Endpoint Tersedia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-check text-green-500"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Authentication</p>
                  <p className="text-sm text-gray-500">/auth/*</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-check text-green-500"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Applications</p>
                  <p className="text-sm text-gray-500">/applications/*</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-check text-green-500"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Documents</p>
                  <p className="text-sm text-gray-500">/documents/*</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-check text-green-500"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Analytics</p>
                  <p className="text-sm text-gray-500">/analytics/*</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Test Connection
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiConfiguration;
