// CareCircle Initial Demo Data Seed
// Complies with Master Product Specification

export const INITIAL_PATIENT = {
  id: "patient-1",
  name: "Margaret Wilson",
  age: 72,
  dob: "1954-03-14",
  gender: "Female",
  bloodGroup: "O+",
  phone: "+1 (555) 345-6789",
  email: "margaret.wilson@demo.carecircle.io",
  address: "742 Evergreen Terrace, Springfield",
  emergencyContact: {
    name: "Sarah Wilson",
    relation: "Daughter (Primary Caregiver)",
    phone: "+1 (555) 234-5678",
    email: "sarah.wilson@demo.carecircle.io"
  },
  primaryCaregiver: "Sarah Wilson",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
  healthcareNotes: "Mild hypertension controlled by medication. Mild osteoarthritis in right knee. Penicillin allergy. Needs low sodium diet and regular hydration.",
  physician: "Dr. Robert Chen (Geriatric Internal Medicine)"
};

export const INITIAL_CARE_TEAM = [
  {
    id: "member-1",
    name: "Margaret Wilson",
    role: "Patient",
    relation: "Self",
    email: "margaret.wilson@demo.carecircle.io",
    phone: "+1 (555) 345-6789",
    accessStatus: "Active",
    isPrimary: false,
    permissions: "View health schedule, mark taken, view appointments",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "member-2",
    name: "Sarah Wilson",
    role: "Primary Caregiver",
    relation: "Daughter",
    email: "sarah.wilson@demo.carecircle.io",
    phone: "+1 (555) 234-5678",
    accessStatus: "Active",
    isPrimary: true,
    permissions: "Full Access: Manage medications, schedule appointments, coordinate team",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "member-3",
    name: "David Wilson",
    role: "Family Member",
    relation: "Son",
    email: "david.w@demo.carecircle.io",
    phone: "+1 (555) 876-5432",
    accessStatus: "Active",
    isPrimary: false,
    permissions: "View schedule, receive alerts, view timeline",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
  },
  {
    id: "member-4",
    name: "Emily Carter, RN",
    role: "Secondary Caregiver",
    relation: "Home Health Nurse",
    email: "emily.carter@demo.carecircle.io",
    phone: "+1 (555) 432-1098",
    accessStatus: "Active",
    isPrimary: false,
    permissions: "Manage clinical notes, verify medication adherence, view vitals",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"
  }
];

export const INITIAL_MEDICATIONS = [
  {
    id: "med-1",
    name: "Vitamin D3",
    dosage: "1000 IU (1 capsule)",
    frequency: "Once daily",
    scheduleTimes: ["08:00"],
    foodInstructions: "With morning breakfast",
    startDate: "2026-01-10",
    endDate: "",
    status: "active", // active | paused
    stockQuantity: 28,
    lowStockThreshold: 7,
    refillNeeded: false,
    notes: "Supports bone density and calcium absorption."
  },
  {
    id: "med-2",
    name: "Blood Pressure Medication (Amlodipine)",
    dosage: "5 mg (1 tablet)",
    frequency: "Once daily",
    scheduleTimes: ["09:00"],
    foodInstructions: "After breakfast with full glass of water",
    startDate: "2025-11-01",
    endDate: "",
    status: "active",
    stockQuantity: 19,
    lowStockThreshold: 6,
    refillNeeded: false,
    notes: "Keep blood pressure below 130/80. Do not skip doses."
  },
  {
    id: "med-3",
    name: "Calcium Supplement",
    dosage: "500 mg (1 tablet)",
    frequency: "Twice daily",
    scheduleTimes: ["12:30", "19:30"],
    foodInstructions: "Take with meals for optimal absorption",
    startDate: "2026-02-15",
    endDate: "",
    status: "active",
    stockQuantity: 4, // Intentionally low to trigger Micro-feature 3 & 4
    lowStockThreshold: 7,
    refillNeeded: true,
    notes: "Separate by at least 2 hours from iron supplements if prescribed."
  },
  {
    id: "med-4",
    name: "Senior Multivitamin",
    dosage: "1 tablet",
    frequency: "Once daily",
    scheduleTimes: ["08:30"],
    foodInstructions: "With morning meal",
    startDate: "2026-01-01",
    endDate: "",
    status: "active",
    stockQuantity: 32,
    lowStockThreshold: 8,
    refillNeeded: false,
    notes: "Complete multivitamin with Zinc, B12, and Lutein."
  }
];

// Helper to get formatted dates relative to today
const getRelativeDateStr = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-1",
    doctorName: "Dr. Robert Chen",
    specialty: "Geriatric Internal Medicine",
    date: getRelativeDateStr(1), // Tomorrow
    time: "10:30",
    hospitalName: "St. Jude Senior Health Center",
    location: "450 Medical Arts Plaza, Suite 300, Springfield",
    notes: "Quarterly wellness checkup, blood pressure review, and routine bloodwork orders.",
    status: "upcoming" // upcoming | completed | cancelled
  },
  {
    id: "apt-2",
    doctorName: "Dr. Aris Thorne",
    specialty: "Cardiovascular Specialist",
    date: getRelativeDateStr(5), // in 5 days
    time: "14:15",
    hospitalName: "Metropolitan Heart Institute",
    location: "120 Heartway Boulevard, Wing B, Springfield",
    notes: "Routine 6-month echocardiogram follow-up and blood pressure management review.",
    status: "upcoming"
  },
  {
    id: "apt-3",
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Comprehensive Optometry",
    date: getRelativeDateStr(-14), // 2 weeks ago
    time: "11:00",
    hospitalName: "ClearView Vision Center",
    location: "88 Valley High St, Springfield",
    notes: "Annual diabetic and glaucoma eye screening. Vision stable, updated reading glasses prescribed.",
    status: "completed"
  }
];

export const INITIAL_DAILY_CHECKLIST = [
  { id: "check-1", task: "Review morning medication schedule", completed: true, time: "08:00 AM" },
  { id: "check-2", task: "Hydration check: 4 glasses of fresh water before noon", completed: true, time: "11:30 AM" },
  { id: "check-3", task: "Review appointment details for Dr. Robert Chen tomorrow", completed: true, time: "12:00 PM" },
  { id: "check-4", task: "Gentle 15-minute afternoon mobility walk or garden stroll", completed: false, time: "03:30 PM" },
  { id: "check-5", task: "Evening calcium dose with dinner", completed: false, time: "07:30 PM" },
  { id: "check-6", task: "Log resting blood pressure reading before bed", completed: false, time: "09:00 PM" }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Upcoming Doctor Appointment",
    description: "Reminder: Dr. Robert Chen consultation tomorrow at 10:30 AM at St. Jude Senior Health Center.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: "warning", // info | warning | urgent | success
    category: "appointment",
    read: false
  },
  {
    id: "notif-2",
    title: "Low Medication Stock: Calcium Supplement",
    description: "Only 4 tablets remaining (threshold is 7). Refill needed soon to prevent missed doses.",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    severity: "urgent",
    category: "medication",
    read: false
  },
  {
    id: "notif-3",
    title: "Morning Medications Taken",
    description: "Margaret marked Vitamin D3 and Amlodipine as Taken on schedule.",
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    severity: "success",
    category: "caregiver",
    read: true
  },
  {
    id: "notif-4",
    title: "Caregiver Check-in: Emily Carter, RN",
    description: "Emily reviewed Margaret's weekly adherence report and left positive notes.",
    timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    severity: "info",
    category: "caregiver",
    read: true
  }
];

export const INITIAL_TIMELINE = [
  {
    id: "time-1",
    title: "Morning Dose Taken: Amlodipine 5mg",
    description: "Recorded by Margaret Wilson on time with breakfast.",
    timestamp: new Date(Date.now() - 5.5 * 3600 * 1000).toISOString(),
    category: "medication",
    author: "Margaret Wilson"
  },
  {
    id: "time-2",
    title: "Morning Dose Taken: Vitamin D3",
    description: "Recorded by Margaret Wilson on time.",
    timestamp: new Date(Date.now() - 6.5 * 3600 * 1000).toISOString(),
    category: "medication",
    author: "Margaret Wilson"
  },
  {
    id: "time-3",
    title: "Checklist Item Completed",
    description: "Hydration check: 4 glasses of water before noon logged.",
    timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    category: "checklist",
    author: "Margaret Wilson"
  },
  {
    id: "time-4",
    title: "Low Stock Alert Generated",
    description: "Calcium Supplement remaining stock reached 4 units (below safety threshold 7).",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    category: "system",
    author: "System"
  },
  {
    id: "time-5",
    title: "Appointment Reminder Confirmed",
    description: "Appointment confirmed with Dr. Robert Chen for tomorrow at 10:30 AM.",
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    category: "appointment",
    author: "Sarah Wilson"
  }
];

export const INITIAL_SETTINGS = {
  demoPasscode: "2468",
  activeView: "patient", // patient | caregiver
  notificationPrefs: {
    medsUpcoming: true,
    medsMissed: true,
    appointments: true,
    careTeamUpdates: true,
    lowStockRefill: true
  },
  emailConfig: {
    provider: "SendGrid / SMTP (Simulated in Demo)",
    host: "smtp.carecircle.io",
    port: 587,
    senderEmail: "care-alerts@carecircle.io",
    activeDelivery: false // Set to true with valid API key
  }
};

// Generates initial dose records for the past 6 days + today
export const generateInitialDoseRecords = () => {
  const records = [];
  const todayStr = getRelativeDateStr(0);

  // Today's records
  records.push(
    { id: `dose-today-1`, medId: "med-1", medName: "Vitamin D3", dosage: "1000 IU", scheduledTime: "08:00", date: todayStr, status: "taken", takenAt: "08:05 AM" },
    { id: `dose-today-2`, medId: "med-4", medName: "Senior Multivitamin", dosage: "1 tablet", scheduledTime: "08:30", date: todayStr, status: "taken", takenAt: "08:32 AM" },
    { id: `dose-today-3`, medId: "med-2", medName: "Blood Pressure Medication (Amlodipine)", dosage: "5 mg", scheduledTime: "09:00", date: todayStr, status: "taken", takenAt: "09:04 AM" },
    { id: `dose-today-4`, medId: "med-3", medName: "Calcium Supplement", dosage: "500 mg", scheduledTime: "12:30", date: todayStr, status: "pending", takenAt: null },
    { id: `dose-today-5`, medId: "med-3", medName: "Calcium Supplement", dosage: "500 mg", scheduledTime: "19:30", date: todayStr, status: "pending", takenAt: null }
  );

  // Past 6 days records (realistic historical adherence)
  for (let i = 1; i <= 6; i++) {
    const pastDate = getRelativeDateStr(-i);
    // 5 scheduled doses per day
    records.push(
      { id: `dose-past-${i}-1`, medId: "med-1", medName: "Vitamin D3", dosage: "1000 IU", scheduledTime: "08:00", date: pastDate, status: "taken", takenAt: "08:10 AM" },
      { id: `dose-past-${i}-2`, medId: "med-4", medName: "Senior Multivitamin", dosage: "1 tablet", scheduledTime: "08:30", date: pastDate, status: "taken", takenAt: "08:35 AM" },
      { id: `dose-past-${i}-3`, medId: "med-2", medName: "Blood Pressure Medication (Amlodipine)", dosage: "5 mg", scheduledTime: "09:00", date: pastDate, status: "taken", takenAt: "09:05 AM" },
      // On day 3, one dose missed to demonstrate realistic adherence formula!
      { id: `dose-past-${i}-4`, medId: "med-3", medName: "Calcium Supplement", dosage: "500 mg", scheduledTime: "12:30", date: pastDate, status: i === 3 ? "missed" : "taken", takenAt: i === 3 ? null : "12:45 PM" },
      // On day 5, evening dose missed
      { id: `dose-past-${i}-5`, medId: "med-3", medName: "Calcium Supplement", dosage: "500 mg", scheduledTime: "19:30", date: pastDate, status: i === 5 ? "missed" : "taken", takenAt: i === 5 ? null : "19:40 PM" }
    );
  }

  return records;
};
