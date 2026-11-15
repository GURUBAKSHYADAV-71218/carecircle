import React from "react";
import { PhoneCall, ShieldAlert, Heart, User } from "lucide-react";
import { useCare } from "../../context/CareContext";

export const EmergencyCard = () => {
  const { patient } = useCare();
  const contact = patient.emergencyContact;
  const cleanPhone = contact.phone.replace(/[^0-9+]/g, "");

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
            <h4 className="emergency-name">{contact.name}</h4>
            <p className="emergency-relation">{contact.relation}</p>
          </div>
        </div>

        {/* Micro-feature 6: Working tel: link */}
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
      </div>

      <div className="emergency-footer-note">
        <span>Attending Physician: {patient.physician || "Dr. Robert Chen"}</span>
      </div>
    </div>
  );
};
