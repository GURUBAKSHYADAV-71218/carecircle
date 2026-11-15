import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  Mail,
  Check,
  Filter,
  Eye
} from "lucide-react";
import { useCare } from "../../context/CareContext";
import { generateEmailPayload, EMAIL_TEMPLATES } from "../../services/emailService";

export const NotificationsPage = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markNotificationUnread,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
    patient,
    setEmailPreviewModalData
  } = useCare();

  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'medication' | 'appointment' | 'caregiver'

  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === "all") return true;
    return notif.category === activeCategory;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "urgent":
        return <span className="badge badge-coral">Urgent Alert</span>;
      case "warning":
        return <span className="badge badge-pending">Notice</span>;
      case "success":
        return <span className="badge badge-turquoise">Success</span>;
      default:
        return <span className="badge badge-ocean">Information</span>;
    }
  };

  const handleTestEmailPreview = () => {
    const testPayload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {
      patientName: patient.name,
      caregiverName: patient.primaryCaregiver,
      caregiverEmail: patient.emergencyContact.email,
      medName: "Calcium Supplement (500mg)",
      dosage: "1 tablet",
      scheduledTime: "12:30 PM",
      instructions: "Take with meal"
    });
    setEmailPreviewModalData(testPayload);
  };

  return (
    <div className="notifications-page">
      {/* Top Controls Bar */}
      <div className="page-header-actions-bar">
        <div className="filter-pills-group">
          <button
            onClick={() => setActiveCategory("all")}
            className={`filter-pill ${activeCategory === "all" ? "active" : ""}`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveCategory("medication")}
            className={`filter-pill ${activeCategory === "medication" ? "active" : ""}`}
          >
            Medication Doses
          </button>
          <button
            onClick={() => setActiveCategory("appointment")}
            className={`filter-pill ${activeCategory === "appointment" ? "active" : ""}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveCategory("caregiver")}
            className={`filter-pill ${activeCategory === "caregiver" ? "active" : ""}`}
          >
            Caregiver Activity
          </button>
        </div>

        <div className="notif-actions-group">
          <button
            onClick={handleTestEmailPreview}
            className="btn btn-outline"
            title="Preview generated email notification template"
          >
            <Mail size={16} />
            <span>Preview Caregiver Email</span>
          </button>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="btn btn-outline"
              title="Mark all notifications as read"
            >
              <Check size={16} />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="btn btn-outline text-coral"
              title="Clear all alerts"
            >
              <Trash2 size={16} />
              <span>Clear Inbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list-container">
        {filteredNotifications.length === 0 ? (
          <div className="card empty-state-card">
            <Bell size={32} className="text-muted" />
            <h4>Your notification inbox is clear</h4>
            <p>New dose alerts and appointment reminders will arrive here automatically.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`card notif-card ${!notif.read ? "notif-unread" : ""}`}
            >
              <div className="notif-card-header">
                <div className="notif-card-badge-row">
                  {getSeverityBadge(notif.severity)}
                  <span className="notif-time-str">
                    <Clock size={13} />
                    {new Date(notif.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <div className="notif-card-actions">
                  {!notif.read ? (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="btn-icon-subtle text-turquoise"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => markNotificationUnread(notif.id)}
                      className="btn-icon-subtle"
                      title="Mark as unread"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="btn-icon-subtle text-coral"
                    title="Dismiss alert"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="notif-card-content">
                <h4 className="notif-title">{notif.title}</h4>
                <p className="notif-desc">{notif.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
