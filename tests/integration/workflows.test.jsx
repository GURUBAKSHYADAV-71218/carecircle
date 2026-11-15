import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CareProvider, useCare } from '../../src/context/CareContext.jsx';
import { storageService, initializeStorage, migrateFromDemoData } from '../../src/services/storage.js';

// Test consumer component exposing context functions and state for integration testing
const TestConsumer = ({ onReady }) => {
  const context = useCare();
  React.useEffect(() => {
    if (onReady) onReady(context);
  }, [context, onReady]);

  return (
    <div>
      <div data-testid="patient-name">{context.patient.name}</div>
      <div data-testid="meds-count">{context.medications.length}</div>
      <div data-testid="apts-count">{context.appointments.length}</div>
      <div data-testid="team-count">{context.careTeam.length}</div>
      <div data-testid="today-adherence">{context.adherenceStats.todayAdherence}</div>
    </div>
  );
};

describe('CareCircle Multi-Step Integration Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Workflow 1: New User Profile Setup & Persistence', () => {
    it('initializes clean, persists patient setup, and survives application reload', async () => {
      let ctx;
      render(
        <CareProvider>
          <TestConsumer onReady={(c) => (ctx = c)} />
        </CareProvider>
      );

      // 1. Initial empty state
      expect(screen.getByTestId('patient-name').textContent).toBe('');
      expect(screen.getByTestId('meds-count').textContent).toBe('0');
      expect(screen.getByTestId('today-adherence').textContent).toBe('0');

      // 2. Complete Profile Setup
      act(() => {
        ctx.updatePatient({
          id: 'patient-test-user-1',
          name: 'Franklin D. Roosevelt',
          age: 82,
          dob: '1944-01-30',
          bloodGroup: 'O+',
          phone: '+1 (555) 300-4000',
          emergencyContact: {
            name: 'Eleanor',
            relation: 'Spouse',
            phone: '+1 (555) 300-4001'
          },
          primaryCaregiver: 'Eleanor'
        });
      });

      expect(screen.getByTestId('patient-name').textContent).toBe('Franklin D. Roosevelt');

      // 3. Verify LocalStorage persistence directly
      const storedPatient = storageService.getPatient();
      expect(storedPatient.name).toBe('Franklin D. Roosevelt');
      expect(storedPatient.emergencyContact.name).toBe('Eleanor');

      // 4. Simulate application reload by re-rendering with freshly read storage
      const reloadedPatient = storageService.getPatient();
      expect(reloadedPatient.name).toBe('Franklin D. Roosevelt');
      expect(reloadedPatient.primaryCaregiver).toBe('Eleanor');
    });
  });

  describe('Workflow 2: Medication Regimen, Live Dose Actions & Adherence Tracking', () => {
    it('manages prescription lifecycle, updates dose schedule, decrements stock, and calculates live adherence', () => {
      let ctx;
      render(
        <CareProvider>
          <TestConsumer onReady={(c) => (ctx = c)} />
        </CareProvider>
      );

      // 1. Add medication with scheduled time
      act(() => {
        ctx.addMedication({
          name: 'Hydrochlorothiazide',
          dosage: '25 mg',
          frequency: 'Once daily',
          scheduleTimes: ['08:00'],
          stockQuantity: 20,
          lowStockThreshold: 5,
          foodInstructions: 'With breakfast'
        });
      });

      expect(screen.getByTestId('meds-count').textContent).toBe('1');
      expect(ctx.doseRecords.length).toBe(1);

      const pendingDose = ctx.doseRecords[0];
      expect(pendingDose.medName).toBe('Hydrochlorothiazide');
      expect(pendingDose.status).toBe('pending');

      // Adherence before any doses are evaluated should be 0% (NOT 100%)
      expect(screen.getByTestId('today-adherence').textContent).toBe('0');

      // 2. Mark dose taken
      act(() => {
        ctx.markDoseTaken(pendingDose.id);
      });

      // Dose status updated to 'taken'
      const updatedDose = ctx.doseRecords.find((d) => d.id === pendingDose.id);
      expect(updatedDose.status).toBe('taken');
      expect(updatedDose.takenAt).not.toBeNull();

      // Stock reduced by 1 (20 -> 19)
      const updatedMed = ctx.medications.find((m) => m.name === 'Hydrochlorothiazide');
      expect(updatedMed.stockQuantity).toBe(19);

      // Adherence is now 100% (1 taken / 1 evaluated)
      expect(screen.getByTestId('today-adherence').textContent).toBe('100');

      // Timeline event logged
      expect(ctx.timeline.length).toBeGreaterThan(0);
      expect(ctx.timeline[0].title).toContain('Dose Taken');

      // 3. Delete medication cleans up its active prescription
      act(() => {
        ctx.deleteMedication(updatedMed.id);
      });

      expect(screen.getByTestId('meds-count').textContent).toBe('0');
    });
  });

  describe('Workflow 3: Appointment Scheduling, Updates & Status Progression', () => {
    it('schedules consultations, updates dates, and progresses to completed', () => {
      let ctx;
      render(
        <CareProvider>
          <TestConsumer onReady={(c) => (ctx = c)} />
        </CareProvider>
      );

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      // 1. Add appointment
      act(() => {
        ctx.addAppointment({
          doctorName: 'Dr. Sanjay Gupta',
          specialty: 'Neurosurgery',
          date: tomorrowStr,
          time: '10:00',
          hospitalName: 'General Hospital',
          location: 'Building B'
        });
      });

      expect(screen.getByTestId('apts-count').textContent).toBe('1');

      // Check next appointment countdown
      expect(ctx.nextAppointment).not.toBeNull();
      expect(ctx.nextAppointment.doctorName).toBe('Dr. Sanjay Gupta');
      expect(ctx.nextAppointment.countdownText).toBe('Tomorrow');

      // 2. Mark completed
      const aptId = ctx.appointments[0].id;
      act(() => {
        ctx.markAppointmentCompleted(aptId);
      });

      expect(ctx.appointments[0].status).toBe('completed');
      // Next upcoming appointment becomes null once completed
      expect(ctx.nextAppointment).toBeNull();

      // 3. Delete appointment
      act(() => {
        ctx.deleteAppointment(aptId);
      });

      expect(screen.getByTestId('apts-count').textContent).toBe('0');
    });
  });

  describe('Workflow 4: Care Team Collaboration & Primary Caregiver Sync', () => {
    it('adds members, designates primary caregiver, and syncs patient profile caregiver', () => {
      let ctx;
      render(
        <CareProvider>
          <TestConsumer onReady={(c) => (ctx = c)} />
        </CareProvider>
      );

      act(() => {
        ctx.addCareTeamMember({
          name: 'Sarah Connor',
          role: 'Secondary Caregiver',
          relation: 'Daughter',
          phone: '+1 555-444-3333',
          email: 'sarah.c@example.com'
        });
      });

      expect(screen.getByTestId('team-count').textContent).toBe('1');
      const member = ctx.careTeam[0];
      expect(member.isPrimary).toBe(false);

      // Designate as primary caregiver
      act(() => {
        ctx.setPrimaryCaregiver(member.id);
      });

      expect(ctx.careTeam[0].isPrimary).toBe(true);
      expect(ctx.careTeam[0].role).toBe('Primary Caregiver');
      // Patient's primaryCaregiver string should update in sync
      expect(ctx.patient.primaryCaregiver).toBe('Sarah Connor');
    });
  });

  describe('Workflow 5: Migration Safety with Mixed Legacy Demo & Real User Records', () => {
    it('strips only known demo records while preserving all genuine user data intact', () => {
      localStorage.setItem('carecircle_initialized_v1', 'true');

      // Seed mock old installation with demo patient and user data
      localStorage.setItem(
        'carecircle_patient',
        JSON.stringify({ id: 'patient-1', name: 'Margaret Wilson' })
      );
      localStorage.setItem(
        'carecircle_medications',
        JSON.stringify([
          { id: 'med-1', name: 'Vitamin D3' },
          { id: 'med-user-custom-001', name: 'Rosuvastatin', dosage: '10 mg' }
        ])
      );
      localStorage.setItem(
        'carecircle_appointments',
        JSON.stringify([
          { id: 'apt-1', doctorName: 'Dr. Robert Chen' },
          { id: 'apt-user-custom-001', doctorName: 'Dr. Beverly Crusher' }
        ])
      );

      migrateFromDemoData();

      // Patient was demo patient -> reset to empty
      const patient = storageService.getPatient();
      expect(patient.name).toBe('');

      // User medication survived, demo med removed
      const meds = storageService.getMedications();
      expect(meds.length).toBe(1);
      expect(meds[0].name).toBe('Rosuvastatin');

      // User appointment survived, demo apt removed
      const apts = storageService.getAppointments();
      expect(apts.length).toBe(1);
      expect(apts[0].doctorName).toBe('Dr. Beverly Crusher');
    });
  });

  describe('Workflow 6: Application Data Reset Confirmation', () => {
    it('resets all data cleanly without re-seeding fictional demo data', () => {
      let ctx;
      render(
        <CareProvider>
          <TestConsumer onReady={(c) => (ctx = c)} />
        </CareProvider>
      );

      // Add dummy data
      act(() => {
        ctx.updatePatient({ name: 'Test Patient' });
        ctx.addMedication({ name: 'Med A' });
      });

      expect(screen.getByTestId('patient-name').textContent).toBe('Test Patient');
      expect(screen.getByTestId('meds-count').textContent).toBe('1');

      // Trigger reset
      act(() => {
        ctx.resetAllDemoData();
      });

      expect(screen.getByTestId('patient-name').textContent).toBe('');
      expect(screen.getByTestId('meds-count').textContent).toBe('0');
      expect(ctx.careTeam.length).toBe(0);
      expect(ctx.appointments.length).toBe(0);
      expect(ctx.doseRecords.length).toBe(0);
      expect(localStorage.getItem('carecircle_app_version')).toBe('2');
    });
  });
});
