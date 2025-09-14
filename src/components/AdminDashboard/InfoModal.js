import React from 'react';

const InfoModal = ({
  isOpen,
  onClose,
  title,
  message,
  iconClass = 'fas fa-check-circle', // Default to a success checkmark
  iconColor = '#22c55e' // Default to green
}) => {
  if (!isOpen) {
    return null;
  }

  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Uses the same styles as the confirmation modal for consistency */}
      <div className="confirmation-modal-content" onClick={handleModalContentClick}>
        <div className="confirmation-modal-icon" style={{ color: iconColor, backgroundColor: `${iconColor}20` }}>
          <i className={iconClass}></i>
        </div>
        <h2 className="confirmation-modal-title">{title}</h2>
        <p className="confirmation-modal-message">{message}</p>
        <div className="confirmation-modal-actions">
          <button
            className="admin-btn admin-btn-primary"
            onClick={onClose}
            style={{flexGrow: 0, padding: '10px 40px'}} // Make the OK button smaller
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;