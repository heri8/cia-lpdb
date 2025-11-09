import { useState, useRef } from "react";
import RequiredDocuments from "./RequiredDocuments";
import { documentsAPI } from "../../services/api";
import { useRequiredDocuments } from "../../hooks/useUploadData";

const DocumentUpload = ({
  applicationId,
  uploadedDocuments = [],
  onUploadComplete,
}) => {
  const {
    uploadProgress,
    uploadedCount,
    totalRequired,
    simulateDocumentUpload,
  } = useRequiredDocuments();

  const [isDragActive, setIsDragActive] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
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
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }

    // Reset input agar bisa upload file yang sama lagi
    e.target.value = null;
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  // const handleFiles = (newFiles) => {
  //   setUploadError(null);
  //   setFilesToUpload((prevFiles) => {
  //     const combinedFiles = [...prevFiles, ...newFiles];
  //     const uniqueFiles = combinedFiles.filter(
  //       (file, index, self) =>
  //         index === self.findIndex((t) => t.name === file.name)
  //     );
  //     return uniqueFiles;
  //   });
  // };

  // dipakai jika menggunakan data dummy
  const handleFiles = (files) => {
    console.log("Files to upload (simulated):", files);

    if (files.length > 0) {
      simulateDocumentUpload("Akta Pendirian/AD-ART/SK");
      console.log("Simulasi: Akta Pendirian diubah status menjadi Diunggah.");
    }
  };

  const handleRemoveFile = (fileName) => {
    setFilesToUpload((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0 || isUploading) {
      setUploadError("Pilih setidaknya satu dokumen untuk diunggah.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const formData = new FormData();
    // Tambahkan semua file ke objek FormData
    filesToUpload.forEach((file) => {
      formData.append("documents", file);
    });

    formData.append("applicationId", applicationId);

    try {
      await documentsAPI.upload(formData);

      setFilesToUpload([]);
      setIsUploading(false);
      alert("Dokumen berhasil diunggah dan siap diproses!");

      // Panggil callback ke parent (jika ada, untuk mengupdate histori atau redirect)
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(`Gagal mengunggah dokumen: ${error.message}`);
      setIsUploading(false);
    }
  };

  // const uploadedCount = filesToUpload.length;
  const maxDocuments = 8;
  const documentsReady = uploadedDocuments.length;
  const filesStaged = filesToUpload.length;
  const totalDocuments = documentsReady + filesStaged;
  const progressPercentage = (uploadedCount / maxDocuments) * 100;

  const progressColor =
    documentsReady === maxDocuments ? "bg-success" : "bg-blue-500";

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Unggah Dokumen Aplikasi ({applicationId})
        </h3>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        } mb-6`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        <div className="text-gray-500">
          <i className="fas fa-cloud-upload-alt text-4xl mb-3"></i>
          <p className="font-medium">
            Tarik & lepas file di sini, atau{" "}
            <span className="text-blue-600 font-semibold hover:text-blue-700">
              klik untuk memilih file
            </span>
          </p>
          <p className="text-sm mt-1">PDF, JPG, PNG (maks. 10MB per file)</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Daftar File yang Diunggah */}
      {filesToUpload.length > 0 && (
        <div className="mb-6 border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">
            Dokumen Dipilih ({filesToUpload.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filesToUpload.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <i className="fas fa-file-alt text-blue-500 mr-3"></i>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-3">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.name);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={isUploading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Upload */}
      <div className="mb-6">
        {uploadError && (
          <p className="text-sm text-danger mb-2">
            <i className="fas fa-exclamation-circle mr-2"></i> **Gagal Unggah:**{" "}
            {uploadError}
          </p>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Status Pengunggahan Dokumen
          </span>
          {isUploading ? (
            <span className="text-sm text-blue-500 font-medium">
              Mengunggah...
            </span>
          ) : (
            <span className="text-sm text-gray-500">
              {uploadedCount}/{maxDocuments} dokumen
            </span>
          )}
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${progressColor}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <RequiredDocuments uploadedDocuments={uploadedDocuments} />

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
          disabled={isUploading}
        >
          <i className="fas fa-arrow-left mr-2"></i> Kembali
        </button>
        <div className="space-x-3">
          <button
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium"
            disabled={isUploading}
          >
            Simpan Draft
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium disabled:opacity-50"
            disabled={isUploading || filesToUpload.length === 0}
          >
            {isUploading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Memproses...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i> Proses Dokumen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
