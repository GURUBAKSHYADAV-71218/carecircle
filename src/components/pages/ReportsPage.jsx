import React from "react";
import {
  Printer,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Pill,
  User,
  PhoneCall,
  Clock
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const ReportsPage = () => {
  const {
    patient,
    medications,
    appointments,
    adherenceStats,
    checklist
  } = useCare();

  const {
    todayTaken,
    todayMissed,
    todayPending,
    todayAdherence,
    weeklyTaken,
    weeklyMissed,
    weeklyAdherence,
    weeklyChartData
  } = adherenceStats;

  const activeMeds = medications.filter((m) => m.status === "active");
  const upcomingApts = appointments.filter((a) => a.status === "upcoming");
  const completedApts = appointments.filter((a) => a.status === "completed");

  const handlePrint = () => {
    window.print();
  };

  const reportGeneratedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="reports-page">
      {/* Top Controls Bar (Hidden during Print) */}
      <div className="page-header-actions-bar no-print">
        <div>
          <h3 className="section-heading">
            <FileText size={20} className="text-ocean" />
            <span>Healthcare Reports & Clinical Adherence Summary</span>
          </h3>
          <p className="section-subtext">
            Official summary formatted for family conferences, doctor consultations, and paper records.
          </p>
        </div>

        {/* Micro-feature 10: Print Button */}
        <button
          onClick={handlePrint}
          className="btn btn-primary"
          title="Print official care report or save as PDF"
        >
          <Printer size={16} />
          <span>Print Healthcare Report</span>
        </button>
      </div>

      {/* Micro-feature 9: Weekly Care Summary KPI Banner */}
      <div className="card weekly-summary-kpi-banner no-print">
        <div className="summary-banner-header">
          <div className="banner-title-wrap">
            <TrendingUp size={22} className="text-turquoise" />
            <h3 className="banner-title">Weekly Healthcare Adherence Performance</h3>
          </div>
          <span className="badge badge-turquoise">7-Day Trajectory: {weeklyAdherence}%</span>
        </div>

        <div className="weekly-kpi-grid">
          <div className="kpi-box">
            <span className="kpi-val text-turquoise">{weeklyTaken}</span>
            <span className="kpi-label">Doses Taken this Week</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-val text-coral">{weeklyMissed}</span>
            <span className="kpi-label">Doses Missed this Week</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-val text-ocean">{weeklyAdherence}%</span>
            <span className="kpi-label">Overall Weekly Adherence</span>
          </div>
          <div className="kpi-box">
            <span className="kpi-val text-lavender">{completedApts.length}</span>
            <span className="kpi-label">Consultations Completed</span>
          </div>
        </div>
      </div>

      {/* Micro-feature 10: Official Printable Care Report Sheet */}
      <div className="card printable-care-sheet">
        {/* Printable Header */}
        <div className="printable-sheet-header">
          <div className="printable-brand">
            <h2 className="print-brand-title">CareCircle</h2>
            <span className="print-brand-tag">Collaborative Elderly Healthcare Management</span>
          </div>
          <div className="printable-doc-meta">
            <span className="doc-title-pill">OFFICIAL CARE SUMMARY</span>
            <span className="doc-date">Generated: {reportGeneratedDate}</span>
          </div>
        </div>

        {/* Patient Clinical Profile */}
        <div className="printable-section">
          <h4 className="print-section-heading">Patient Healthcare Profile</h4>
          <div className="print-patient-grid">
            <div>
              <strong>Full Name:</strong> {patient.name}
            </div>
            <div>
              <strong>Age / DOB:</strong> {patient.age} yrs ({patient.dob})
            </div>
            <div>
              <strong>Blood Group:</strong> {patient.bloodGroup}
            </div>
            <div>
              <strong>Primary Caregiver:</strong> {patient.primaryCaregiver} ({patient.emergencyContact.phone})
            </div>
            <div className="grid-full-width">
              <strong>Emergency Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relation}) — Phone: {patient.emergencyContact.phone}
            </div>
            <div className="grid-full-width">
              <strong>Clinical Healthcare Notes:</strong> {patient.healthcareNotes}
            </div>
          </div>
        </div>

        {/* Active Medications & Schedule Table */}
        <div className="printable-section">
          <h4 className="print-section-heading">Active Prescription & Supplement Regimen</h4>
          <table className="printable-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Daily Schedule</th>
                <th>Instructions</th>
                <th>Remaining Supply</th>
              </tr>
            </thead>
            <tbody>
              {activeMeds.map((med) => (
                <tr key={med.id}>
                  <td>
                    <strong>{med.name}</strong>
                  </td>
                  <td>{med.dosage}</td>
                  <td>{med.frequency}</td>
                  <td>{(med.scheduleTimes || []).join(", ")}</td>
                  <td>{med.foodInstructions || "As directed"}</td>
                  <td>{med.stockQuantity} pills</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adherence Summary Section */}
        <div className="printable-section">
          <h4 className="print-section-heading">Medication Adherence Performance</h4>
          <div className="print-adherence-grid">
            <div className="print-adherence-box">
              <span className="print-box-num">{todayAdherence}%</span>
              <span className="print-box-label">Today's Adherence Rate</span>
              <span className="print-box-sub">
                {todayTaken} Taken • {todayMissed} Missed • {todayPending} Pending
              </span>
            </div>
            <div className="print-adherence-box">
              <span className="print-box-num">{weeklyAdherence}%</span>
              <span className="print-box-label">7-Day Trailing Adherence</span>
              <span className="print-box-sub">
                {weeklyTaken} Total Taken • {weeklyMissed} Total Missed
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Appointments Section */}
        <div className="printable-section">
          <h4 className="print-section-heading">Upcoming Medical Consultations</h4>
          {upcomingApts.length === 0 ? (
            <p className="no-print-items">No upcoming appointments scheduled.</p>
          ) : (
            <table className="printable-table">
              <thead>
                <tr>
                  <th>Doctor & Specialty</th>
                  <th>Date & Time</th>
                  <th>Facility / Clinic</th>
                  <th>Location</th>
                  <th>Purpose / Notes</th>
                </tr>
              </thead>
              <tbody>
                {upcomingApts.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <strong>{apt.doctorName}</strong> ({apt.specialty})
                    </td>
                    <td>
                      {apt.date} at {apt.time}
                    </td>
                    <td>{apt.hospitalName}</td>
                    <td>{apt.location}</td>
                    <td>{apt.notes || "Routine follow-up"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Printable Footer */}
        <div className="printable-sheet-footer">
          <p>
            CareCircle System Record. For clinical inquiries or immediate medical emergencies, contact Primary Caregiver <strong>{patient.emergencyContact.name}</strong> at <strong>{patient.emergencyContact.phone}</strong> or call local emergency services (911).
          </p>
        </div>
      </div>
    </div>
  );
};
