// src/components/Applications/NewApplicationModal.jsx

import React from 'react';
import Modal from './Modal';
import ApplicationForm from './ApplicationForm';

const NewApplicationModal = ({ isOpen, onClose, onNewApplicationCreated }) => {

    const handleSaveSuccess = (newApplicationId) => {
        // Panggil handler dari parent untuk refetch data
        if (onNewApplicationCreated) {
            onNewApplicationCreated(newApplicationId);
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Buat Aplikasi Pinjaman Baru"
        >
            <ApplicationForm
                onSaveSuccess={handleSaveSuccess}
            />
        </Modal>
    );
};

export default NewApplicationModal;