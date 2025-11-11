import { useEffect, useState } from "react";
import { applicationsAPI } from "../../services/api";

const InputField = ({ id, label, type = "text", placeholder, step, min, isTextArea = false, options = null, isDisabled, isSaving, formData, handleInputChange }) => {
    const inputProps = {
        id,
        name: id,
        // Menggunakan || 0 untuk number dan || "" untuk lainnya agar form tetap controlled
        value: formData[id] !== undefined ? formData[id] : (type === "number" ? 0 : ""),
        onChange: handleInputChange,
        placeholder,
        disabled: isDisabled || isSaving,
        className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-150",
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>
                {label}
            </label>
            {isTextArea ? (
                <textarea {...inputProps} rows="2" />
            ) : options ? (
                <select {...inputProps}>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    {...inputProps}
                    type={type}
                    step={step}
                    min={min}
                />
            )}
        </div>
    );
};

const ApplicationInfo = ({ isModal = false, prefilledId = null, onSaveSuccess = () => { } }) => {
    const [formData, setFormData] = useState({
        // Data Institusi
        nama_koperasi: "",
        npwp_institusi: "",
        nomor_nik_koperasi: "",
        grade_koperasi: "A",
        kota_domisili: "",
        tipe_sektor: "SEKTOR_RIIL",

        // Data Proposal
        nomor_proposal_internal: "",
        tanggal_proposal: new Date().toISOString().substring(0, 10),
        jumlah_pembiayaan_diajukan: 0,
        tujuan_pembiayaan: "",
        suku_bunga_diminta: 0,
        tenor_diminta_bulan: 0,
    });
    const [saveMessage, setSaveMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (prefilledId) {
            setFormData((prev) => ({ ...prev, applicationId: prefilledId }));
            // 💡 TODO: Lakukan fetch data aplikasi yang ada di sini
        }
    }, [prefilledId]);

    const isDisabled = !isModal && !!prefilledId;

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        let finalValue = value;

        // Menangani konversi untuk input bertipe number
        if (type === "number") {
            // Mengubah string dari input menjadi tipe Number, menggunakan parseFloat agar bisa menerima desimal (untuk suku bunga)
            finalValue = name === 'suku_bunga_diminta' ? parseFloat(value) : parseInt(value);
            // Tambahkan guard clause jika input kosong
            if (value === "") finalValue = 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleSaveApplication = async () => {
        if (isSaving) return;

        setIsSaving(true);
        setSaveMessage(null);

        const dataToSend = {
            ...formData,
        };

        try {
            console.log("Mengirim aplikasi baru ke backend:", dataToSend);

            // Panggilan ke applicationsAPI.create
            const result = await applicationsAPI.create(dataToSend);

            // Asumsi applicationsAPI.create mengembalikan objek dengan data aplikasi yang dibuat
            if (result && result.id) {
                console.log("Aplikasi berhasil disimpan:", result);
                setSaveMessage("Aplikasi baru berhasil disimpan!");

                // Panggil callback onSaveSuccess untuk menutup modal atau me-refresh list
                onSaveSuccess(result.id);
            } else {
                // Tangani kasus ketika API sukses tapi data tidak sesuai harapan
                setSaveMessage("Aplikasi berhasil dikirim, tetapi respons tidak lengkap.");
            }
        } catch (error) {
            console.error("Kesalahan saat menyimpan aplikasi:", error);
            // Asumsi error adalah objek dari httpService yang memiliki pesan
            const errorMessage = error.message || "Terjadi kesalahan jaringan atau server saat menyimpan.";
            setSaveMessage(`Gagal menyimpan: ${errorMessage}`);
        } finally {
            setIsSaving(false);
            // Hilangkan pesan setelah 4 detik kecuali ada error persisten
            setTimeout(() => setSaveMessage(null), 4000);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 border-gray-100">
            {/* Header dan Info... */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">
                        {isModal ? "Formulir Aplikasi Baru" : "Informasi Aplikasi Pinjaman"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Lengkapi semua data yang diperlukan untuk mengajukan aplikasi pinjaman.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* --- Data Institusi --- */}
                <h4 className="md:col-span-2 lg:col-span-3 text-md font-semibold text-gray-700 border-b pb-2 mb-2 pt-2">Data Institusi</h4>

                {/* NOTE: Semua pemanggilan InputField di bawah kini menerima semua state dan handler yang diperlukan dari parent */}
                <InputField
                    id="nama_koperasi"
                    label="Nama Koperasi/Institusi"
                    placeholder="Masukkan nama koperasi"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="npwp_institusi"
                    label="NPWP Institusi"
                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="nomor_nik_koperasi"
                    label="Nomor NIK Koperasi"
                    placeholder="NIK Koperasi"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />

                <InputField
                    id="grade_koperasi"
                    label="Grade Koperasi"
                    options={[
                        { value: 'A', label: 'A' },
                        { value: 'B', label: 'B' },
                        { value: 'C', label: 'C' },
                        { value: 'D', label: 'D' },
                    ]}
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="kota_domisili"
                    label="Kota Domisili"
                    placeholder="Masukkan kota domisili"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="tipe_sektor"
                    label="Tipe Sektor"
                    options={[
                        { value: 'SEKTOR_RIIL', label: 'SEKTOR_RIIL' },
                        { value: 'JASA', label: 'JASA' },
                        { value: 'PERDAGANGAN', label: 'PERDAGANGAN' },
                        { value: 'LAINNYA', label: 'LAINNYA' },
                    ]}
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />

                {/* --- Data Proposal Pembiayaan --- */}
                <h4 className="md:col-span-2 lg:col-span-3 text-md font-semibold text-gray-700 border-b pt-6 pb-2 mb-2 mt-4">Data Proposal Pembiayaan</h4>

                <InputField
                    id="nomor_proposal_internal"
                    label="Nomor Proposal Internal"
                    placeholder="Contoh: PROP/2025/001"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="tanggal_proposal"
                    label="Tanggal Proposal"
                    type="date"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="jumlah_pembiayaan_diajukan"
                    label="Jumlah Pembiayaan Diajukan (Rp)"
                    type="number" min="0"
                    placeholder="0"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="suku_bunga_diminta"
                    label="Suku Bunga Diminta (%)"
                    type="number" step="0.1" min="0"
                    placeholder="0.0"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />
                <InputField
                    id="tenor_diminta_bulan"
                    label="Tenor Diminta (Bulan)"
                    type="number" min="1"
                    placeholder="0"
                    formData={formData} handleInputChange={handleInputChange}
                    isDisabled={isDisabled} isSaving={isSaving}
                />

                <div className="md:col-span-2 lg:col-span-3">
                    <InputField
                        id="tujuan_pembiayaan"
                        label="Tujuan Pembiayaan"
                        placeholder="Jelaskan tujuan pembiayaan (misalnya: modal kerja, investasi, dll.)"
                        isTextArea={true}
                        formData={formData} handleInputChange={handleInputChange}
                        isDisabled={isDisabled} isSaving={isSaving}
                    />
                </div>
            </div>

            {/* Tombol Simpan */}
            {isModal && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center">
                    {/* Pesan Konfirmasi Simpan */}
                    {saveMessage && (
                        <div className={`mr-4 mb-3 sm:mb-0 p-3 text-sm font-semibold rounded-xl transition-opacity duration-300 ${saveMessage.includes("berhasil") ? "text-green-700 bg-green-100 border border-green-200" : "text-red-700 bg-red-100 border border-red-200"
                            }`}>
                            {saveMessage}
                        </div>
                    )}
                    <button
                        onClick={handleSaveApplication}
                        disabled={isSaving}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/50 w-full sm:w-auto justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin -ml-1 mr-3 h-5 w-5"></i>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i>
                                Simpan Aplikasi
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApplicationInfo;
