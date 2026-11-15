import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextReminderCard } from '../../src/components/widgets/NextReminderCard.jsx';
import * as CareContextModule from '../../src/context/CareContext.jsx';

describe('NextReminderCard Component', () => {
  it('renders "No medications added yet" prompt when medications list is empty', () => {
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      nextPendingDose: null,
      markDoseTaken: vi.fn(),
      medications: []
    });

    render(<NextReminderCard />);

    expect(screen.getByText(/No medications added yet/i)).toBeInTheDocument();
  });

  it('renders "All Caught Up" state when medications exist but no pending doses remain today', () => {
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      nextPendingDose: null,
      markDoseTaken: vi.fn(),
      medications: [{ id: 'm1', name: 'Aspirin' }]
    });

    render(<NextReminderCard />);

    expect(screen.getByText(/All Caught Up/i)).toBeInTheDocument();
    expect(screen.getByText(/All scheduled doses for today have been completed/i)).toBeInTheDocument();
  });

  it('renders pending dose details and triggers markDoseTaken on quick action button click', () => {
    const mockMarkTaken = vi.fn();
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      nextPendingDose: {
        id: 'dose-test-1',
        medName: 'Lisinopril',
        dosage: '10 mg',
        scheduledTime: '09:00 AM'
      },
      markDoseTaken: mockMarkTaken,
      medications: [{ id: 'm1', name: 'Lisinopril' }]
    });

    render(<NextReminderCard />);

    expect(screen.getByText('Lisinopril')).toBeInTheDocument();
    expect(screen.getByText('10 mg')).toBeInTheDocument();
    expect(screen.getByText('09:00 AM')).toBeInTheDocument();

    const actionBtn = screen.getByRole('button', { name: /Mark as Taken/i });
    fireEvent.click(actionBtn);

    expect(mockMarkTaken).toHaveBeenCalledWith('dose-test-1');
  });
});
