import React from "react";
import { PhoneCall, ShieldAlert, User, UserPlus } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const EmergencyCard = () => {
  const { patient } = useCare();
  const contact = patient.emergencyContact || {};
  const hasContact = contact.name && contact.name.trim() !== "";
  const hasPhone = contact.phone && contact.phone.trim() !== "";
  const cleanPhone = hasPhone ? contact.phone.replace(/[^0-9+]/g, "") : "";

  if (!hasContact && !hasPhone) {
    return (
      <div className="card emergency-widget-card">
        <div className="emergency-card-header">
          <div className="emergency-badge">
            <ShieldAlert size={14} />
            <span>Emergency Contact</span>
          </div>
        </div>
        <div className="emergency-body" style={{ textAlign: "center", padding: "16px 0" }}>
          <div className="emergency-avatar-icon" style={{ margin: "0 auto 10px" }}>
            <UserPlus size={22} />
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            No emergency contact configured.<br />
            Add one in <strong>Settings</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card emergency-widget-card">
      <div className="emergency-card-header">
        <div className="emergency-badge">
          <ShieldAlert size={14} />
          <span>Priority Contact</span>
        </div>
        <span className="emergency-label-sub">24/7 Availability</span>
      </div>

      <div className="emergency-body">
        <div className="emergency-contact-details">
          <div className="emergency-avatar-icon">
            <User size={22} />
          </div>
          <div className="emergency-text">
            <h4 className="emergency-name">{contact.name || "Emergency Contact"}</h4>
            {contact.relation && (
              <p className="emergency-relation">{contact.relation}</p>
            )}
          </div>
        </div>

        {/* Only render tel: link when phone is set */}
        {hasPhone && (
          <div className="emergency-actions">
            <a
              href={`tel:${cleanPhone}`}
              className="btn btn-danger btn-call-now"
              title={`Direct dial: ${contact.phone}`}
            >
              <PhoneCall size={18} />
              <span>Call Now: {contact.phone}</span>
            </a>
          </div>
        )}
      </div>

      {patient.physician && (
        <div className="emergency-footer-note">
          <span>Attending Physician: {patient.physician}</span>
        </div>
      )}
    </div>
  );
};
