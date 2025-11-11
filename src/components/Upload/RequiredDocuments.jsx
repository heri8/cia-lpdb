// src/components/Upload/RequiredDocuments.jsx (Disesuaikan)

import React from 'react';
import { REQUIRED_DOCUMENTS_MAPPING } from '../../constants/document_types';

// Fungsi inti untuk mengecek status
const getDocumentStatus = (requiredDoc, uploadedDocuments) => {
    // Cari apakah ada dokumen yang diunggah yang memiliki tipe_dokumen yang cocok
    const isUploaded = uploadedDocuments.some((uploadedDoc) =>
        // 💡 Cocokkan tipe_dokumen backend (case-insensitive)
        requiredDoc.backend_types.some(requiredType =>
            requiredType.toUpperCase() === uploadedDoc.tipe_dokumen.toUpperCase()
        )
    );

    if (isUploaded) {
        return {
            status: "Tersedia",
            color: "text-green-500",
            icon: "check-circle",
        };
    }

    if (requiredDoc.requiredType === 'Wajib') {
        return { status: "Belum Wajib", color: "text-red-500", icon: "times-circle" };
    }

    // Default untuk opsional yang belum terunggah
    return { status: "Opsional", color: "text-gray-400", icon: "circle" };
};


const RequiredDocuments = ({ uploadedDocuments = [], onTriggerExtraction, isExtracting }) => {

    // Tentukan apakah tombol AI harus aktif
    const hasUploadedFiles = uploadedDocuments.length > 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h4 className="font-bold text-gray-800">
                    Dokumen yang Diperlukan ({REQUIRED_DOCUMENTS_MAPPING.length} item)
                </h4>
            </div>

            <div className="space-y-3">
                {REQUIRED_DOCUMENTS_MAPPING.map((doc, index) => {
                    const status = getDocumentStatus(doc, uploadedDocuments);

                    return (
                        <div
                            key={doc.key}
                            className="flex items-center p-3 border border-gray-200 rounded-xl file-item hover:shadow-sm transition"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <i className={`fas fa-${doc.icon} text-blue-500`}></i>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{doc.title}</p>
                                <p className="text-xs text-gray-500">
                                    {doc.requiredType}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <i
                                    className={`fas fa-${status.icon} text-sm ${status.color}`}
                                ></i>{" "}
                                <span className={`text-sm font-semibold ${status.color}`}>
                                    {status.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RequiredDocuments;