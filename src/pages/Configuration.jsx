import { useState } from "react";

const Configuration = () => {
  const [settings, setSettings] = useState({
    scoringThreshold: 70,
    autoProcessing: true,
    notificationEmail: true,
    dataRetention: 365,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="bg-white rounded-2xl shadow-soft p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Konfigurasi Sistem
        </h1>

        <div className="space-y-4 lg:space-y-6">
          {/* Scoring Threshold */}
          <div className="border border-gray-200 rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Threshold Scoring
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batas Minimum Skor Layak: {settings.scoringThreshold}
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={settings.scoringThreshold}
                  onChange={(e) =>
                    handleSettingChange(
                      "scoringThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50</span>
                  <span>70</span>
                  <span>90</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="border border-gray-200 rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pengaturan Sistem
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Auto Processing</p>
                  <p className="text-sm text-gray-600">
                    Proses dokumen otomatis setelah upload
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoProcessing}
                    onChange={(e) =>
                      handleSettingChange("autoProcessing", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Notifikasi</p>
                  <p className="text-sm text-gray-600">
                    Kirim notifikasi via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notificationEmail}
                    onChange={(e) =>
                      handleSettingChange("notificationEmail", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="border border-gray-200 rounded-2xl p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Retensi Data
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masa Retensi Data (hari): {settings.dataRetention}
                </label>
                <input
                  type="range"
                  min="30"
                  max="730"
                  value={settings.dataRetention}
                  onChange={(e) =>
                    handleSettingChange(
                      "dataRetention",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30</span>
                  <span>365</span>
                  <span>730</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
              Reset
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
