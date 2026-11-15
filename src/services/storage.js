// CareCircle LocalStorage Service
// Provides robust, fault-tolerant persistence with JSON validation and safety fallbacks.

import {
  EMPTY_PATIENT,
  INITIAL_CARE_TEAM,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_DAILY_CHECKLIST,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE,
  INITIAL_SETTINGS,
  generateInitialDoseRecords,
  DEMO_DATA_IDS
} from "../data/initialData.js";

const STORAGE_KEYS = {
  PATIENT: "carecircle_patient",
  CARE_TEAM: "carecircle_care_team",
  MEDICATIONS: "carecircle_medications",
  DOSE_RECORDS: "carecircle_dose_records",
  APPOINTMENTS: "carecircle_appointments",
  CHECKLIST: "carecircle_daily_checklist",
  NOTIFICATIONS: "carecircle_notifications",
  TIMELINE: "carecircle_timeline",
  SETTINGS: "carecircle_settings",
  // Version key — replaces old "carecircle_initialized_v1"
  APP_VERSION: "carecircle_app_version",
  // Legacy key from old demo seed
  INITIALIZED_LEGACY: "carecircle_initialized_v1"
};

const CURRENT_VERSION = "2";

/**
 * Safely parse JSON from localStorage with fallback
 */
const safeGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[CareCircle Storage] Error parsing key ${key}:`, err);
    return fallback;
  }
};

/**
 * Safely serialize and save JSON to localStorage
 */
const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[CareCircle Storage] Error saving key ${key}:`, err);
    return false;
  }
};

/**
 * Check whether a dose record ID looks like a demo-seeded record
 */
const isDemoDoseId = (id) => {
  return DEMO_DATA_IDS.dosePrefixes.some((prefix) => id.startsWith(prefix));
};

/**
 * Migrate existing installations that have the old demo data seeded.
 * Safely removes only known demo records; genuine user-added records are preserved.
 * This runs once per installation and sets version = "2".
 */
export const migrateFromDemoData = () => {
  const appVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION);
  const wasLegacyInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED_LEGACY);

  // If already on version 2+, nothing to do
  if (appVersion === CURRENT_VERSION) return;

  // Only run migration if old installation exists
  if (wasLegacyInitialized === "true") {
    console.info("[CareCircle] Migrating from demo data to clean state...");

    // --- Patient ---
    const storedPatient = safeGet(STORAGE_KEYS.PATIENT, null);
    if (
      storedPatient &&
      (DEMO_DATA_IDS.patient.includes(storedPatient.id) ||
        DEMO_DATA_IDS.patientNames.includes(storedPatient.name))
    ) {
      safeSet(STORAGE_KEYS.PATIENT, EMPTY_PATIENT);
    }

    // --- Care Team ---
    const storedTeam = safeGet(STORAGE_KEYS.CARE_TEAM, []);
    const cleanTeam = storedTeam.filter((m) => !DEMO_DATA_IDS.careTeam.includes(m.id));
    safeSet(STORAGE_KEYS.CARE_TEAM, cleanTeam);

    // --- Medications ---
    const storedMeds = safeGet(STORAGE_KEYS.MEDICATIONS, []);
    const cleanMeds = storedMeds.filter((m) => !DEMO_DATA_IDS.medications.includes(m.id));
    safeSet(STORAGE_KEYS.MEDICATIONS, cleanMeds);

    // --- Dose Records ---
    const storedDoses = safeGet(STORAGE_KEYS.DOSE_RECORDS, []);
    const cleanDoses = storedDoses.filter(
      (d) =>
        !isDemoDoseId(d.id) &&
        !DEMO_DATA_IDS.medications.includes(d.medId)
    );
    safeSet(STORAGE_KEYS.DOSE_RECORDS, cleanDoses);

    // --- Appointments ---
    const storedApts = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const cleanApts = storedApts.filter((a) => !DEMO_DATA_IDS.appointments.includes(a.id));
    safeSet(STORAGE_KEYS.APPOINTMENTS, cleanApts);

    // --- Checklist ---
    const storedChecklist = safeGet(STORAGE_KEYS.CHECKLIST, []);
    const cleanChecklist = storedChecklist.filter((c) => !DEMO_DATA_IDS.checklist.includes(c.id));
    // If the checklist is now empty after removing demo items, seed generic defaults
    if (cleanChecklist.length === 0) {
      safeSet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST);
    } else {
      safeSet(STORAGE_KEYS.CHECKLIST, cleanChecklist);
    }

    // --- Notifications ---
    const storedNotifs = safeGet(STORAGE_KEYS.NOTIFICATIONS, []);
    const cleanNotifs = storedNotifs.filter((n) => !DEMO_DATA_IDS.notifications.includes(n.id));
    safeSet(STORAGE_KEYS.NOTIFICATIONS, cleanNotifs);

    // --- Timeline ---
    const storedTimeline = safeGet(STORAGE_KEYS.TIMELINE, []);
    const cleanTimeline = storedTimeline.filter((t) => !DEMO_DATA_IDS.timeline.includes(t.id));
    safeSet(STORAGE_KEYS.TIMELINE, cleanTimeline);

    // Remove legacy key
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED_LEGACY);

    console.info("[CareCircle] Migration complete. Demo data removed.");
  }

  // For fresh installs (no legacy key either), just initialize clean
  if (!wasLegacyInitialized) {
    // Fresh first-run: set empty defaults
    if (!localStorage.getItem(STORAGE_KEYS.PATIENT)) {
      safeSet(STORAGE_KEYS.PATIENT, EMPTY_PATIENT);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARE_TEAM)) {
      safeSet(STORAGE_KEYS.CARE_TEAM, INITIAL_CARE_TEAM);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDICATIONS)) {
      safeSet(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOSE_RECORDS)) {
      safeSet(STORAGE_KEYS.DOSE_RECORDS, generateInitialDoseRecords());
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHECKLIST)) {
      safeSet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TIMELINE)) {
      safeSet(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }
  }

  // Mark as current version
  localStorage.setItem(STORAGE_KEYS.APP_VERSION, CURRENT_VERSION);
};

/**
 * Initialize storage on first run (called by context on mount).
 * Safe to call multiple times — idempotent.
 */
export const initializeStorage = () => {
  migrateFromDemoData();
};

// Accessor methods — fallbacks use clean empty defaults, never fictional data
export const storageService = {
  getPatient: () => safeGet(STORAGE_KEYS.PATIENT, EMPTY_PATIENT),
  setPatient: (data) => safeSet(STORAGE_KEYS.PATIENT, data),

  getCareTeam: () => safeGet(STORAGE_KEYS.CARE_TEAM, []),
  setCareTeam: (data) => safeSet(STORAGE_KEYS.CARE_TEAM, data),

  getMedications: () => safeGet(STORAGE_KEYS.MEDICATIONS, []),
  setMedications: (data) => safeSet(STORAGE_KEYS.MEDICATIONS, data),

  getDoseRecords: () => safeGet(STORAGE_KEYS.DOSE_RECORDS, []),
  setDoseRecords: (data) => safeSet(STORAGE_KEYS.DOSE_RECORDS, data),

  getAppointments: () => safeGet(STORAGE_KEYS.APPOINTMENTS, []),
  setAppointments: (data) => safeSet(STORAGE_KEYS.APPOINTMENTS, data),

  getChecklist: () => safeGet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST),
  setChecklist: (data) => safeSet(STORAGE_KEYS.CHECKLIST, data),

  getNotifications: () => safeGet(STORAGE_KEYS.NOTIFICATIONS, []),
  setNotifications: (data) => safeSet(STORAGE_KEYS.NOTIFICATIONS, data),

  getTimeline: () => safeGet(STORAGE_KEYS.TIMELINE, []),
  setTimeline: (data) => safeSet(STORAGE_KEYS.TIMELINE, data),

  getSettings: () => safeGet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  setSettings: (data) => safeSet(STORAGE_KEYS.SETTINGS, data),

  // Reset clears all data to clean empty state — does NOT re-seed fictional records
  resetAllData: () => {
    localStorage.clear();
    safeSet(STORAGE_KEYS.PATIENT, EMPTY_PATIENT);
    safeSet(STORAGE_KEYS.CARE_TEAM, []);
    safeSet(STORAGE_KEYS.MEDICATIONS, []);
    safeSet(STORAGE_KEYS.DOSE_RECORDS, []);
    safeSet(STORAGE_KEYS.APPOINTMENTS, []);
    safeSet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, []);
    safeSet(STORAGE_KEYS.TIMELINE, []);
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.APP_VERSION, CURRENT_VERSION);
  }
};
