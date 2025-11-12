import { useState, useRef } from "react";
import { documentsAPI } from "../../services/api";

const DocumentUpload = ({
    applicationId,
    uploadedDocuments = [],
    onUploadComplete,
}) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const fileInputRef = useRef(null);

    const processFiles = (fileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            file,
            name: file.name,
            size: file.size,
        }));

        setFilesToUpload(prev => [...prev, ...newFiles]);
        setUploadError(null);
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFiles(files);
        }
        e.target.value = null;
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragActive(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const handleRemoveFile = (index) => {
        setFilesToUpload(prev => prev.filter((_, i) => i !== index));
        setUploadError(null);
    };

    const handleUpload = async () => {
        setUploadError(null);
        setIsUploading(true);

        if (!applicationId) {
            setUploadError("ID Aplikasi (applicationId) tidak tersedia.");
            setIsUploading(false);
            return;
        }

        if (filesToUpload.length === 0) {
            setUploadError("Pilih setidaknya satu file untuk diunggah.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();

        // 1. Tambahkan applicationId (Key 'applicationId' required oleh backend)
        formData.append("pengajuan_id", applicationId);

        // 2. Tambahkan File(s) (Key 'files' required oleh backend)
        let hasValidFile = false;
        filesToUpload.forEach((item) => {
            const fileObject = item.file;
            const fileName = item.name;

            if (fileObject instanceof File || fileObject instanceof Blob) {
                formData.append("files", fileObject, fileName);
                hasValidFile = true;
            } else {
                console.error("Item is not a valid File/Blob object:", item);
            }
        });

        // Pencegahan jika semua file yang dipilih ternyata tidak valid
        if (!hasValidFile) {
            setUploadError("Tidak ada file valid yang ditemukan untuk diunggah.");
            setIsUploading(false);
            return;
        }

        console.log('formData: ', formData);
        

        try {
            // Panggil API Upload
            // Asumsi documentsAPI.upload(formData) memanggil httpService.upload()
            await documentsAPI.upload(formData);

            setFilesToUpload([]); // Reset daftar file setelah sukses
            onUploadComplete(); // Panggil fungsi di parent untuk refetch data

        } catch (error) {
            // Menangani error dari backend (termasuk validasi 'missing field')
            const msg = error.data?.detail?.[0]?.msg || error.message || "Gagal mengunggah dokumen karena kesalahan tak terduga.";
            setUploadError(msg);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadasas = async () => {
        if (filesToUpload.length === 0) return;

        setUploadError(null);
        setIsUploading(true);

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('files', file.file);
        });

        formData.append('applicationId', applicationId);

        try {
            await documentsAPI.upload(applicationId, formData);

            setFilesToUpload([]);
            if (onUploadComplete) onUploadComplete();
            console.log('Unggahan Berhasil!');

        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Gagal mengunggah dokumen.";
            setUploadError(errorMsg);

        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 mb-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
                Unggah Dokumen (Drag & Drop)
            </h4>

            {/* 💡 Input Area File (Ganti menjadi multi-file) */}
            <div
                className={`border-2 border-dashed ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-xl p-8 text-center cursor-pointer transition mb-4`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-500 mb-2"></i>
                <p className="text-gray-700 font-medium">
                    Tarik & Lepas file di sini, atau **klik untuk memilih file**.
                </p>
                <p className="text-sm text-gray-500">
                    Mendukung semua jenis file (.pdf, .jpg, .docx) dan unggahan berganda.
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple // 💡 Aktifkan multi-file
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
            </div>

            {/* 💡 Daftar File yang Siap Diunggah */}
            {filesToUpload.length > 0 && (
                <div className="mb-4 p-4 border border-gray-200 rounded-xl">
                    <p className="font-semibold text-gray-700 mb-2">
                        {filesToUpload.length} File Siap Diunggah:
                    </p>
                    <ul className="space-y-2">
                        {filesToUpload.map((file, index) => (
                            <li key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                <span className="text-sm text-gray-800 truncate">
                                    <i className="fas fa-file-alt mr-2 text-blue-500"></i>
                                    {file.file.name}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                                    className="text-red-500 hover:text-red-700 transition"
                                    disabled={isUploading}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 💡 Pesan Validasi/Error dari Backend */}
            {uploadError && (
                <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl mb-4">
                    <p className="font-semibold text-sm">Validasi Gagal:</p>
                    <p className="text-sm">{uploadError}</p>
                </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                {/* ... (Tombol Kembali/Simpan Draft) ... */}
                <button
                    onClick={handleUpload}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium disabled:opacity-50"
                    disabled={isUploading || filesToUpload.length === 0}
                >
                    {isUploading ? (
                        <><i className="fas fa-spinner fa-spin mr-2"></i> Memproses ({filesToUpload.length})...</>
                    ) : (
                        <><i className="fas fa-paper-plane mr-2"></i> Proses Unggahan ({filesToUpload.length})</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DocumentUpload;
