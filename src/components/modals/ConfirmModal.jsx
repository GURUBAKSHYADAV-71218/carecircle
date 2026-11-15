import React from "react";
import { AlertTriangle, X } from "lucide-react";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  confirmVariant = "btn-danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <AlertTriangle size={22} className="text-coral" />
            <h3 className="modal-title">{title}</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${confirmVariant}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
