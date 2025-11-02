import { useState } from "react";
import { useApi } from "../../contexts/ApiContext";

const BaseURLConfig = () => {
  const { baseURL, updateBaseURL, isLoading } = useApi();
  const [newBaseURL, setNewBaseURL] = useState(baseURL);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const result = await updateBaseURL(newBaseURL);
    if (result.success) {
      setMessage("BaseURL berhasil diupdate!");
    } else {
      setMessage(`Gagal update BaseURL: ${result.error}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Konfigurasi API
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current BaseURL
          </label>
          <code className="block w-full p-3 bg-gray-100 rounded-lg text-sm">
            {baseURL}
          </code>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New BaseURL
          </label>
          <input
            type="url"
            value={newBaseURL}
            onChange={(e) => setNewBaseURL(e.target.value)}
            placeholder="https://api.example.com/v1"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.includes("berhasil")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update BaseURL"}
        </button>
      </div>
    </div>
  );
};

export default BaseURLConfig;
