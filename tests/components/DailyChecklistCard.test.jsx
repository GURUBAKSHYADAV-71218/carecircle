import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DailyChecklistCard } from '../../src/components/widgets/DailyChecklistCard.jsx';
import * as CareContextModule from '../../src/context/CareContext.jsx';

describe('DailyChecklistCard Component', () => {
  it('renders tasks and computes completed progress percentage', () => {
    const checklist = [
      { id: 'c1', task: 'Drink 4 glasses of water', completed: true, time: '11:00 AM' },
      { id: 'c2', task: 'Take afternoon walk', completed: false, time: '03:00 PM' }
    ];

    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      checklist,
      toggleChecklistItem: vi.fn(),
      resetDailyChecklist: vi.fn()
    });

    render(<DailyChecklistCard />);

    expect(screen.getByText(/1 of 2 completed \(50%\)/i)).toBeInTheDocument();
    expect(screen.getByText('Drink 4 glasses of water')).toBeInTheDocument();
    expect(screen.getByText('Take afternoon walk')).toBeInTheDocument();
  });

  it('triggers toggleChecklistItem when clicking a checklist row', () => {
    const mockToggle = vi.fn();
    const checklist = [
      { id: 'c1', task: 'Drink water', completed: false, time: '10:00 AM' }
    ];

    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      checklist,
      toggleChecklistItem: mockToggle,
      resetDailyChecklist: vi.fn()
    });

    render(<DailyChecklistCard />);

    const itemRow = screen.getByRole('checkbox');
    fireEvent.click(itemRow);

    expect(mockToggle).toHaveBeenCalledWith('c1');
  });

  it('triggers resetDailyChecklist when Reset Day button is clicked', () => {
    const mockReset = vi.fn();
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      checklist: [{ id: 'c1', task: 'Task', completed: true }],
      toggleChecklistItem: vi.fn(),
      resetDailyChecklist: mockReset
    });

    render(<DailyChecklistCard />);

    const resetBtn = screen.getByRole('button', { name: /Reset Day/i });
    fireEvent.click(resetBtn);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
