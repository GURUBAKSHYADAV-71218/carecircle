import React from "react";
import {
  LayoutDashboard,
  Pill,
  Calendar,
  Users,
  Bell,
  MoreHorizontal
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const MobileNav = ({ activePage, setActivePage }) => {
  const { unreadNotificationsCount } = useCare();

  const mobileTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "medications", label: "Meds", icon: Pill },
    { id: "appointments", label: "Apts", icon: Calendar },
    { id: "care-team", label: "Team", icon: Users },
    {
      id: "notifications",
      label: "Alerts",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: "settings", label: "More", icon: MoreHorizontal }
  ];

  return (
    <nav className="mobile-nav">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`mobile-tab-btn ${isActive ? "active" : ""}`}
          >
            <div className="mobile-tab-icon-wrapper">
              <Icon size={20} />
              {tab.badge && <span className="mobile-tab-badge">{tab.badge}</span>}
            </div>
            <span className="mobile-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
