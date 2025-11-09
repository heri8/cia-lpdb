// src/hooks/useUploadData.js

import { useState } from "react";

// --- DUMMY DATA ---

/**
 * Data mock untuk daftar dokumen yang diperlukan
 */
export const mockRequiredDocuments = [
  {
    icon: "file-pdf",
    title: "Form Aplikasi Pinjaman",
    description: "Wajib",
    status: "Diunggah", // Status awal: Diunggah
    statusColor: "text-success",
    progress: 100,
    required: true,
  },
  {
    icon: "file-contract",
    title: "Akta Pendirian/AD-ART/SK",
    description: "Wajib",
    status: "Belum", // Status awal: Belum
    statusColor: "text-danger",
    progress: 0,
    required: true,
  },
  {
    icon: "chart-line",
    title: "Laporan RAT/Keuangan Terakhir",
    description: "Wajib",
    status: "Diunggah",
    statusColor: "text-success",
    progress: 100,
    required: true,
  },
  {
    icon: "table",
    title: "Rencana Kerja 6 Bulan",
    description: "Wajib",
    status: "Proses OCR",
    statusColor: "text-warning",
    progress: 50,
    required: true,
  },
  {
    icon: "id-card",
    title: "KTP Pengurus/Direksi",
    description: "Wajib",
    status: "Belum",
    statusColor: "text-danger",
    progress: 0,
    required: true,
  },
  {
    icon: "building",
    title: "NIB/NPWP/Izin Usaha",
    description: "Wajib",
    status: "Diunggah",
    statusColor: "text-success",
    progress: 100,
    required: true,
  },
  {
    icon: "home",
    title: "Dokumen Agunan Utama",
    description: "Opsional",
    status: "Opsional",
    statusColor: "text-gray-400",
    progress: 0,
    required: false,
  },
];

/**
 * Data mock untuk riwayat unggahan
 */
export const mockUploadHistory = [
  {
    id: "APL-2023-0014",
    name: "PT. Global Mandiri",
    date: "12 Nov 2023, 14:30",
    status: "Selesai",
    statusColor: "green",
  },
  {
    id: "APL-2023-0013",
    name: "CV. Sejahtera Jaya",
    date: "11 Nov 2023, 09:15",
    status: "Proses OCR",
    statusColor: "yellow",
  },
  {
    id: "APL-2023-0012",
    name: "PT. Maju Jaya Abadi",
    date: "10 Nov 2023, 16:45",
    status: "Selesai",
    statusColor: "green",
  },
];

// --- HOOKS ---

export const useRequiredDocuments = () => {
  // Gunakan state agar data bisa diubah/diupdate seolah-olah dari API
  const [documents, setDocuments] = useState(mockRequiredDocuments);

  // Hitung status progress keseluruhan
  const totalRequired = documents.filter((doc) => doc.required).length;
  const uploadedCount = documents.filter(
    (doc) => doc.status === "Diunggah" && doc.required
  ).length;
  const totalCount = documents.length;

  const uploadProgress = Math.round((uploadedCount / totalRequired) * 100) || 0;

  // Fungsi untuk mensimulasikan unggahan dokumen
  const simulateDocumentUpload = (title) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.title === title && doc.status !== "Diunggah"
          ? {
              ...doc,
              status: "Diunggah",
              statusColor: "text-success",
              progress: 100,
            }
          : doc
      )
    );
  };

  return {
    documents,
    uploadProgress,
    uploadedCount,
    totalCount,
    totalRequired,
    simulateDocumentUpload,
  };
};

export const useUploadHistory = () => {
  const [history] = useState(mockUploadHistory);

  return { history };
};
