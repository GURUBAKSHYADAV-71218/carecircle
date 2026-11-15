# CareCircle — Collaborative Elderly Healthcare & Medication Management Platform

> **Tagline:** Care that connects. Every day.  
> **Category:** Collaborative Elderly Healthcare Management SaaS  
> **Evaluation Mode:** Fully persistent, standalone client-side demo with zero paid API dependencies.

---

## 1. Project Introduction

**CareCircle** is an intelligent, human-centered elderly healthcare and medication coordination platform. Built specifically to empower older adults to age in place safely with dignity, CareCircle creates one unified, compassionate ecosystem where an elderly individual, their family members, and authorized caregivers seamlessly track daily medications, monitor adherence metrics, schedule medical appointments, and proactively respond to health needs in real time.

The elderly individual (**Margaret Wilson**, age 72) remains at the absolute core of the application, supported by her daughter and designated primary caregiver (**Sarah Wilson**) and extended care team.

---

## 2. Problem Statement

Elderly healthcare management is fraught with dangerous coordination gaps:

1. **Polypharmacy Risk & Cognitive Load:** Older adults often manage multiple prescription schedules across differing times, food requirements, and dosages. Skipping or accidentally duplicating doses is one of the leading causes of preventable elderly hospitalizations.
2. **Caregiver Anxiety & Information Asymmetry:** Family members frequently worry whether a parent took their morning or evening medications on time, leading to repetitive phone calls or undetected missed doses.
3. **Fragmented Healthcare Tracking:** Doctor appointments, refill needs, daily hydration, and vital signs are scattered across paper calendars, medication boxes, and text message threads.
4. **Impersonal & Complex Interfaces:** Typical healthcare software is cluttered with stark white clinical grids, tiny fonts, or intrusive enterprise barriers that alienate elderly users and fatigue caregivers.

---

## 3. Our Solution

CareCircle bridges these challenges through an elegant, dignified SaaS experience:

- **Patient-Centric Interface:** High contrast, legible typography (`Plus Jakarta Sans`), soothing sea-foam and ocean tones (`#102E40`, `#176B87`, `#20B8AA`, `#E9F5F4`), and large touch-friendly action cards.
- **Bi-Directional Role Views:** Easily toggles between **Patient Mode** (simple daily checklist, next dose reminder, single-tap confirmation) and **Caregiver Mode** (full clinical editing, adherence trends, prescription management, emergency controls).
- **Live State & Formula-Based Adherence:** Recalculates adherence on every single dose action:
  $$\text{Adherence Rate} = \frac{\text{Taken Doses}}{\text{Taken Doses} + \text{Missed Doses}} \times 100$$
  Pending doses remain uncounted in adherence calculations until evaluated.
- **Proactive Early Alert Workflow:** Automatically logs timeline events, sends toast notifications, triggers low-stock alerts, and renders email previews for family caregivers when doses are missed.
- **100% Offline & Persistent:** Retains all user edits, additions, and status changes across browser reloads using LocalStorage.

---

## 4. Core Features

### Core Feature A — Patient Healthcare Profile
- Comprehensive profile for **Margaret Wilson** (Age 72, Blood Group O+).
- Displays emergency contact, primary caregiver, attending physician, and critical healthcare notes (e.g. Mild Hypertension, Osteoarthritis, Penicillin allergy).
- Fully editable with changes saved persistently to LocalStorage.
- Patient Overview Card integrated into the dashboard.

### Core Feature B — Medication Management
- Structured prescription cards with medication name, strength, frequency, scheduled daily times, food instructions, start/end dates, and status.
- Modal forms for adding, editing, and deleting medications (with confirmation).
- Temporary pause and resume capabilities.
- Live **Daily Dose Tracker** allowing doses to be marked as **Taken** or **Missed** with instant dashboard synchronization and duplicate prevention.

### Core Feature C — Medication Adherence Tracking
- Formula-driven adherence metrics: Today's adherence, 7-day average, doses taken, doses missed, and doses pending.
- Dynamic **Weekly Adherence Trend Chart** generated directly from stored historical records (not static percentages).

### Core Feature D — Doctor Appointment Management
- Comprehensive schedule for consultations (e.g., Dr. Robert Chen - Geriatric Internal Medicine, Dr. Aris Thorne - Cardiology).
- Dual view toggle: **Structured List View** and interactive **Monthly Calendar Grid**.
- Add, edit, delete, and mark appointments as completed.
- Dynamic days countdown integration ("Today", "Tomorrow", "In 5 days").

### Core Feature E — Shared Family & Caregiver Access
- Dedicated Care Team hub displaying the patient, primary caregiver, family members, and home health nurse.
- Role assignments, contact numbers, email addresses, and permission summaries.
- Passcode-authenticated **Caregiver View** mode with instant switching back to Patient view.

### Core Feature F — Proactive Notifications & Email Engine
- In-app notification center categorizing alerts by Medication, Appointment, and Caregiver Activity with severity badges (Urgent, Notice, Success, Info).
- Filter by category, mark individual or all as read, and dismiss alerts.
- Dedicated **Email Notification Preview Adapter** generating realistic HTML alerts for missed doses and appointment reminders with clear instructions for SMTP/SendGrid delivery.

### Core Feature G — Shared Care Activity Timeline
- Real-time chronological audit trail of all care activities: medication confirmations, missed doses, appointments created/completed, stock replenishments, and checklist tasks.
- Displays timestamp, event title, category, and author. Filterable by category.

---

## 5. Ten Additional Micro-Features

| # | Micro-Feature | Description & Value |
|---|---|---|
| **1** | **Quick Dose Action** | One-click button on the dashboard to immediately confirm the very next pending medication dose without navigating into sub-pages. |
| **2** | **Instant Medication Search** | Real-time live search by medicine name, dosage, or instructions with instant filtering on the medications page and header. |
| **3** | **Low Stock Indicator** | Real-time pill counter on each medication with a configurable safety threshold and visual warning badge when supply runs low. |
| **4** | **Refill Needed & Replenish Checklist** | Automatic "Refill Needed" flag with quick-add modal presets (+15, +30, +90 pills) that reset alert statuses upon replenishment. |
| **5** | **Appointment Countdown** | Dynamic live countdown on the dashboard calculating the exact days remaining until the next upcoming consultation. |
| **6** | **Emergency Contact Direct Dial** | Prominent priority contact card with a native `tel:` link for instant 1-tap phone dialing on mobile/supported devices. |
| **7** | **Daily Care Checklist** | Daily routine tracker for non-pharmacological care (hydration, afternoon walk, blood pressure checks) with progress bar and single-click day reset. |
| **8** | **Notification Preferences** | Granular settings toggles allowing users to enable or disable in-app alerts for medications, missed doses, appointments, and refills. |
| **9** | **Weekly Care Summary KPI** | Executive summary card showing 7-day adherence percentage, doses taken, doses missed, and completed doctor visits. |
| **10** | **Printable Care Report** | Print-optimized clinical sheet with `@media print` styling that hides navigation and renders a clean medical record ready for physical doctor visits. |

---

## 6. Technology Stack

- **Frontend Core:** React 18 (Hooks, Context API, stateful modular architecture)
- **Tooling & Build:** Vite 5 (Ultra-fast HMR and optimized production bundling)
- **Styling:** Custom CSS3 with official design system tokens, CSS variables, glassmorphism surfaces, and print stylesheets
- **Icons:** Lucide React (`lucide-react`)
- **Persistence:** LocalStorage API with JSON validation, fallback handling, and demonstration seeder
- **Zero Heavy Dependencies:** No external chart libraries, no heavy router bloat, no paid APIs required

---

## 7. Application Structure

```
carecircle/
├── index.html                      # HTML5 entry with Plus Jakarta Sans & CareCircle favicon
├── package.json                    # Project metadata & scripts (dev, build, preview)
├── vite.config.js                  # Vite configuration
├── .gitignore                      # Clean Git ignore rules (node_modules, dist, logs)
├── README.md                       # Master product documentation
└── src/
    ├── main.jsx                    # React DOM root entry
    ├── App.jsx                     # Master container, page router & modal registry
    ├── index.css                   # CareCircle strict design system & responsive styling
    ├── context/
    │   └── CareContext.jsx         # Centralized reactive state, adherence logic & handlers
    ├── services/
    │   ├── storage.js              # Fault-tolerant LocalStorage service
    │   └── emailService.js         # Email template compiler & delivery adapter
    ├── data/
    │   └── initialData.js          # Realistic demo dataset for Margaret Wilson & family
    └── components/
        ├── layout/
        │   ├── Sidebar.jsx         # Desktop navigation, patient card & role toggler
        │   ├── Header.jsx          # Top search bar, emergency call, alerts dropdown
        │   ├── MobileNav.jsx       # Responsive bottom navigation bar
        │   └── Toast.jsx           # Animated toast notification container
        ├── widgets/
        │   ├── EmergencyCard.jsx       # Micro-feature 6: Emergency contact dialer
        │   ├── DailyChecklistCard.jsx  # Micro-feature 7: Daily care task tracker
        │   ├── WeeklyAdherenceChart.jsx# Section 7: 7-day visual adherence chart
        │   ├── NextReminderCard.jsx    # Micro-feature 1: Next pending dose quick action
        │   ├── NextAppointmentCard.jsx # Micro-feature 5: Consultation countdown
        │   └── LowStockBanner.jsx      # Micro-feature 3 & 4: Refill alert banner
        ├── modals/
        │   ├── AddMedicationModal.jsx      # Prescription creator form
        │   ├── EditMedicationModal.jsx     # Prescription editor form
        │   ├── AddAppointmentModal.jsx     # Consultation scheduler form
        │   ├── EditAppointmentModal.jsx    # Consultation editor form
        │   ├── AddCareTeamModal.jsx        # Care team member form
        │   ├── EditCareTeamModal.jsx       # Care team member editor
        │   ├── CaregiverPasscodeModal.jsx  # Demo passcode access dialog (2468)
        │   ├── RefillModal.jsx             # Stock replenishment dialog
        │   ├── EmailPreviewModal.jsx       # Section 10: Generated email inspector
        │   └── ConfirmModal.jsx            # Reusable confirmation dialog
        └── pages/
            ├── DashboardPage.jsx       # Executive multi-column care dashboard
            ├── MedicationsPage.jsx     # Medication inventory & live dose tracker
            ├── AppointmentsPage.jsx    # List & monthly calendar consultation manager
            ├── CareTeamPage.jsx        # Family & caregiver coordination circle
            ├── NotificationsPage.jsx   # Filterable notification center
            ├── TimelinePage.jsx        # Chronological audit trail
            ├── ReportsPage.jsx         # Micro-feature 9 & 10: Summary & print report
            └── SettingsPage.jsx        # Profile, emergency contact & passcode settings
```

---

## 8. Installation Instructions

1. Clone or open the repository root:
   ```bash
   cd carecircle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 9. Run Instructions

### Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Verify that the production build completes cleanly.

### Preview Production Build
```bash
npm run preview
```

---

## 10. Demonstration Passcode

To unlock the **Caregiver View** during evaluation:

- **Default Demo Passcode:** `2468`
- **Caregiver Profile:** Sarah Wilson (Daughter & Primary Caregiver)
- **Switching Back:** Click the "Switch to Patient Mode" button in the sidebar or top header at any time.
- **Passcode Configuration:** The passcode can be modified inside the **Settings** page.

*Security Notice:* This is a client-side frontend demonstration of role-based coordination designed for hackathon review.

---

## 11. Screenshots & Interface Overview

1. **Care Dashboard:** Personalized welcome banner, patient identity card, adherence KPIs, today's schedule tracker, next dose quick action, and emergency calling.
2. **Medications & Live Dose Tracker:** Individual prescription cards with remaining stock counters, pause/resume toggles, and live Taken/Missed action triggers.
3. **Monthly Appointments Calendar:** Full month view with interactive day slots and upcoming consultation chips.
4. **Printable Care Report (`@media print`):** Formatted medical document with navigation hidden, ready for printing or saving as PDF via browser print (`Ctrl + P`).
5. **Caregiver Email Preview:** High-fidelity HTML notification layout simulating outbound caregiver alerts.

---

## 12. Limitations

- **Client-Side Persistence:** Application data is stored locally in the browser's `localStorage`. Clearing browser site data will reset the application to the initial seed state.
- **Email Delivery:** In demo mode, email dispatches are generated as rich HTML previews inside the application rather than invoking live external SMTP relays.
- **Local Device Authentication:** Passcode validation runs in the browser context for demonstration purposes and does not replace server-side OAuth2 or HIPAA-compliant authentication in production.

---

## 13. Future Improvements

1. **Biometric WebAuthn:** Integrate WebAuthn (Touch ID / Face ID / Windows Hello) for passwordless elderly login.
2. **Smart Pill Dispenser IoT Integration:** Connect to smart Bluetooth medication dispensers (e.g., via Web Bluetooth API) for automatic dose verification.
3. **FHIR & HL7 Electronic Health Record (EHR) Export:** Implement standard healthcare interoperability exports for direct syncing with hospital portals.
4. **Voice Assistance:** Integrate Web Speech API for voice-guided reminders and hands-free dose confirmation for seniors with impaired vision.
5. **Multi-Language Accessibility:** Add localized translations with extra-large display modes for elderly individuals with cognitive or visual impairments.

---

**CareCircle** — *Care that connects. Every day.*
