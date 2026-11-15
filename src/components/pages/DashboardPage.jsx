import React from "react";
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Users,
  Calendar,
  Printer,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Heart,
  TrendingUp,
  Activity
} from "lucide-react";
import { useCare } from "../../context/CareContext";
import { EmergencyCard } from "../widgets/EmergencyCard";
import { DailyChecklistCard } from "../widgets/DailyChecklistCard";
import { WeeklyAdherenceChart } from "../widgets/WeeklyAdherenceChart";
import { NextReminderCard } from "../widgets/NextReminderCard";
import { NextAppointmentCard } from "../widgets/NextAppointmentCard";
import { LowStockBanner } from "../widgets/LowStockBanner";

export const DashboardPage = ({
  onNavigate,
  onOpenAddMedModal,
  onOpenAddAptModal,
  onOpenRefillModal,
  onOpenPasscodeModal
}) => {
  const {
    patient,
    medications,
    doseRecords,
    adherenceStats,
    careTeam,
    timeline,
    viewMode,
    markDoseTaken,
    markDoseMissed,
    markNextPendingDoseTaken
  } = useCare();

  const {
    todayDoses,
    todayTaken,
    todayMissed,
    todayPending,
    todayAdherence
  } = adherenceStats;

  const totalActiveMeds = medications.filter((m) => m.status === "active").length;
  const recentActivities = timeline.slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="dashboard-page">
      {/* Top Welcome & Patient Identity Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <div className="welcome-greeting-row">
            <span className="greeting-pill">
              <Activity size={14} className="text-turquoise" />
              <span>{formattedDate}</span>
            </span>
            {viewMode === "caregiver" ? (
              <span className="badge badge-ocean">
                <ShieldCheck size={13} /> Caregiver View Active
              </span>
            ) : (
              <span className="badge badge-turquoise">
                <UserCheck size={13} /> Patient View
              </span>
            )}
          </div>
          <h2 className="welcome-heading">
            {getGreeting()},{" "}
            {viewMode === "caregiver" ? "Sarah (Caregiver)" : patient.name}
          </h2>
          <p className="welcome-subtext">
            {viewMode === "caregiver"
              ? `You are overseeing ${patient.name}'s daily medication regimen and health schedule.`
              : "Here is your personalized daily medication schedule and health coordination overview."}
          </p>
        </div>

        {/* Patient Identity Overview Card (Section 5) */}
        <div className="patient-identity-card">
          <img
            src={patient.avatar}
            alt={patient.name}
            className="patient-card-avatar"
          />
          <div className="patient-card-info">
            <h3 className="patient-card-name">{patient.name}</h3>
            <div className="patient-chips-row">
              <span className="chip-item">Age: {patient.age}</span>
              <span className="chip-item">Blood: {patient.bloodGroup}</span>
              <span className="chip-item">Caregiver: {patient.primaryCaregiver}</span>
            </div>
            <p className="patient-notes-snippet" title={patient.healthcareNotes}>
              <strong>Care Notes:</strong> {patient.healthcareNotes}
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Refill Alert Banner (Micro-feature 3 & 4) */}
      <LowStockBanner onOpenRefillModal={onOpenRefillModal} />

      {/* Primary Statistic Cards Grid */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-card-icon-wrap icon-ocean">
            <Pill size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Active Medications</span>
            <div className="stat-card-val-row">
              <span className="stat-card-value">{totalActiveMeds}</span>
              <span className="stat-card-sub">prescriptions</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrap icon-turquoise">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Doses Taken Today</span>
            <div className="stat-card-val-row">
              <span className="stat-card-value">{todayTaken}</span>
              <span className="stat-card-sub">confirmed</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrap icon-pending">
            <Clock size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Pending Doses</span>
            <div className="stat-card-val-row">
              <span className="stat-card-value">{todayPending}</span>
              <span className="stat-card-sub">scheduled</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon-wrap icon-coral">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Missed Doses</span>
            <div className="stat-card-val-row">
              <span className="stat-card-value">{todayMissed}</span>
              <span className="stat-card-sub">today</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-highlight">
          <div className="stat-card-icon-wrap icon-lavender">
            <TrendingUp size={22} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Today's Adherence</span>
            <div className="stat-card-val-row">
              <span className="stat-card-value">{todayAdherence}%</span>
              <span className="stat-card-sub">adherence rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="dashboard-quick-actions-bar">
        <span className="quick-actions-label">Quick Actions:</span>
        <div className="quick-actions-buttons">
          {/* Micro-feature 1: Quick Dose Action */}
          <button
            onClick={markNextPendingDoseTaken}
            className="btn btn-primary"
            title="Mark the next scheduled dose as Taken"
          >
            <CheckCircle2 size={16} />
            <span>Mark Next Dose Taken</span>
          </button>

          <button
            onClick={onOpenAddMedModal}
            className="btn btn-secondary"
            title="Add a new medication to schedule"
          >
            <Plus size={16} />
            <span>Add Medication</span>
          </button>

          <button
            onClick={onOpenAddAptModal}
            className="btn btn-outline"
            title="Schedule a new doctor appointment"
          >
            <Calendar size={16} />
            <span>Add Appointment</span>
          </button>

          <button
            onClick={() => onNavigate("care-team")}
            className="btn btn-outline"
            title="Manage family and caregivers"
          >
            <Users size={16} />
            <span>View Care Team</span>
          </button>

          <button
            onClick={() => onNavigate("reports")}
            className="btn btn-outline"
            title="View printable healthcare summary report"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Multi-column Content Grid */}
      <div className="dashboard-main-grid">
        {/* Left / Center Column (Schedule & Adherence) */}
        <div className="dashboard-primary-col">
          {/* Today's Medication Schedule Card (Section 6) */}
          <div className="card today-schedule-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Pill size={19} className="text-turquoise" />
                  <span>Today's Medication Schedule</span>
                </h3>
                <p className="card-subtitle">
                  {todayDoses.length} scheduled doses for {formattedDate}
                </p>
              </div>
              <button
                onClick={() => onNavigate("medications")}
                className="btn-text-link"
              >
                <span>Full Medication List</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="today-doses-list">
              {todayDoses.length === 0 ? (
                <div className="empty-schedule-msg">
                  <p>No medication doses scheduled for today.</p>
                </div>
              ) : (
                todayDoses.map((dose) => (
                  <div
                    key={dose.id}
                    className={`dose-schedule-item dose-status-${dose.status}`}
                  >
                    <div className="dose-time-badge">
                      <Clock size={14} />
                      <span>{dose.scheduledTime}</span>
                    </div>

                    <div className="dose-info-col">
                      <h4 className="dose-med-title">{dose.medName}</h4>
                      <span className="dose-strength">{dose.dosage}</span>
                      {dose.takenAt && (
                        <span className="dose-taken-timestamp">
                          Confirmed taken at {dose.takenAt}
                        </span>
                      )}
                    </div>

                    <div className="dose-status-col">
                      {dose.status === "taken" && (
                        <span className="badge badge-turquoise">
                          <CheckCircle2 size={12} /> Taken
                        </span>
                      )}
                      {dose.status === "missed" && (
                        <span className="badge badge-coral">
                          <AlertTriangle size={12} /> Missed
                        </span>
                      )}
                      {dose.status === "pending" && (
                        <span className="badge badge-pending">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                    </div>

                    {/* Dose Actions: Prevent duplicate confirmation */}
                    <div className="dose-actions-col">
                      {dose.status === "pending" ? (
                        <>
                          <button
                            onClick={() => markDoseTaken(dose.id)}
                            className="btn btn-sm btn-primary"
                            title="Mark dose as Taken"
                          >
                            <CheckCircle2 size={14} />
                            <span>Taken</span>
                          </button>
                          <button
                            onClick={() => markDoseMissed(dose.id)}
                            className="btn btn-sm btn-soft-coral"
                            title="Mark dose as Missed"
                          >
                            <AlertTriangle size={14} />
                            <span>Missed</span>
                          </button>
                        </>
                      ) : (
                        <span className="dose-action-locked">
                          {dose.status === "taken" ? "Confirmed" : "Logged as Missed"}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Adherence Chart Component (Section 7) */}
          <WeeklyAdherenceChart />

          {/* Recent Activity Timeline Snapshot (Section 11) */}
          <div className="card recent-activity-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Activity size={19} className="text-turquoise" />
                  <span>Recent Care Activities</span>
                </h3>
                <p className="card-subtitle">Real-time coordinated updates</p>
              </div>
              <button
                onClick={() => onNavigate("timeline")}
                className="btn-text-link"
              >
                <span>View Full Timeline</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="timeline-mini-list">
              {recentActivities.map((act) => (
                <div key={act.id} className="timeline-mini-item">
                  <div className="timeline-dot-connector" />
                  <div className="timeline-mini-content">
                    <div className="timeline-mini-title-row">
                      <span className="timeline-mini-title">{act.title}</span>
                      <span className="timeline-mini-time">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="timeline-mini-desc">{act.description}</p>
                    <span className="timeline-mini-author">By {act.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Reminders, Appointments, Checklist, Emergency) */}
        <div className="dashboard-secondary-col">
          {/* Next Medication Reminder Card */}
          <NextReminderCard />

          {/* Next Upcoming Appointment Card (Micro-feature 5) */}
          <NextAppointmentCard onNavigateToAppointments={() => onNavigate("appointments")} />

          {/* Emergency Contact Quick Access Card (Micro-feature 6) */}
          <EmergencyCard />

          {/* Daily Care Checklist Card (Micro-feature 7) */}
          <DailyChecklistCard />

          {/* Care Team Overview Mini Widget */}
          <div className="card care-team-overview-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Users size={19} className="text-turquoise" />
                  <span>Care Team</span>
                </h3>
                <p className="card-subtitle">{careTeam.length} members connected</p>
              </div>
              <button
                onClick={() => onNavigate("care-team")}
                className="btn-text-link"
              >
                <span>Manage</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="care-team-avatars-row">
              {careTeam.map((member) => (
                <div
                  key={member.id}
                  className="team-mini-member"
                  title={`${member.name} (${member.role})`}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="team-mini-avatar"
                  />
                  <span className="team-mini-name">{member.name.split(" ")[0]}</span>
                  <span className="team-mini-role">{member.relation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
