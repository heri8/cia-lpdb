import { useEffect, useState } from "react";

const ApplicationInfo = ({ isModal = false, prefilledId = null }) => {
  const [formData, setFormData] = useState({
    applicationId:
      prefilledId ||
      `APL-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9999)
      ).padStart(4, "0")}`,
    companyName: "",
    businessType: "",
    sector: "",
    address: "",
  });

  useEffect(() => {
    if (prefilledId) {
      setFormData((prev) => ({ ...prev, applicationId: prefilledId }));
    }
  }, [prefilledId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={
        !isModal
          ? "bg-white rounded-2xl shadow-soft p-6 mb-6 border border-gray-100"
          : ""
      }
    >
      {!isModal && (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Informasi Aplikasi Pinjaman
            </h3>
            <p className="text-sm text-gray-500">
              Lengkapi data aplikasi sebelum mengunggah dokumen
            </p>
          </div>
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
            Draft
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Aplikasi
          </label>
          <input
            type="text"
            name="applicationId"
            value={formData.applicationId}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 font-mono"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Perusahaan/Pemohon
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Masukkan nama perusahaan/pemohon"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Usaha
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih jenis usaha</option>
            <option value="Perdagangan">Perdagangan</option>
            <option value="Manufaktur">Manufaktur</option>
            <option value="Jasa">Jasa</option>
            <option value="Pertanian">Pertanian</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sektor
          </label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih sektor</option>
            <option value="Mikro">Mikro</option>
            <option value="Kecil">Kecil</option>
            <option value="Menengah">Menengah</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            rows="2"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Masukkan alamat lengkap"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div className="md:col-span-2 flex justify-end mt-4">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
            Simpan & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationInfo;
