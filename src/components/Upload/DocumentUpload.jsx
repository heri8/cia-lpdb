import { useState, useRef } from "react";
import RequiredDocuments from "./RequiredDocuments";

const DocumentUpload = () => {
  const [isDragActive, setIsDragActive] = useState(false);
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
  };

  const handleFiles = (files) => {
    console.log("Files to upload:", files);
    // Handle file upload logic here
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Unggah Dokumen</h3>
        <p className="text-sm text-gray-500">
          Seret dan lepas file atau klik untuk memilih
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone p-8 text-center mb-6 ${
          isDragActive ? "active" : ""
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-cloud-upload-alt text-blue-500 text-2xl"></i>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            Seret file ke sini
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Support: PDF, JPG, PNG, CSV, Excel (Max. 10MB per file)
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
            Pilih File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
            onChange={handleFileInput}
          />
        </div>
      </div>

      {/* Progress Upload */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress Upload
          </span>
          <span className="text-sm text-gray-500">0/8 dokumen</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill bg-blue-500"
            style={{ width: "0%" }}
          ></div>
        </div>
      </div>

      <RequiredDocuments />

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
          <i className="fas fa-arrow-left mr-2"></i> Kembali
        </button>
        <div className="space-x-3">
          <button className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
            Simpan Draft
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-medium">
            Proses Dokumen <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
