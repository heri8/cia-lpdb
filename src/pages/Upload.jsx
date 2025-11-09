import { lazy, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { documentsAPI } from "../services/api";

const ApplicationInfo = lazy(() =>
  import("../components/Upload/ApplicationInfo")
);
const DocumentUpload = lazy(() =>
  import("../components/Upload/DocumentUpload")
);
const UploadHistory = lazy(() => import("../components/Upload/UploadHistory"));

const Upload = () => {
  const location = useLocation();
  const prefilledApplicationId = location.state?.applicationId || null;

  const applicationId = "APL-2023-0015";

  // 1. Definisikan fungsi API yang akan dipanggil oleh useApi
  // const fetchDocuments = useCallback(
  //   () => documentsAPI.getUploadedDocuments(applicationId),
  //   []
  // );

  // const fetchHistory = useCallback(
  //   () => documentsAPI.getUploadHistory(applicationId),
  //   []
  // );

  // 2. Panggil useApi untuk fetching data
  // const {
  //   data: uploadedDocuments,
  //   loading: loadingDocuments,
  //   error: errorDocuments,
  //   refetch: refetchDocuments,
  // } = useApi(fetchDocuments);

  // const {
  //   data: uploadHistory,
  //   loading: loadingHistory,
  //   error: errorHistory,
  //   refetch: refetchHistory,
  // } = useApi(fetchHistory);

  // 3. Gabungkan status loading dan error
  // const isLoading = loadingDocuments || loadingHistory;
  // const isError = errorDocuments || errorHistory;
  const isLoading = false;
  const isError = null;

  // 4. Handler untuk memuat ulang data setelah upload berhasil di DocumentUpload
  const handleUploadComplete = () => {
    // Refresh kedua data (dokumen dan history)
    // refetchDocuments();
    // refetchHistory();
    // Opsional: Tampilkan notifikasi
    // alert("Dokumen berhasil diunggah! Data sedang di-refresh.");
  };

  // --- Render Status ---

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 lg:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i>
          <p className="text-gray-600 font-medium">Memuat data aplikasi...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl max-w-6xl mx-auto">
          <p className="font-semibold">Terjadi Kesalahan Saat Memuat Data</p>
          <p className="text-sm">
            Gagal memuat dokumen atau riwayat unggahan: {isError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Upload Dokumen Aplikasi: {applicationId}
        </h1>

        <ApplicationInfo prefilledId={prefilledApplicationId} />

        <DocumentUpload
          applicationId={applicationId}
          // uploadedDocuments={uploadedDocuments || []}
          uploadedDocuments={[]}
          onUploadComplete={handleUploadComplete}
        />

        <UploadHistory
          applicationId={applicationId}
          // history={uploadHistory || []}
          history={[]}
        />
      </div>
    </div>
  );
};

export default Upload;
