import { describe, it, expect } from 'vitest';
import {
  EMPTY_PATIENT,
  INITIAL_CARE_TEAM,
  INITIAL_MEDICATIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMELINE,
  INITIAL_DAILY_CHECKLIST,
  INITIAL_SETTINGS,
  generateInitialDoseRecords,
  DEMO_DATA_IDS
} from '../../src/data/initialData.js';

describe('Initial Data Purity & Absence of Fictional Records', () => {
  it('EMPTY_PATIENT contains no fictional personal details or photo', () => {
    expect(EMPTY_PATIENT.name).toBe('');
    expect(EMPTY_PATIENT.age).toBe('');
    expect(EMPTY_PATIENT.dob).toBe('');
    expect(EMPTY_PATIENT.gender).toBe('');
    expect(EMPTY_PATIENT.bloodGroup).toBe('');
    expect(EMPTY_PATIENT.phone).toBe('');
    expect(EMPTY_PATIENT.email).toBe('');
    expect(EMPTY_PATIENT.address).toBe('');
    expect(EMPTY_PATIENT.avatar).toBeNull();
    expect(EMPTY_PATIENT.healthcareNotes).toBe('');
    expect(EMPTY_PATIENT.physician).toBe('');
    expect(EMPTY_PATIENT.emergencyContact).toEqual({
      name: '',
      relation: '',
      phone: '',
      email: ''
    });
    expect(EMPTY_PATIENT.primaryCaregiver).toBe('');
  });

  it('all initial healthcare collections are empty arrays for fresh setup', () => {
    expect(INITIAL_CARE_TEAM).toEqual([]);
    expect(INITIAL_MEDICATIONS).toEqual([]);
    expect(INITIAL_APPOINTMENTS).toEqual([]);
    expect(INITIAL_NOTIFICATIONS).toEqual([]);
    expect(INITIAL_TIMELINE).toEqual([]);
    expect(generateInitialDoseRecords()).toEqual([]);
  });

  it('INITIAL_DAILY_CHECKLIST contains generic wellness routines without fictional names', () => {
    expect(INITIAL_DAILY_CHECKLIST.length).toBeGreaterThan(0);
    INITIAL_DAILY_CHECKLIST.forEach((item) => {
      expect(item.task).not.toMatch(/Margaret|Robert Chen|Sarah Wilson|Emily/i);
      expect(item.completed).toBe(false);
    });
  });

  it('INITIAL_SETTINGS has default passcode and simulated email provider', () => {
    expect(INITIAL_SETTINGS.demoPasscode).toBe('2468');
    expect(INITIAL_SETTINGS.activeView).toBe('patient');
    expect(INITIAL_SETTINGS.emailConfig.activeDelivery).toBe(false);
  });

  it('DEMO_DATA_IDS properly enumerates legacy demo IDs for safe migration', () => {
    expect(DEMO_DATA_IDS.patient).toContain('patient-1');
    expect(DEMO_DATA_IDS.patientNames).toContain('Margaret Wilson');
    expect(DEMO_DATA_IDS.careTeam).toEqual(['member-1', 'member-2', 'member-3', 'member-4']);
    expect(DEMO_DATA_IDS.medications).toEqual(['med-1', 'med-2', 'med-3', 'med-4']);
    expect(DEMO_DATA_IDS.appointments).toEqual(['apt-1', 'apt-2', 'apt-3']);
    expect(DEMO_DATA_IDS.dosePrefixes).toEqual(['dose-today-', 'dose-past-']);
  });
});
