// src/components/Configuration/ConnectionChecker.jsx

import { useState } from "react";
import { systemAPI } from "../../services/api";
import { useApi } from "../../contexts/ApiContext"; // Untuk mendapatkan baseURL

const ConnectionChecker = () => {
  const { baseURL } = useApi();
  const [status, setStatus] = useState("idle"); // idle, connecting, success, error
  const [response, setResponse] = useState("");

  const handleCheckConnection = async () => {
    setStatus("connecting");
    setResponse("");

    try {
      // 💡 Panggil fungsi checkHealth yang baru dibuat
      const result = await systemAPI.checkHealth();

      // Jika berhasil (kode 200/204), httpService akan mengembalikan data atau teks
      setStatus("success");

      // Ambil respon yang relevan
      const statusText =
        typeof result === "object" && result.message
          ? result.message
          : typeof result === "string" && result.length < 50
          ? result
          : "Berhasil terhubung. Respon diterima.";

      setResponse(statusText);
    } catch (error) {
      // Jika gagal (timeout, 4xx, 5xx, atau CORS error)
      setStatus("error");
      setResponse(
        `Koneksi Gagal: ${error.message}. Pastikan CORS/Firewall telah dikonfigurasi dan URL Base: ${baseURL} sudah benar.`
      );
    }
  };

  const statusClasses = {
    idle: "bg-gray-100 text-gray-600",
    connecting: "bg-yellow-100 text-warning animate-pulse",
    success: "bg-green-100 text-success",
    error: "bg-red-100 text-danger",
  };

  const statusLabels = {
    idle: "Siap Uji",
    connecting: "Menghubungkan...",
    success: "Terkoneksi",
    error: "Gagal Koneksi",
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex justify-between items-center">
        Uji Koneksi API
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${statusClasses[status]}`}
        >
          {statusLabels[status]}
        </span>
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Lakukan uji koneksi ke *endpoint* **{baseURL}/health** untuk
        memverifikasi konektivitas *backend*.
      </p>

      <div className="space-y-4">
        {/* URL Target */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-500">Endpoint Target</p>
          <code className="text-sm text-blue-700 break-all">
            {baseURL}/health
          </code>
        </div>

        {/* Status Response */}
        {response && (
          <div
            className={`p-3 rounded-xl border ${
              status === "error"
                ? "border-red-300 bg-red-50"
                : "border-green-300 bg-green-50"
            }`}
          >
            <p className="text-xs font-medium text-gray-700 mb-1">
              Status Respon
            </p>
            <p
              className={`text-sm ${
                status === "error" ? "text-danger" : "text-success"
              }`}
            >
              {response}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleCheckConnection}
          disabled={status === "connecting"}
          className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <i
            className={`fas ${
              status === "connecting" ? "fa-spinner fa-spin" : "fa-plug"
            } mr-2`}
          ></i>
          {status === "connecting" ? "Memeriksa..." : "Cek Koneksi Sekarang"}
        </button>
      </div>
    </div>
  );
};

export default ConnectionChecker;
