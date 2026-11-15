import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  PhoneCall,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  X
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const Header = ({
  activePage,
  setActivePage,
  openPasscodeModal
}) => {
  const {
    patient,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    viewMode,
    switchBackToPatient,
    searchQuery,
    setSearchQuery
  } = useCare();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard":
        return {
          title: "Care Dashboard",
          subtitle: `Connected health overview for ${patient.name}`
        };
      case "medications":
        return {
          title: "Medication Management",
          subtitle: "Daily medication schedules, dose adherence & supply tracking"
        };
      case "appointments":
        return {
          title: "Doctor Appointments",
          subtitle: "Upcoming consultations, clinical notes & calendar schedule"
        };
      case "care-team":
        return {
          title: "Care Team & Family Access",
          subtitle: "Collaborative care circle for family members and caregivers"
        };
      case "notifications":
        return {
          title: "Notification Centre",
          subtitle: "Proactive care alerts, upcoming doses & urgent updates"
        };
      case "timeline":
        return {
          title: "Care Activity Timeline",
          subtitle: "Real-time chronological log of health and medication actions"
        };
      case "reports":
        return {
          title: "Care Reports & Summary",
          subtitle: "Printable adherence records, appointment history & clinical summary"
        };
      case "settings":
        return {
          title: "Settings & Profile",
          subtitle: "Manage patient healthcare details, passcode and preferences"
        };
      default:
        return { title: "CareCircle", subtitle: "Elderly Care Management" };
    }
  };

  const { title, subtitle } = getPageTitle();

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "urgent":
        return <AlertTriangle size={16} className="text-coral" />;
      case "warning":
        return <AlertTriangle size={16} className="text-warning" />;
      case "success":
        return <CheckCircle2 size={16} className="text-turquoise" />;
      default:
        return <Info size={16} className="text-ocean" />;
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <div>
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Instant Search Bar (Micro-feature 2) */}
        <div className="header-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search medications, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Emergency Call Quick Access (Micro-feature 6) */}
        <a
          href={`tel:${patient.emergencyContact.phone.replace(/[^0-9+]/g, "")}`}
          className="header-emergency-btn"
          title={`Call Emergency Contact: ${patient.emergencyContact.name} (${patient.emergencyContact.phone})`}
        >
          <PhoneCall size={16} />
          <span className="emergency-label">Emergency Call</span>
        </a>

        {/* Notification Bell with Dropdown */}
        <div className="header-notif-container" ref={dropdownRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className={`header-icon-btn ${unreadNotificationsCount > 0 ? "has-unread" : ""}`}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="unread-dot">{unreadNotificationsCount}</span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {isNotifDropdownOpen && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span className="notif-dropdown-title">Recent Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="notif-dropdown-action"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty-state">
                    <p>No notifications right now.</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif-dropdown-item ${!notif.read ? "unread" : ""}`}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        setIsNotifDropdownOpen(false);
                        setActivePage("notifications");
                      }}
                    >
                      <div className="notif-icon-col">
                        {getSeverityIcon(notif.severity)}
                      </div>
                      <div className="notif-content-col">
                        <span className="notif-item-title">{notif.title}</span>
                        <p className="notif-item-desc">{notif.description}</p>
                        <span className="notif-item-time">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="notif-dropdown-footer">
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(false);
                    setActivePage("notifications");
                  }}
                  className="btn-view-all-notifs"
                >
                  View All Notifications Centre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Switcher Chip */}
        <div className="header-view-chip">
          {viewMode === "caregiver" ? (
            <button
              onClick={switchBackToPatient}
              className="view-mode-button caregiver-active"
              title="Click to switch back to Patient view"
            >
              <ShieldCheck size={16} />
              <span className="mode-text">Caregiver View</span>
            </button>
          ) : (
            <button
              onClick={openPasscodeModal}
              className="view-mode-button patient-active"
              title="Click to enter Caregiver Mode (Passcode: 2468)"
            >
              <UserCheck size={16} />
              <span className="mode-text">Patient View</span>
            </button>
          )}
        </div>

        {/* Profile Avatar Chip */}
        <div
          className="header-profile-chip"
          onClick={() => setActivePage("settings")}
          title="Open Profile Settings"
        >
          <img
            src={patient.avatar}
            alt={patient.name}
            className="header-avatar"
          />
          <div className="header-profile-text">
            <span className="header-profile-name">{patient.name}</span>
            <span className="header-profile-role">
              {viewMode === "caregiver" ? "Sarah Wilson (Caregiver)" : "Elderly Resident"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
