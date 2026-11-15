import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeStorage,
  migrateFromDemoData,
  storageService
} from '../../src/services/storage.js';
import { EMPTY_PATIENT, INITIAL_DAILY_CHECKLIST, INITIAL_SETTINGS } from '../../src/data/initialData.js';

describe('Storage & Data Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Getters and Setters', () => {
    it('sets and gets patient profile correctly', () => {
      const patient = {
        id: 'patient-custom-1',
        name: 'Grace Hopper',
        age: 85,
        bloodGroup: 'AB+',
        phone: '+1 555-0199',
        emergencyContact: { name: 'John', phone: '+1 555-0198' }
      };
      expect(storageService.setPatient(patient)).toBe(true);
      expect(storageService.getPatient()).toEqual(patient);
    });

    it('sets and gets medications collection', () => {
      const meds = [
        { id: 'med-101', name: 'Atorvastatin', dosage: '20 mg', stockQuantity: 30, lowStockThreshold: 7 }
      ];
      expect(storageService.setMedications(meds)).toBe(true);
      expect(storageService.getMedications()).toEqual(meds);
    });

    it('sets and gets appointments collection', () => {
      const apts = [
        { id: 'apt-201', doctorName: 'Dr. Watson', specialty: 'Neurology', date: '2026-06-15', time: '14:00' }
      ];
      expect(storageService.setAppointments(apts)).toBe(true);
      expect(storageService.getAppointments()).toEqual(apts);
    });

    it('sets and gets care team members', () => {
      const team = [
        { id: 'member-301', name: 'Dr. Jane Foster', role: 'Physician', phone: '+1 555-4321' }
      ];
      expect(storageService.setCareTeam(team)).toBe(true);
      expect(storageService.getCareTeam()).toEqual(team);
    });

    it('sets and gets dose records', () => {
      const doses = [
        { id: 'dose-401', medId: 'med-101', status: 'taken', date: '2026-05-01', scheduledTime: '09:00' }
      ];
      expect(storageService.setDoseRecords(doses)).toBe(true);
      expect(storageService.getDoseRecords()).toEqual(doses);
    });

    it('sets and gets notifications and timeline', () => {
      const notifs = [{ id: 'notif-1', title: 'Refill Due', read: false }];
      const timeline = [{ id: 'time-1', title: 'Profile Created', author: 'User' }];

      storageService.setNotifications(notifs);
      storageService.setTimeline(timeline);

      expect(storageService.getNotifications()).toEqual(notifs);
      expect(storageService.getTimeline()).toEqual(timeline);
    });

    it('sets and gets settings and checklist', () => {
      const customSettings = { ...INITIAL_SETTINGS, demoPasscode: '9876' };
      storageService.setSettings(customSettings);
      expect(storageService.getSettings()).toEqual(customSettings);

      const customChecklist = [{ id: 'c1', task: 'Morning walk', completed: true }];
      storageService.setChecklist(customChecklist);
      expect(storageService.getChecklist()).toEqual(customChecklist);
    });
  });

  describe('Corrupted & Missing Data Handling', () => {
    it('returns empty fallback if LocalStorage key is missing', () => {
      expect(storageService.getPatient()).toEqual(EMPTY_PATIENT);
      expect(storageService.getMedications()).toEqual([]);
      expect(storageService.getAppointments()).toEqual([]);
      expect(storageService.getCareTeam()).toEqual([]);
      expect(storageService.getDoseRecords()).toEqual([]);
      expect(storageService.getNotifications()).toEqual([]);
      expect(storageService.getTimeline()).toEqual([]);
      expect(storageService.getChecklist()).toEqual(INITIAL_DAILY_CHECKLIST);
    });

    it('safely handles malformed or invalid JSON without throwing', () => {
      localStorage.setItem('carecircle_patient', '{invalid JSON...///}');
      localStorage.setItem('carecircle_medications', 'NOT_JSON');
      localStorage.setItem('carecircle_appointments', 'undefined');

      expect(() => {
        const patient = storageService.getPatient();
        expect(patient).toEqual(EMPTY_PATIENT);
      }).not.toThrow();

      expect(() => {
        const meds = storageService.getMedications();
        expect(meds).toEqual([]);
      }).not.toThrow();

      expect(() => {
        const apts = storageService.getAppointments();
        expect(apts).toEqual([]);
      }).not.toThrow();
    });
  });

  describe('Migration & Data Preservation', () => {
    it('fresh first-run sets empty defaults and version 2', () => {
      initializeStorage();
      expect(localStorage.getItem('carecircle_app_version')).toBe('2');
      expect(storageService.getPatient().name).toBe('');
      expect(storageService.getMedications()).toEqual([]);
      expect(storageService.getCareTeam()).toEqual([]);
    });

    it('migration purges known legacy demo records while strictly preserving user data', () => {
      localStorage.setItem('carecircle_initialized_v1', 'true');

      // Seeded legacy demo patient
      localStorage.setItem(
        'carecircle_patient',
        JSON.stringify({
          id: 'patient-1',
          name: 'Margaret Wilson',
          age: 72,
          avatar: 'https://images.unsplash.com/photo-1544005313'
        })
      );

      // Mixed medications
      localStorage.setItem(
        'carecircle_medications',
        JSON.stringify([
          { id: 'med-1', name: 'Vitamin D3' },
          { id: 'med-2', name: 'Blood Pressure Medication (Amlodipine)' },
          { id: 'med-user-custom-01', name: 'Metformin', dosage: '500 mg' }
        ])
      );

      // Mixed appointments
      localStorage.setItem(
        'carecircle_appointments',
        JSON.stringify([
          { id: 'apt-1', doctorName: 'Dr. Robert Chen' },
          { id: 'apt-user-custom-01', doctorName: 'Dr. Sarah Connor', date: '2026-08-10' }
        ])
      );

      // Mixed care team
      localStorage.setItem(
        'carecircle_care_team',
        JSON.stringify([
          { id: 'member-1', name: 'Margaret Wilson' },
          { id: 'member-2', name: 'Sarah Wilson' },
          { id: 'member-user-custom-01', name: 'Emily Thorne (Daughter)' }
        ])
      );

      // Mixed doses
      localStorage.setItem(
        'carecircle_dose_records',
        JSON.stringify([
          { id: 'dose-today-1', medId: 'med-1', status: 'taken' },
          { id: 'dose-past-1-1', medId: 'med-1', status: 'taken' },
          { id: 'dose-user-custom-01', medId: 'med-user-custom-01', status: 'taken' }
        ])
      );

      // Run migration
      migrateFromDemoData();

      // Demo patient replaced with empty patient
      expect(storageService.getPatient().name).toBe('');
      expect(storageService.getPatient().avatar).toBeNull();

      // User medication preserved, demo meds removed
      const meds = storageService.getMedications();
      expect(meds.length).toBe(1);
      expect(meds[0].id).toBe('med-user-custom-01');
      expect(meds[0].name).toBe('Metformin');

      // User appointment preserved, demo apt removed
      const apts = storageService.getAppointments();
      expect(apts.length).toBe(1);
      expect(apts[0].id).toBe('apt-user-custom-01');

      // User care team preserved, demo team removed
      const team = storageService.getCareTeam();
      expect(team.length).toBe(1);
      expect(team[0].id).toBe('member-user-custom-01');

      // User dose record preserved
      const doses = storageService.getDoseRecords();
      expect(doses.length).toBe(1);
      expect(doses[0].id).toBe('dose-user-custom-01');

      // Legacy key cleaned up, version marked as 2
      expect(localStorage.getItem('carecircle_initialized_v1')).toBeNull();
      expect(localStorage.getItem('carecircle_app_version')).toBe('2');
    });

    it('migration preserves genuine user-created patient profile', () => {
      localStorage.setItem('carecircle_initialized_v1', 'true');
      const genuinePatient = {
        id: 'patient-user-real-999',
        name: 'Henry Sterling',
        age: 79,
        dob: '1947-01-15'
      };
      localStorage.setItem('carecircle_patient', JSON.stringify(genuinePatient));

      migrateFromDemoData();

      expect(storageService.getPatient()).toEqual(genuinePatient);
    });

    it('migration is idempotent (running repeatedly causes no data loss)', () => {
      initializeStorage();
      const customMed = { id: 'med-custom-77', name: 'Levothyroxine' };
      storageService.setMedications([customMed]);

      migrateFromDemoData();
      migrateFromDemoData();
      migrateFromDemoData();

      expect(storageService.getMedications()).toEqual([customMed]);
    });
  });

  describe('Reset All Data', () => {
    it('clears all user-created records to clean empty state without re-seeding demo data', () => {
      storageService.setPatient({ id: 'p1', name: 'John' });
      storageService.setMedications([{ id: 'm1', name: 'Aspirin' }]);
      storageService.setAppointments([{ id: 'a1', doctorName: 'Dr. Who' }]);

      storageService.resetAllData();

      expect(storageService.getPatient().name).toBe('');
      expect(storageService.getMedications()).toEqual([]);
      expect(storageService.getAppointments()).toEqual([]);
      expect(storageService.getCareTeam()).toEqual([]);
      expect(storageService.getDoseRecords()).toEqual([]);
      expect(localStorage.getItem('carecircle_app_version')).toBe('2');
    });
  });
});
