// src/constants/document_types.js

// Definisi dokumen wajib yang akan ditampilkan di frontend
export const REQUIRED_DOCUMENTS_MAPPING = [
  {
    key: "KTP_NASABAH",
    title: "Kartu Tanda Penduduk (KTP) Nasabah",
    icon: "id-card",
    requiredType: "Wajib",
    // 💡 Array tipe dokumen backend yang termasuk dalam kategori ini
    backend_types: ["KTP", "KTP_SUAMI_ISTRI"],
  },
  {
    key: "KK",
    title: "Kartu Keluarga (KK)",
    icon: "users",
    requiredType: "Wajib",
    backend_types: ["KARTU_KELUARGA"],
  },
  {
    key: "NPWP_USAHA",
    title: "NPWP Pribadi/Badan Usaha",
    icon: "file-invoice-dollar",
    requiredType: "Wajib",
    backend_types: ["NPWP", "NPWP_PRIBADI"],
  },
  {
    key: "DOKUMEN_AGUNAN",
    title: "Dokumen Agunan (SHM/BPKB)",
    icon: "home",
    requiredType: "Opsional",
    backend_types: ["SERTIFIKAT_TANAH", "BPKB"],
  },
];
