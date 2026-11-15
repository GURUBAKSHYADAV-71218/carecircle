import { describe, it, expect } from 'vitest';
import {
  generateEmailPayload,
  EMAIL_TEMPLATES,
  dispatchEmail
} from '../../src/services/emailService.js';

describe('Email Service & Notification Templates', () => {
  it('generates MISSED_DOSE template with custom patient & caregiver data', () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {
      patientName: 'George Washington',
      caregiverName: 'Martha Washington',
      caregiverEmail: 'martha@example.com',
      medName: 'Aspirin',
      dosage: '81 mg',
      scheduledTime: '08:00 AM',
      instructions: 'With breakfast'
    });

    expect(payload.templateId).toBe(EMAIL_TEMPLATES.MISSED_DOSE);
    expect(payload.recipient).toBe('martha@example.com');
    expect(payload.recipientName).toBe('Martha Washington');
    expect(payload.severity).toBe('urgent');
    expect(payload.subject).toContain('George Washington');
    expect(payload.subject).not.toMatch(/Margaret Wilson/i);
    expect(payload.htmlContent).toContain('George Washington');
    expect(payload.htmlContent).toContain('Aspirin (81 mg)');
    expect(payload.htmlContent).toContain('08:00 AM');
    expect(payload.htmlContent).not.toMatch(/Margaret/i);
    expect(payload.htmlContent).not.toMatch(/Sarah Wilson/i);
  });

  it('generates UPCOMING_APPOINTMENT template correctly', () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.UPCOMING_APPOINTMENT, {
      patientName: 'Jane Austen',
      caregiverName: 'Cassandra',
      caregiverEmail: 'cassandra@example.com',
      doctorName: 'Dr. John Croft',
      specialty: 'Cardiology',
      date: '2026-07-20',
      time: '11:15 AM',
      hospitalName: 'Bath Medical Center',
      location: 'Suite 200',
      notes: 'Annual follow-up'
    });

    expect(payload.templateId).toBe(EMAIL_TEMPLATES.UPCOMING_APPOINTMENT);
    expect(payload.subject).toContain('Jane Austen');
    expect(payload.htmlContent).toContain('Dr. John Croft (Cardiology)');
    expect(payload.htmlContent).toContain('2026-07-20 at 11:15 AM');
    expect(payload.htmlContent).toContain('Bath Medical Center');
  });

  it('generates REFILL_ALERT template with correct stock thresholds', () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.REFILL_ALERT, {
      medName: 'Metoprolol',
      remainingStock: 3,
      threshold: 7
    });

    expect(payload.templateId).toBe(EMAIL_TEMPLATES.REFILL_ALERT);
    expect(payload.subject).toContain('Metoprolol');
    expect(payload.htmlContent).toContain('3 units');
    expect(payload.htmlContent).toContain('threshold is 7');
  });

  it('provides safe neutral defaults when optional fields are omitted', () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {});
    expect(payload.recipient).toBe('caregiver@example.com');
    expect(payload.recipientName).toBe('Caregiver');
    expect(payload.subject).toContain('Patient');
    expect(payload.htmlContent).not.toMatch(/Margaret|Sarah Wilson/i);
  });

  it('dispatchEmail safely returns preview mode metadata without claiming live delivery', async () => {
    const payload = generateEmailPayload(EMAIL_TEMPLATES.MISSED_DOSE, {});
    const result = await dispatchEmail(payload);

    expect(result.success).toBe(true);
    expect(result.isDemoPreview).toBe(true);
    expect(result.message).toContain('Preview Mode');
    expect(result.payload).toEqual(payload);
  });
});
