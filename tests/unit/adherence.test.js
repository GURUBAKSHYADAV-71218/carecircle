import { describe, it, expect } from 'vitest';

/**
 * Pure adherence calculator matching the implementation in CareContext.jsx
 */
const calculateAdherenceMetrics = (doseRecords, referenceDate = new Date()) => {
  const todayStr = referenceDate.toISOString().split('T')[0];

  // Today's doses
  const todayDoses = doseRecords.filter((d) => d.date === todayStr);
  const todayTaken = todayDoses.filter((d) => d.status === 'taken').length;
  const todayMissed = todayDoses.filter((d) => d.status === 'missed').length;
  const todayPending = todayDoses.filter((d) => d.status === 'pending').length;
  const todayEvaluated = todayTaken + todayMissed;
  const todayAdherence = todayEvaluated > 0 ? Math.round((todayTaken / todayEvaluated) * 100) : 0;

  // Weekly doses (past 7 days including today)
  const sevenDaysAgo = new Date(referenceDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyDoses = doseRecords.filter((d) => {
    const recordDate = new Date(d.date + 'T00:00:00');
    return recordDate >= sevenDaysAgo;
  });

  const weeklyTaken = weeklyDoses.filter((d) => d.status === 'taken').length;
  const weeklyMissed = weeklyDoses.filter((d) => d.status === 'missed').length;
  const weeklyEvaluated = weeklyTaken + weeklyMissed;
  const weeklyAdherence = weeklyEvaluated > 0 ? Math.round((weeklyTaken / weeklyEvaluated) * 100) : 0;
  const hasAdherenceData = weeklyEvaluated > 0 || todayEvaluated > 0;

  return {
    todayDoses,
    todayTaken,
    todayMissed,
    todayPending,
    todayEvaluated,
    todayAdherence,
    weeklyTaken,
    weeklyMissed,
    weeklyEvaluated,
    weeklyAdherence,
    hasAdherenceData
  };
};

describe('Medication Adherence Logic & Metrics', () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  it('returns 0% adherence and hasAdherenceData: false when dose history is empty', () => {
    const res = calculateAdherenceMetrics([]);
    expect(res.todayAdherence).toBe(0);
    expect(res.weeklyAdherence).toBe(0);
    expect(res.hasAdherenceData).toBe(false);
    expect(res.todayEvaluated).toBe(0);
    expect(res.weeklyEvaluated).toBe(0);
  });

  it('excludes pending doses from evaluation denominator', () => {
    const doses = [
      { id: '1', date: todayStr, status: 'pending' },
      { id: '2', date: todayStr, status: 'pending' }
    ];
    const res = calculateAdherenceMetrics(doses);
    expect(res.todayPending).toBe(2);
    expect(res.todayEvaluated).toBe(0);
    expect(res.todayAdherence).toBe(0);
    expect(res.hasAdherenceData).toBe(false);
  });

  it('calculates 100% adherence when all evaluated doses are taken', () => {
    const doses = [
      { id: '1', date: todayStr, status: 'taken' },
      { id: '2', date: todayStr, status: 'taken' },
      { id: '3', date: todayStr, status: 'pending' }
    ];
    const res = calculateAdherenceMetrics(doses);
    expect(res.todayTaken).toBe(2);
    expect(res.todayEvaluated).toBe(2);
    expect(res.todayAdherence).toBe(100);
    expect(res.hasAdherenceData).toBe(true);
  });

  it('calculates 0% adherence when all evaluated doses are missed', () => {
    const doses = [
      { id: '1', date: todayStr, status: 'missed' },
      { id: '2', date: todayStr, status: 'missed' }
    ];
    const res = calculateAdherenceMetrics(doses);
    expect(res.todayMissed).toBe(2);
    expect(res.todayEvaluated).toBe(2);
    expect(res.todayAdherence).toBe(0);
    expect(res.hasAdherenceData).toBe(true);
  });

  it('correctly rounds percentage when mixed taken and missed doses exist', () => {
    // 2 taken, 1 missed = 2/3 = 66.666% -> rounds to 67%
    const doses = [
      { id: '1', date: todayStr, status: 'taken' },
      { id: '2', date: todayStr, status: 'taken' },
      { id: '3', date: todayStr, status: 'missed' }
    ];
    const res = calculateAdherenceMetrics(doses);
    expect(res.todayAdherence).toBe(67);
  });

  it('accurately calculates 7-day rolling weekly adherence across multiple days', () => {
    const doses = [
      // Today: 2 taken, 0 missed
      { id: 't1', date: todayStr, status: 'taken' },
      { id: 't2', date: todayStr, status: 'taken' },
      // Yesterday: 1 taken, 1 missed
      { id: 'y1', date: yesterdayStr, status: 'taken' },
      { id: 'y2', date: yesterdayStr, status: 'missed' }
    ];
    const res = calculateAdherenceMetrics(doses);
    // Weekly: 3 taken / 4 evaluated = 75%
    expect(res.weeklyTaken).toBe(3);
    expect(res.weeklyMissed).toBe(1);
    expect(res.weeklyEvaluated).toBe(4);
    expect(res.weeklyAdherence).toBe(75);
  });

  it('ignores doses older than 7 days from the weekly calculation', () => {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const eightDaysAgoStr = eightDaysAgo.toISOString().split('T')[0];

    const doses = [
      { id: '1', date: todayStr, status: 'taken' },
      // Old dose from 8 days ago should be excluded from weekly calculation
      { id: '2', date: eightDaysAgoStr, status: 'missed' }
    ];
    const res = calculateAdherenceMetrics(doses);
    expect(res.weeklyTaken).toBe(1);
    expect(res.weeklyMissed).toBe(0);
    expect(res.weeklyAdherence).toBe(100);
  });
});
