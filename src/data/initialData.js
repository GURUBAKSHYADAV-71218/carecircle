// CareCircle Initial Data Defaults
// Clean, empty-state defaults for first-time users.
// No fictional patient data is included.

export const EMPTY_PATIENT = {
  id: null,
  name: "",
  age: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  email: "",
  address: "",
  emergencyContact: {
    name: "",
    relation: "",
    phone: "",
    email: ""
  },
  primaryCaregiver: "",
  avatar: null,
  healthcareNotes: "",
  physician: ""
};

export const INITIAL_CARE_TEAM = [];
export const INITIAL_MEDICATIONS = [];
export const INITIAL_APPOINTMENTS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_TIMELINE = [];

export const INITIAL_DAILY_CHECKLIST = [
  { id: "check-default-1", task: "Review morning medication schedule", completed: false, time: "08:00 AM" },
  { id: "check-default-2", task: "Drink 8 glasses of water throughout the day", completed: false, time: "Throughout" },
  { id: "check-default-3", task: "Review upcoming appointments", completed: false, time: "12:00 PM" },
  { id: "check-default-4", task: "Afternoon exercise or gentle walk", completed: false, time: "03:30 PM" },
  { id: "check-default-5", task: "Review evening medication schedule", completed: false, time: "07:30 PM" },
  { id: "check-default-6", task: "Log any health observations before bed", completed: false, time: "09:00 PM" }
];

export const INITIAL_SETTINGS = {
  demoPasscode: "2468",
  activeView: "patient",
  notificationPrefs: {
    medsUpcoming: true,
    medsMissed: true,
    appointments: true,
    careTeamUpdates: true,
    lowStockRefill: true
  },
  emailConfig: {
    provider: "SendGrid / SMTP (Simulated — Preview Only)",
    host: "smtp.carecircle.io",
    port: 587,
    senderEmail: "care-alerts@carecircle.io",
    activeDelivery: false
  }
};

// Returns empty dose records — no historical fictional data
export const generateInitialDoseRecords = () => [];

// Known demo record IDs from previous fictional seed — used for safe migration
export const DEMO_DATA_IDS = {
  patient: ["patient-1"],
  patientNames: ["Margaret Wilson"],
  careTeam: ["member-1", "member-2", "member-3", "member-4"],
  medications: ["med-1", "med-2", "med-3", "med-4"],
  appointments: ["apt-1", "apt-2", "apt-3"],
  checklist: ["check-1", "check-2", "check-3", "check-4", "check-5", "check-6"],
  notifications: ["notif-1", "notif-2", "notif-3", "notif-4"],
  timeline: ["time-1", "time-2", "time-3", "time-4", "time-5"],
  // Dose records with these prefix patterns are demo records
  dosePrefixes: ["dose-today-", "dose-past-"]
};
