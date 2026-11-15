import React, { useState } from "react";
import { ShieldCheck, Lock, X, AlertCircle } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const CaregiverPasscodeModal = ({ isOpen, onClose }) => {
  const { authenticateCaregiver } = useCare();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passcode) {
      setError("Please enter the demo passcode.");
      return;
    }

    const success = authenticateCaregiver(passcode);
    if (success) {
      setPasscode("");
      setError("");
      onClose();
    } else {
      setError("Incorrect passcode. The default demo passcode is 2468.");
    }
  };

  const handleUseDefault = () => {
    setPasscode("2468");
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <ShieldCheck size={22} className="text-turquoise" />
            <h3 className="modal-title">Caregiver Access Demo</h3>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="passcode-modal-body">
            <p className="modal-desc">
              CareCircle enables authorized family members and healthcare providers to view and coordinate care.
            </p>

            <div className="demo-notice-box">
              <Lock size={15} />
              <span>Default Demo Passcode: <strong>2468</strong></span>
            </div>

            <div className="form-group" style={{ marginTop: "16px" }}>
              <label className="form-label">Enter 4-Digit Passcode</label>
              <input
                type="password"
                maxLength={8}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 2468"
                autoFocus
                className={`form-control passcode-input ${error ? "input-error" : ""}`}
              />
              {error && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="passcode-quick-fill">
              <button
                type="button"
                onClick={handleUseDefault}
                className="btn-text-link"
              >
                Auto-fill Default Passcode (2468)
              </button>
            </div>

            <div className="security-disclaimer">
              <p>
                <strong>Security Notice:</strong> This is a client-side frontend demonstration of shared role-based access for hackathon evaluation. LocalStorage passcodes do not replace production healthcare authentication or HIPAA/GDPR safeguards.
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Unlock Caregiver View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
