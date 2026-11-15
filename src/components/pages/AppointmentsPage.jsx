import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Stethoscope,
  Edit2,
  Trash2,
  List,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const AppointmentsPage = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteConfirm
}) => {
  const {
    appointments,
    markAppointmentCompleted,
    searchQuery,
    setSearchQuery
  } = useCare();

  const [viewType, setViewType] = useState("list"); // 'list' | 'calendar'
  const [filterStatus, setFilterStatus] = useState("upcoming"); // 'upcoming' | 'completed' | 'all'
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchQuery === "" ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.specialty && apt.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.hospitalName && apt.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (apt.notes && apt.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    return apt.status === filterStatus;
  });

  // Calculate days remaining helper
  const getDaysCountdown = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(`${dateStr}T00:00:00`);
    const diff = Math.ceil((aptDate - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Past";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `In ${diff} days`;
  };

  // Calendar month days calculation
  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const { firstDay, daysInMonth } = getMonthDays(calYear, calMonth);
  const monthName = calendarDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCalendarDate(new Date(calYear, calMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calYear, calMonth + 1, 1));
  };

  return (
    <div className="appointments-page">
      {/* Top Header Actions Bar */}
      <div className="page-header-actions-bar">
        <div className="page-search-and-filters">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search appointments by doctor, clinic, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control page-search-input"
            />
          </div>

          <div className="filter-pills-group">
            <button
              onClick={() => setFilterStatus("upcoming")}
              className={`filter-pill ${filterStatus === "upcoming" ? "active" : ""}`}
            >
              Upcoming ({appointments.filter((a) => a.status === "upcoming").length})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`filter-pill ${filterStatus === "completed" ? "active" : ""}`}
            >
              Completed ({appointments.filter((a) => a.status === "completed").length})
            </button>
            <button
              onClick={() => setFilterStatus("all")}
              className={`filter-pill ${filterStatus === "all" ? "active" : ""}`}
            >
              All Records ({appointments.length})
            </button>
          </div>
        </div>

        <div className="header-view-toggle-and-add">
          {/* Calendar vs List view toggle */}
          <div className="view-mode-toggle-group">
            <button
              onClick={() => setViewType("list")}
              className={`toggle-btn ${viewType === "list" ? "active" : ""}`}
              title="List View"
            >
              <List size={16} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewType("calendar")}
              className={`toggle-btn ${viewType === "calendar" ? "active" : ""}`}
              title="Monthly Calendar View"
            >
              <CalendarDays size={16} />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            title="Schedule a new consultation"
          >
            <Plus size={16} />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* View: List View */}
      {viewType === "list" ? (
        <div className="appointments-list-container">
          {appointments.length === 0 ? (
            <div className="card empty-state-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <CalendarIcon size={42} style={{ color: "var(--aqua)", margin: "0 auto 12px" }} />
              <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--deep-ocean)", marginBottom: "8px" }}>
                No appointments scheduled yet
              </h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "460px", margin: "0 auto 20px", lineHeight: 1.5 }}>
                Track doctor consultations, specialist checkups, and wellness visits with automatic countdown reminders.
              </p>
              <button onClick={onOpenAddModal} className="btn btn-primary" style={{ margin: "0 auto" }}>
                <Plus size={16} />
                <span>Schedule First Appointment</span>
              </button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="card empty-state-card">
              <CalendarIcon size={32} className="text-muted" />
              <h4>No appointments found for this filter</h4>
              <p>Schedule a new doctor visit or change your search filter.</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {filteredAppointments.map((apt) => {
                const isCompleted = apt.status === "completed";
                const countdown = getDaysCountdown(apt.date);

                return (
                  <div
                    key={apt.id}
                    className={`card appointment-card ${isCompleted ? "apt-completed" : ""}`}
                  >
                    <div className="apt-card-top-header">
                      <div className="apt-badge-wrap">
                        <span className={`badge ${isCompleted ? "badge-turquoise" : "badge-ocean"}`}>
                          {isCompleted ? "Completed" : countdown}
                        </span>
                        {apt.specialty && <span className="apt-specialty-badge">{apt.specialty}</span>}
                      </div>

                      <div className="apt-actions-menu">
                        {!isCompleted && (
                          <button
                            onClick={() => markAppointmentCompleted(apt.id)}
                            className="btn-icon-subtle text-turquoise"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenEditModal(apt)}
                          className="btn-icon-subtle"
                          title="Edit Appointment"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onOpenDeleteConfirm(apt)}
                          className="btn-icon-subtle text-coral"
                          title="Delete Appointment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="apt-doctor-info">
                      <div className="apt-avatar-icon">
                        <Stethoscope size={22} />
                      </div>
                      <div>
                        <h3 className="apt-doctor-title">{apt.doctorName}</h3>
                        {apt.hospitalName && <span className="apt-hospital-title">{apt.hospitalName}</span>}
                      </div>
                    </div>

                    <div className="apt-meta-info-list">
                      <div className="apt-meta-item">
                        <Clock size={15} className="meta-icon" />
                        <span>
                          {new Date(`${apt.date}T00:00:00`).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}{" "}
                          at {apt.time}
                        </span>
                      </div>

                      {apt.location && (
                        <div className="apt-meta-item">
                          <MapPin size={15} className="meta-icon" />
                          <span>{apt.location}</span>
                        </div>
                      )}
                    </div>

                    {apt.notes && (
                      <div className="apt-notes-box">
                        <p>
                          <strong>Clinical Objectives:</strong> {apt.notes}
                        </p>
                      </div>
                    )}

                    {!isCompleted && (
                      <div className="apt-card-bottom-action">
                        <button
                          onClick={() => markAppointmentCompleted(apt.id)}
                          className="btn btn-sm btn-outline"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Consultation Completed</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* View: Calendar Monthly View */
        <div className="card calendar-view-container">
          <div className="calendar-controls-bar">
            <h3 className="calendar-month-title">{monthName}</h3>
            <div className="calendar-nav-buttons">
              <button onClick={prevMonth} className="btn btn-outline btn-icon">
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCalendarDate(new Date())}
                className="btn btn-outline btn-sm"
              >
                Today
              </button>
              <button onClick={nextMonth} className="btn btn-outline btn-icon">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <div key={dayName} className="calendar-day-header">
                {dayName}
              </div>
            ))}

            {/* Empty offset days */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="calendar-day-cell empty-cell" />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const currentDayStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayAppointments = appointments.filter((a) => a.date === currentDayStr);
              const isToday = currentDayStr === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={dayNum}
                  className={`calendar-day-cell ${isToday ? "cell-today" : ""}`}
                >
                  <div className="cell-day-number">{dayNum}</div>
                  <div className="cell-appointments-list">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`calendar-apt-chip ${apt.status === "completed" ? "apt-done" : "apt-active"}`}
                        onClick={() => onOpenEditModal(apt)}
                        title={`${apt.doctorName} (${apt.specialty}) at ${apt.time}`}
                      >
                        <span className="cal-chip-time">{apt.time}</span>
                        <span className="cal-chip-name">{apt.doctorName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
