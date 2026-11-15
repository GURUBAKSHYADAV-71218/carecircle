// CareCircle LocalStorage Service
// Provides robust, fault-tolerant persistence with JSON validation and safety fallbacks.

import {
  INITIAL_PATIENT,
  INITIAL_CARE_TEAM,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_DAILY_CHECKLIST,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE,
  INITIAL_SETTINGS,
  generateInitialDoseRecords
} from "../data/initialData";

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
  INITIALIZED: "carecircle_initialized_v1"
};

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
 * Initialize storage with demo seed data on first run
 */
export const initializeStorage = (forceReset = false) => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);

  if (!isInitialized || forceReset) {
    safeSet(STORAGE_KEYS.PATIENT, INITIAL_PATIENT);
    safeSet(STORAGE_KEYS.CARE_TEAM, INITIAL_CARE_TEAM);
    safeSet(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
    safeSet(STORAGE_KEYS.DOSE_RECORDS, generateInitialDoseRecords());
    safeSet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    safeSet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST);
    safeSet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSet(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
    return true;
  }
  return false;
};

// Accessor methods
export const storageService = {
  getPatient: () => safeGet(STORAGE_KEYS.PATIENT, INITIAL_PATIENT),
  setPatient: (data) => safeSet(STORAGE_KEYS.PATIENT, data),

  getCareTeam: () => safeGet(STORAGE_KEYS.CARE_TEAM, INITIAL_CARE_TEAM),
  setCareTeam: (data) => safeSet(STORAGE_KEYS.CARE_TEAM, data),

  getMedications: () => safeGet(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS),
  setMedications: (data) => safeSet(STORAGE_KEYS.MEDICATIONS, data),

  getDoseRecords: () => safeGet(STORAGE_KEYS.DOSE_RECORDS, []),
  setDoseRecords: (data) => safeSet(STORAGE_KEYS.DOSE_RECORDS, data),

  getAppointments: () => safeGet(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS),
  setAppointments: (data) => safeSet(STORAGE_KEYS.APPOINTMENTS, data),

  getChecklist: () => safeGet(STORAGE_KEYS.CHECKLIST, INITIAL_DAILY_CHECKLIST),
  setChecklist: (data) => safeSet(STORAGE_KEYS.CHECKLIST, data),

  getNotifications: () => safeGet(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (data) => safeSet(STORAGE_KEYS.NOTIFICATIONS, data),

  getTimeline: () => safeGet(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE),
  setTimeline: (data) => safeSet(STORAGE_KEYS.TIMELINE, data),

  getSettings: () => safeGet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS),
  setSettings: (data) => safeSet(STORAGE_KEYS.SETTINGS, data),

  resetAllDemoData: () => {
    localStorage.clear();
    initializeStorage(true);
  }
};
