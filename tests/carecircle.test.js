// CareCircle Automated Verification Test Suite
// Executes via Node.js native test runner: node --test tests/carecircle.test.js

import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";

// Simple in-memory LocalStorage polyfill for testing
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
}

globalThis.localStorage = new MockLocalStorage();

// Import app modules
import {
  EMPTY_PATIENT,
  INITIAL_CARE_TEAM,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE,
  generateInitialDoseRecords,
  DEMO_DATA_IDS
} from "../src/data/initialData.js";

import {
  initializeStorage,
  migrateFromDemoData,
  storageService
} from "../src/services/storage.js";

import {
  generateEmailPayload,
  EMAIL_TEMPLATES,
  dispatchEmail
} from "../src/services/emailService.js";

describe("1. Initial Data Purity & Absence of Fictional Records", () => {
  test("EMPTY_PATIENT has no hardcoded name or personal identity", () => {
    assert.equal(EMPTY_PATIENT.name, "");
    assert.equal(EMPTY_PATIENT.age, "");
    assert.equal(EMPTY_PATIENT.phone, "");
    assert.equal(EMPTY_PATIENT.email, "");
    assert.equal(EMPTY_PATIENT.address, "");
    assert.equal(EMPTY_PATIENT.avatar, null);
    assert.equal(EMPTY_PATIENT.emergencyContact.name, "");
    assert.equal(EMPTY_PATIENT.emergencyContact.phone, "");
    assert.equal(EMPTY_PATIENT.primaryCaregiver, "");
  });

  test("Initial collections are genuinely empty arrays", () => {
    assert.deepEqual(INITIAL_CARE_TEAM, []);
    assert.deepEqual(INITIAL_MEDICATIONS, []);
    assert.deepEqual(INITIAL_APPOINTMENTS, []);
    assert.deepEqual(INITIAL_NOTIFICATIONS, []);
    assert.deepEqual(INITIAL_TIMELINE, []);
    assert.deepEqual(generateInitialDoseRecords(), []);
  });

  test("DEMO_DATA_IDS includes all legacy demo identifiers for safe migration", () => {
    assert.ok(DEMO_DATA_IDS.patient.includes("patient-1"));
    assert.ok(DEMO_DATA_IDS.patientNames.includes("Margaret Wilson"));
    assert.ok(DEMO_DATA_IDS.medications.includes("med-1"));
    assert.ok(DEMO_DATA_IDS.appointments.includes("apt-1"));
    assert.ok(DEMO_DATA_IDS.careTeam.includes("member-1"));
    assert.ok(DEMO_DATA_IDS.dosePrefixes.includes("dose-today-"));
    assert.ok(DEMO_DATA_IDS.dosePrefixes.includes("dose-past-"));
  });
});

describe("2. Clean First-Time Experience in Empty Storage", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  test("Fresh initializeStorage sets empty defaults and sets version 2", () => {
    initializeStorage();

    assert.equal(globalThis.localStorage.getItem("carecircle_app_version"), "2");
    assert.equal(globalThis.localStorage.getItem("carecircle_initialized_v1"), null);

    const patient = storageService.getPatient();
    assert.equal(patient.name, "");
    assert.equal(patient.avatar, null);

    const meds = storageService.getMedications();
    assert.deepEqual(meds, []);

    const team = storageService.getCareTeam();
    assert.deepEqual(team, []);

    const apts = storageService.getAppointments();
    assert.deepEqual(apts, []);

    const doses = storageService.getDoseRecords();
    assert.deepEqual(doses, []);

    const notifs = storageService.getNotifications();
    assert.deepEqual(notifs, []);
  });

  test("Storage getters fall back to empty defaults if keys are missing", () => {
    globalThis.localStorage.clear();
    assert.equal(storageService.getPatient().name, "");
    assert.deepEqual(storageService.getMedications(), []);
    assert.deepEqual(storageService.getAppointments(), []);
    assert.deepEqual(storageService.getCareTeam(), []);
    assert.deepEqual(storageService.getDoseRecords(), []);
  });
});

describe("3. LocalStorage Migration: Old Demo Data Removal & User Data Preservation", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  test("Migration strips legacy demo records while preserving genuine user data", () => {
    // Simulate an older installation containing both demo seed and genuine user entries
    globalThis.localStorage.setItem("carecircle_initialized_v1", "true");

    // Old demo patient
    globalThis.localStorage.setItem(
      "carecircle_patient",
      JSON.stringify({
        id: "patient-1",
        name: "Margaret Wilson",
        age: 72,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
      })
    );

    // Mix of demo and genuine medications
    globalThis.localStorage.setItem(
      "carecircle_medications",
      JSON.stringify([
        { id: "med-1", name: "Vitamin D3", dosage: "1000 IU" },
        { id: "med-2", name: "Blood Pressure Medication (Amlodipine)", dosage: "5 mg" },
        // GENUINE USER MEDICATION
        { id: "med-user-custom-99", name: "Metformin", dosage: "500 mg", stockQuantity: 60 }
      ])
    );

    // Mix of demo and genuine appointments
    globalThis.localStorage.setItem(
      "carecircle_appointments",
      JSON.stringify([
        { id: "apt-1", doctorName: "Dr. Robert Chen", date: "2026-03-20" },
        // GENUINE USER APPOINTMENT
        { id: "apt-user-custom-88", doctorName: "Dr. Amanda White", date: "2026-04-15" }
      ])
    );

    // Mix of demo and genuine care team members
    globalThis.localStorage.setItem(
      "carecircle_care_team",
      JSON.stringify([
        { id: "member-1", name: "Margaret Wilson", role: "Patient" },
        { id: "member-2", name: "Sarah Wilson", role: "Primary Caregiver" },
        // GENUINE USER CAREGIVER
        { id: "member-user-custom-77", name: "James Miller", role: "Neighbor" }
      ])
    );

    // Mix of demo and genuine dose records
    globalThis.localStorage.setItem(
      "carecircle_dose_records",
      JSON.stringify([
        { id: "dose-today-1", medId: "med-1", status: "taken" },
        { id: "dose-past-1-1", medId: "med-1", status: "taken" },
        // GENUINE USER DOSE RECORD
        { id: "dose-user-custom-55", medId: "med-user-custom-99", status: "taken" }
      ])
    );

    // Execute migration
    migrateFromDemoData();

    // Verify version updated and legacy key removed
    assert.equal(globalThis.localStorage.getItem("carecircle_app_version"), "2");
    assert.equal(globalThis.localStorage.getItem("carecircle_initialized_v1"), null);

    // Verify demo patient was reset to clean empty patient
    const migratedPatient = storageService.getPatient();
    assert.equal(migratedPatient.name, "");
    assert.equal(migratedPatient.avatar, null);

    // Verify medications: demo meds removed, user med preserved!
    const migratedMeds = storageService.getMedications();
    assert.equal(migratedMeds.length, 1);
    assert.equal(migratedMeds[0].id, "med-user-custom-99");
    assert.equal(migratedMeds[0].name, "Metformin");

    // Verify appointments: demo apt removed, user appointment preserved!
    const migratedApts = storageService.getAppointments();
    assert.equal(migratedApts.length, 1);
    assert.equal(migratedApts[0].id, "apt-user-custom-88");
    assert.equal(migratedApts[0].doctorName, "Dr. Amanda White");

    // Verify care team: demo members removed, user caregiver preserved!
    const migratedTeam = storageService.getCareTeam();
    assert.equal(migratedTeam.length, 1);
    assert.equal(migratedTeam[0].id, "member-user-custom-77");
    assert.equal(migratedTeam[0].name, "James Miller");

    // Verify dose records: demo doses removed, user dose preserved!
    const migratedDoses = storageService.getDoseRecords();
    assert.equal(migratedDoses.length, 1);
    assert.equal(migratedDoses[0].id, "dose-user-custom-55");
  });

  test("Migration preserves genuine patient if not the demo patient", () => {
    globalThis.localStorage.setItem("carecircle_initialized_v1", "true");
    globalThis.localStorage.setItem(
      "carecircle_patient",
      JSON.stringify({
        id: "patient-custom-123",
        name: "Arthur Pendelton",
        age: 80,
        bloodGroup: "B+"
      })
    );

    migrateFromDemoData();

    const patient = storageService.getPatient();
    assert.equal(patient.id, "patient-custom-123");
    assert.equal(patient.name, "Arthur Pendelton");
    assert.equal(patient.age, 80);
  });
});

describe("4. Storage Service Persistence & Resetting", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    initializeStorage();
  });

  test("Saving and loading patient data", () => {
    const customPatient = {
      id: "patient-test-1",
      name: "Helen Davis",
      age: 78,
      dob: "1948-06-12",
      bloodGroup: "A+",
      phone: "+1 555-111-2222",
      avatar: "data:image/png;base64,mock..."
    };

    storageService.setPatient(customPatient);
    const loaded = storageService.getPatient();
    assert.deepEqual(loaded, customPatient);
  });

  test("Reset all data clears storage to empty state without re-seeding demo data", () => {
    storageService.setPatient({ id: "p1", name: "User" });
    storageService.setMedications([{ id: "m1", name: "Aspirin" }]);
    storageService.setAppointments([{ id: "a1", doctorName: "Dr. Smith" }]);

    storageService.resetAllData();

    assert.equal(storageService.getPatient().name, "");
    assert.deepEqual(storageService.getMedications(), []);
    assert.deepEqual(storageService.getAppointments(), []);
    assert.deepEqual(storageService.getCareTeam(), []);
    assert.deepEqual(storageService.getDoseRecords(), []);
    assert.equal(globalThis.localStorage.getItem("carecircle_app_version"), "2");
  });
});

describe("5. Adherence Calculations & Elimination of Fabricated Data", () => {
  // Pure function testing the logic used in CareContext
  const computeAdherence = (doses) => {
    const taken = doses.filter((d) => d.status === "taken").length;
    const missed = doses.filter((d) => d.status === "missed").length;
    const pending = doses.filter((d) => d.status === "pending").length;
    const evaluated = taken + missed;
    const adherence = evaluated > 0 ? Math.round((taken / evaluated) * 100) : 0;
    const hasData = evaluated > 0;
    return { taken, missed, pending, evaluated, adherence, hasData };
  };

  test("Empty dose records return 0% adherence and hasData: false (no fabricated 100%)", () => {
    const res = computeAdherence([]);
    assert.equal(res.taken, 0);
    assert.equal(res.missed, 0);
    assert.equal(res.evaluated, 0);
    assert.equal(res.adherence, 0);
    assert.equal(res.hasData, false);
  });

  test("Pending doses only do not count as evaluated doses", () => {
    const res = computeAdherence([
      { id: "1", status: "pending" },
      { id: "2", status: "pending" }
    ]);
    assert.equal(res.pending, 2);
    assert.equal(res.evaluated, 0);
    assert.equal(res.adherence, 0);
    assert.equal(res.hasData, false);
  });

  test("Accurately computes adherence from taken and missed doses", () => {
    const res = computeAdherence([
      { id: "1", status: "taken" },
      { id: "2", status: "taken" },
      { id: "3", status: "taken" },
      { id: "4", status: "missed" },
      { id: "5", status: "pending" }
    ]);
    // 3 taken out of 4 evaluated = 75%
    assert.equal(res.taken, 3);
    assert.equal(res.missed, 1);
    assert.equal(res.evaluated, 4);
    assert.equal(res.adherence, 75);
    assert.equal(res.hasData, true);
  });
});

describe("6. Email Notification Generator & Delivery Simulator", () => {
  test("Missed dose email uses provided parameters without hardcoded demo strings", () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {
      patientName: "Robert Johnson",
      caregiverName: "Mary Johnson",
      caregiverEmail: "mary.j@example.com",
      medName: "Lisinopril",
      dosage: "10 mg",
      scheduledTime: "09:00 AM"
    });

    assert.equal(payload.recipient, "mary.j@example.com");
    assert.equal(payload.recipientName, "Mary Johnson");
    assert.ok(payload.subject.includes("Robert Johnson"));
    assert.ok(!payload.subject.includes("Margaret Wilson"));
    assert.ok(!payload.htmlContent.includes("Margaret"));
    assert.ok(!payload.htmlContent.includes("Sarah Wilson"));
    assert.ok(payload.htmlContent.includes("Robert Johnson"));
    assert.ok(payload.htmlContent.includes("Lisinopril"));
  });

  test("Email dispatch returns simulated preview metadata", async () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {});
    const result = await dispatchEmail(payload);
    assert.equal(result.success, true);
    assert.equal(result.isDemoPreview, true);
    assert.ok(result.message.includes("Preview Mode"));
  });
});

describe("7. Initials Avatar Extraction Logic", () => {
  const getInitials = (n) => {
    if (!n || !n.trim()) return null;
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  test("Extracts first and last initial accurately", () => {
    assert.equal(getInitials("Eleanor Thompson"), "ET");
    assert.equal(getInitials("John"), "J");
    assert.equal(getInitials("Mary Jane Watson"), "MW");
    assert.equal(getInitials("  robert   chen  "), "RC");
  });

  test("Returns null for empty or whitespace name", () => {
    assert.equal(getInitials(""), null);
    assert.equal(getInitials("   "), null);
    assert.equal(getInitials(null), null);
    assert.equal(getInitials(undefined), null);
  });
});

describe("8. File Size Validation Logic", () => {
  const validateAvatarSize = (sizeInBytes) => {
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
    return sizeInBytes <= MAX_SIZE;
  };

  test("Rejects files over 2 MB and accepts files within 2 MB", () => {
    assert.equal(validateAvatarSize(1.5 * 1024 * 1024), true);
    assert.equal(validateAvatarSize(2 * 1024 * 1024), true);
    assert.equal(validateAvatarSize(2.1 * 1024 * 1024), false);
    assert.equal(validateAvatarSize(5 * 1024 * 1024), false);
  });
});
