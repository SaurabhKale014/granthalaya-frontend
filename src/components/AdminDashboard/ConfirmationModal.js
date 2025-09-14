import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmButtonClass = 'admin-btn-primary',
  processing = false
}) => {
  if (!isOpen) {
    return null;
  }

  // Prevents clicks inside the modal from closing it
  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    // The overlay uses the existing style from your CSS
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={handleModalContentClick}>
        <div className="confirmation-modal-icon">
          <i className="fas fa-trash-alt"></i>
        </div>
        <h2 className="confirmation-modal-title">{title}</h2>
        <p className="confirmation-modal-message">{message}</p>
        <div className="confirmation-modal-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            className={`admin-btn ${confirmButtonClass}`}
            onClick={onConfirm}
            disabled={processing}
          >
            {processing ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;