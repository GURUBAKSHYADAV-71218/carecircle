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
  HeartHandshake
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const Sidebar = ({ activePage, setActivePage, openPasscodeModal }) => {
  const {
    patient,
    unreadNotificationsCount,
    viewMode,
    switchBackToPatient
  } = useCare();

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
        <img
          src={patient.avatar}
          alt={patient.name}
          className="sidebar-patient-avatar"
        />
        <div className="sidebar-patient-info">
          <span className="sidebar-patient-name">{patient.name}</span>
          <span className="sidebar-patient-meta">
            Age {patient.age} • Blood {patient.bloodGroup}
          </span>
        </div>
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
            title="Switch back to Margaret's patient view"
          >
            Switch to Patient
          </button>
        ) : (
          <button
            onClick={openPasscodeModal}
            className="btn-switch-role"
            title="Enter demo passcode (2468) for caregiver access"
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
          <span className="footer-value">{patient.primaryCaregiver}</span>
          <a
            href={`tel:${patient.emergencyContact.phone.replace(/[^0-9+]/g, "")}`}
            className="footer-phone-link"
          >
            {patient.emergencyContact.phone}
          </a>
        </div>
      </div>
    </aside>
  );
};
