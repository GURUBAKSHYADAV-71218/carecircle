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
  Activity,
  UserPlus
} from "lucide-react";
import { useCare } from "../../context/CareContext";
import { EmergencyCard } from "../widgets/EmergencyCard";
import { DailyChecklistCard } from "../widgets/DailyChecklistCard";
import { WeeklyAdherenceChart } from "../widgets/WeeklyAdherenceChart";
import { NextReminderCard } from "../widgets/NextReminderCard";
import { NextAppointmentCard } from "../widgets/NextAppointmentCard";
import { LowStockBanner } from "../widgets/LowStockBanner";
import { InitialsAvatar } from "../common/InitialsAvatar";

export const DashboardPage = ({
  onNavigate,
  onOpenAddMedModal,
  onOpenAddAptModal,
  onOpenRefillModal,
  onOpenPasscodeModal,
  onOpenSetupProfile
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
  const isNewUser = !patient.name || patient.name.trim() === "";

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

      {/* First-time user welcome banner */}
      {isNewUser && (
        <div className="card" style={{
          background: "linear-gradient(135deg, var(--deep-ocean), var(--ocean-blue))",
          color: "#fff",
          marginBottom: "24px",
          borderRadius: "16px",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          flexWrap: "wrap"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Heart size={20} style={{ color: "var(--aqua)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--aqua)" }}>
                Welcome to CareCircle
              </span>
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
              Set up your patient profile to get started
            </h2>
            <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", maxWidth: "520px", lineHeight: 1.5 }}>
              CareCircle helps you manage daily medications, schedule appointments, and coordinate with family and caregivers.
              Begin by adding the patient's profile information.
            </p>
          </div>
          <button
            onClick={onOpenSetupProfile}
            className="btn btn-primary"
            style={{ background: "var(--turquoise)", flexShrink: 0, padding: "12px 24px", fontSize: "0.95rem" }}
          >
            <UserPlus size={18} />
            <span>Set Up Patient Profile</span>
          </button>
        </div>
      )}

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
            {viewMode === "caregiver"
              ? "Care Team"
              : patient.name || "Welcome"}
          </h2>
          <p className="welcome-subtext">
            {viewMode === "caregiver"
              ? patient.name
                ? `You are overseeing ${patient.name}'s daily medication regimen and health schedule.`
                : "You are overseeing this patient's daily medication regimen and health schedule."
              : isNewUser
              ? "Complete the patient profile to start tracking medications and appointments."
              : "Here is your personalized daily medication schedule and health coordination overview."}
          </p>
        </div>

        {/* Patient Identity Overview Card */}
        <div className="patient-identity-card">
          {isNewUser ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <button onClick={onOpenSetupProfile} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "var(--muted-blue-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px dashed var(--ocean-blue)", margin: "0 auto 10px"
                }}>
                  <UserPlus size={24} style={{ color: "var(--ocean-blue)" }} />
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--ocean-blue)", fontWeight: 600 }}>Add Patient Profile</p>
              </button>
            </div>
          ) : (
            <>
              <InitialsAvatar
                name={patient.name}
                avatar={patient.avatar}
                size={64}
                className="patient-card-avatar"
              />
              <div className="patient-card-info">
                <h3 className="patient-card-name">{patient.name}</h3>
                <div className="patient-chips-row">
                  {patient.age && <span className="chip-item">Age: {patient.age}</span>}
                  {patient.bloodGroup && <span className="chip-item">Blood: {patient.bloodGroup}</span>}
                  {patient.primaryCaregiver && <span className="chip-item">Caregiver: {patient.primaryCaregiver}</span>}
                </div>
                {patient.healthcareNotes && (
                  <p className="patient-notes-snippet" title={patient.healthcareNotes}>
                    <strong>Care Notes:</strong> {patient.healthcareNotes}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Low Stock Refill Alert Banner */}
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
              <span className="stat-card-sub">
                {totalActiveMeds === 0 ? "none added yet" : "prescriptions"}
              </span>
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
              <span className="stat-card-value">{totalActiveMeds === 0 ? "—" : `${todayAdherence}%`}</span>
              <span className="stat-card-sub">{totalActiveMeds === 0 ? "no data yet" : "adherence rate"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="dashboard-quick-actions-bar">
        <span className="quick-actions-label">Quick Actions:</span>
        <div className="quick-actions-buttons">
          {/* Quick Dose Action */}
          <button
            onClick={markNextPendingDoseTaken}
            className="btn btn-primary"
            title="Mark the next scheduled dose as Taken"
            disabled={todayPending === 0}
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
          {/* Today's Medication Schedule Card */}
          <div className="card today-schedule-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Pill size={19} className="text-turquoise" />
                  <span>Today's Medication Schedule</span>
                </h3>
                <p className="card-subtitle">
                  {todayDoses.length > 0
                    ? `${todayDoses.length} scheduled doses for ${formattedDate}`
                    : formattedDate}
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
                <div className="empty-state-inline">
                  <Pill size={36} style={{ color: "var(--aqua)", marginBottom: "10px" }} />
                  <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                    No medications scheduled today
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                    Add your first medication to begin tracking your daily schedule.
                  </p>
                  <button onClick={onOpenAddMedModal} className="btn btn-primary btn-sm">
                    <Plus size={14} /> Add Medication
                  </button>
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

                    {/* Dose Actions */}
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

          {/* Adherence Chart Component */}
          <WeeklyAdherenceChart />

          {/* Recent Activity Timeline Snapshot */}
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
              {recentActivities.length === 0 ? (
                <div className="empty-state-inline" style={{ padding: "20px 0" }}>
                  <Activity size={30} style={{ color: "var(--aqua)", marginBottom: "8px" }} />
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    No care activities recorded yet. Actions like marking doses or scheduling appointments will appear here.
                  </p>
                </div>
              ) : (
                recentActivities.map((act) => (
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Reminders, Appointments, Checklist, Emergency) */}
        <div className="dashboard-secondary-col">
          {/* Next Medication Reminder Card */}
          <NextReminderCard />

          {/* Next Upcoming Appointment Card */}
          <NextAppointmentCard onNavigateToAppointments={() => onNavigate("appointments")} />

          {/* Emergency Contact Quick Access Card */}
          <EmergencyCard />

          {/* Daily Care Checklist Card */}
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
              {careTeam.length === 0 ? (
                <div style={{ padding: "12px 0", textAlign: "center", width: "100%" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                    No care team members added yet.
                  </p>
                  <button onClick={() => onNavigate("care-team")} className="btn btn-outline btn-sm">
                    <Plus size={13} /> Add Members
                  </button>
                </div>
              ) : (
                careTeam.map((member) => (
                  <div
                    key={member.id}
                    className="team-mini-member"
                    title={`${member.name} (${member.role})`}
                  >
                    <InitialsAvatar
                      name={member.name}
                      avatar={member.avatar}
                      size={40}
                      className="team-mini-avatar"
                    />
                    <span className="team-mini-name">{member.name.split(" ")[0]}</span>
                    <span className="team-mini-role">{member.relation}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
