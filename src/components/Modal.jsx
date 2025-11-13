// src/components/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center"
            onClick={onClose} // Menutup modal saat klik di luar
        >
            <div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-4 my-8"
                onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Konten Modal */}
                <div className="max-h-[80vh] overflow-y-auto pr-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;