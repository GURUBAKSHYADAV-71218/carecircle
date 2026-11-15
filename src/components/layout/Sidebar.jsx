import React from "react";
import {
  LayoutDashboard,
  Pill,
  Calendar,
  Users,
  Bell,
  Clock,
  FileBarChart2,
  Settings,
  ShieldCheck,
  UserCheck,
  HeartHandshake,
  UserPlus
} from "lucide-react";
import { useCare } from "../../context/CareContext";
import { InitialsAvatar } from "../common/InitialsAvatar";

export const Sidebar = ({ activePage, setActivePage, openPasscodeModal, onOpenSetupProfile }) => {
  const {
    patient,
    unreadNotificationsCount,
    viewMode,
    switchBackToPatient
  } = useCare();

  const isNewUser = !patient.name || patient.name.trim() === "";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "care-team", label: "Care Team", icon: Users },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: "timeline", label: "Care Timeline", icon: Clock },
    { id: "reports", label: "Reports & Print", icon: FileBarChart2 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <HeartHandshake className="brand-logo-icon" size={24} />
        </div>
        <div className="brand-text-container">
          <span className="brand-title">CareCircle</span>
          <span className="brand-tagline">Care that connects.</span>
        </div>
      </div>

      {/* Patient Identity Badge in Sidebar */}
      <div className="sidebar-patient-card">
        {isNewUser ? (
          <button
            onClick={onOpenSetupProfile}
            className="sidebar-setup-btn"
            title="Set up patient profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textAlign: "left"
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "2px dashed rgba(255,255,255,0.35)"
              }}
            >
              <UserPlus size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
            </div>
            <div className="sidebar-patient-info">
              <span className="sidebar-patient-name" style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic", fontSize: "0.82rem" }}>
                Set Up Patient Profile
              </span>
              <span className="sidebar-patient-meta" style={{ color: "rgba(255,255,255,0.4)" }}>
                Click to get started
              </span>
            </div>
          </button>
        ) : (
          <>
            <InitialsAvatar
              name={patient.name}
              avatar={patient.avatar}
              size={44}
              className="sidebar-patient-avatar"
            />
            <div className="sidebar-patient-info">
              <span className="sidebar-patient-name">{patient.name}</span>
              <span className="sidebar-patient-meta">
                {patient.age ? `Age ${patient.age}` : ""}
                {patient.age && patient.bloodGroup ? " • " : ""}
                {patient.bloodGroup ? `Blood ${patient.bloodGroup}` : ""}
                {!patient.age && !patient.bloodGroup ? "Patient" : ""}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Role / Mode Switcher Pill */}
      <div className="sidebar-role-indicator">
        <div className={`role-pill ${viewMode === "caregiver" ? "role-caregiver" : "role-patient"}`}>
          {viewMode === "caregiver" ? (
            <>
              <ShieldCheck size={14} />
              <span>Caregiver Mode</span>
            </>
          ) : (
            <>
              <UserCheck size={14} />
              <span>Patient Mode</span>
            </>
          )}
        </div>
        {viewMode === "caregiver" ? (
          <button
            onClick={switchBackToPatient}
            className="btn-switch-role"
            title="Switch back to patient view"
          >
            Switch to Patient
          </button>
        ) : (
          <button
            onClick={openPasscodeModal}
            className="btn-switch-role"
            title="Enter passcode for caregiver access"
          >
            Caregiver Access
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`sidebar-nav-link ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={19} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge-count">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="caregiver-quick-contact">
          <span className="footer-label">Primary Caregiver</span>
          {patient.primaryCaregiver ? (
            <>
              <span className="footer-value">{patient.primaryCaregiver}</span>
              {patient.emergencyContact?.phone && (
                <a
                  href={`tel:${patient.emergencyContact.phone.replace(/[^0-9+]/g, "")}`}
                  className="footer-phone-link"
                >
                  {patient.emergencyContact.phone}
                </a>
              )}
            </>
          ) : (
            <span className="footer-value" style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
              Not configured
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
