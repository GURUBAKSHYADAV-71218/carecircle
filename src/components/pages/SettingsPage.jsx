import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  RotateCcw,
  Save,
  Lock,
  Phone,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useCare } from "../../context/CareContext";

export const SettingsPage = ({ onOpenResetConfirm }) => {
  const {
    patient,
    updatePatient,
    settings,
    updateSettings,
    showToast
  } = useCare();

  // Patient Profile state
  const [profileForm, setProfileForm] = useState({
    name: patient.name || "",
    age: patient.age || 72,
    dob: patient.dob || "",
    bloodGroup: patient.bloodGroup || "O+",
    phone: patient.phone || "",
    email: patient.email || "",
    address: patient.address || "",
    primaryCaregiver: patient.primaryCaregiver || "",
    healthcareNotes: patient.healthcareNotes || "",
    physician: patient.physician || ""
  });

  // Emergency contact state
  const [emergencyForm, setEmergencyForm] = useState({
    name: patient.emergencyContact?.name || "",
    relation: patient.emergencyContact?.relation || "",
    phone: patient.emergencyContact?.phone || "",
    email: patient.emergencyContact?.email || ""
  });

  // Passcode state
  const [passcode, setPasscode] = useState(settings.demoPasscode || "2468");

  // Notification Preferences state (Micro-feature 8)
  const [notifPrefs, setNotifPrefs] = useState({
    medsUpcoming: settings.notificationPrefs?.medsUpcoming ?? true,
    medsMissed: settings.notificationPrefs?.medsMissed ?? true,
    appointments: settings.notificationPrefs?.appointments ?? true,
    careTeamUpdates: settings.notificationPrefs?.careTeamUpdates ?? true,
    lowStockRefill: settings.notificationPrefs?.lowStockRefill ?? true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updatePatient({
      ...patient,
      ...profileForm,
      age: parseInt(profileForm.age, 10) || patient.age,
      emergencyContact: emergencyForm
    });
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!passcode || passcode.length < 4) {
      showToast("Passcode must be at least 4 digits", "warning");
      return;
    }
    updateSettings({
      demoPasscode: passcode
    });
  };

  const handleTogglePref = (key) => {
    const updated = {
      ...notifPrefs,
      [key]: !notifPrefs[key]
    };
    setNotifPrefs(updated);
    updateSettings({
      notificationPrefs: updated
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        {/* Left Column: Patient Profile & Emergency Contact */}
        <div className="settings-col">
          {/* Card: Patient Healthcare Profile */}
          <div className="card settings-card">
            <div className="card-header">
              <div className="card-title">
                <User size={19} className="text-turquoise" />
                <span>Patient Healthcare Profile</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Patient Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dob}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="form-control"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attending Physician</label>
                <input
                  type="text"
                  value={profileForm.physician}
                  onChange={(e) => setProfileForm({ ...profileForm, physician: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Important Healthcare Notes & Allergies</label>
                <textarea
                  rows={3}
                  value={profileForm.healthcareNotes}
                  onChange={(e) => setProfileForm({ ...profileForm, healthcareNotes: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Sub-section: Emergency Contact */}
              <div className="settings-sub-section">
                <h4 className="sub-section-title">Emergency Contact Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      value={emergencyForm.name}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relationship</label>
                    <input
                      type="text"
                      value={emergencyForm.relation}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, relation: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Emergency Phone (Direct Dial)</label>
                    <input
                      type="text"
                      value={emergencyForm.phone}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Email</label>
                    <input
                      type="email"
                      value={emergencyForm.email}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, email: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions-right">
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> Save Patient Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security, Notification Prefs, Demo Data Reset */}
        <div className="settings-col">
          {/* Card: Caregiver Demo Passcode */}
          <div className="card settings-card">
            <div className="card-header">
              <div className="card-title">
                <Lock size={19} className="text-turquoise" />
                <span>Caregiver Access Passcode</span>
              </div>
            </div>

            <form onSubmit={handleSaveSecurity}>
              <p className="settings-desc">
                Set the passcode required to access the Caregiver View on this device.
              </p>
              <div className="form-group">
                <label className="form-label">Demo Passcode</label>
                <input
                  type="text"
                  maxLength={8}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-actions-right">
                <button type="submit" className="btn btn-secondary">
                  Update Passcode
                </button>
              </div>
            </form>
          </div>

          {/* Micro-feature 8: Notification Preferences */}
          <div className="card settings-card">
            <div className="card-header">
              <div className="card-title">
                <Bell size={19} className="text-turquoise" />
                <span>Notification Preferences</span>
              </div>
            </div>

            <p className="settings-desc">
              Toggle proactive in-app alert categories for this workstation.
            </p>

            <div className="prefs-toggle-list">
              <label className="pref-toggle-row">
                <div className="pref-label-group">
                  <span className="pref-title">Upcoming Medication Reminders</span>
                  <span className="pref-sub">Alert before scheduled dose times</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.medsUpcoming}
                  onChange={() => handleTogglePref("medsUpcoming")}
                  className="pref-checkbox"
                />
              </label>

              <label className="pref-toggle-row">
                <div className="pref-label-group">
                  <span className="pref-title">Missed Dose Alerts</span>
                  <span className="pref-sub">Urgent alerts when a dose is missed</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.medsMissed}
                  onChange={() => handleTogglePref("medsMissed")}
                  className="pref-checkbox"
                />
              </label>

              <label className="pref-toggle-row">
                <div className="pref-label-group">
                  <span className="pref-title">Doctor Appointment Reminders</span>
                  <span className="pref-sub">Reminders for consultations approaching in 24-48 hrs</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.appointments}
                  onChange={() => handleTogglePref("appointments")}
                  className="pref-checkbox"
                />
              </label>

              <label className="pref-toggle-row">
                <div className="pref-label-group">
                  <span className="pref-title">Care Team & Family Updates</span>
                  <span className="pref-sub">Notifies when team members record notes or actions</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.careTeamUpdates}
                  onChange={() => handleTogglePref("careTeamUpdates")}
                  className="pref-checkbox"
                />
              </label>

              <label className="pref-toggle-row">
                <div className="pref-label-group">
                  <span className="pref-title">Low Stock & Refill Alerts</span>
                  <span className="pref-sub">Alert when pills reach safety threshold</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifPrefs.lowStockRefill}
                  onChange={() => handleTogglePref("lowStockRefill")}
                  className="pref-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Card: Reset Demo Data */}
          <div className="card settings-card card-danger-zone">
            <div className="card-header">
              <div className="card-title text-coral">
                <RotateCcw size={19} />
                <span>Reset Demonstration Data</span>
              </div>
            </div>

            <p className="settings-desc">
              Restores initial fictional demo data for Margaret Wilson, medications, doses, and appointments.
            </p>

            <button
              onClick={onOpenResetConfirm}
              className="btn btn-soft-coral"
              title="Reset all LocalStorage data to initial seed"
            >
              <RotateCcw size={15} />
              <span>Reset All Demo Data</span>
            </button>
          </div>

          {/* Application Information Card */}
          <div className="card settings-card app-info-card">
            <div className="app-info-brand">
              <span className="app-info-name">CareCircle</span>
              <span className="badge badge-ocean">v1.0.0 Stable</span>
            </div>
            <p className="app-info-desc">
              Collaborative Elderly Healthcare Management Platform. Built for high reliability, offline persistence via LocalStorage, and full caregiver accessibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
