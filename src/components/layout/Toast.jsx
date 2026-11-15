import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const Toast = () => {
  const { toasts, removeToast } = useCare();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="toast-icon text-turquoise" />;
      case "warning":
        return <AlertTriangle size={18} className="toast-icon text-warning" />;
      case "error":
        return <AlertCircle size={18} className="toast-icon text-coral" />;
      default:
        return <Info size={18} className="toast-icon text-ocean" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-icon-wrapper">{getIcon(toast.type)}</div>
          <p className="toast-message">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close-btn"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
