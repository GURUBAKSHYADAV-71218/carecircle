import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LowStockBanner } from '../../src/components/widgets/LowStockBanner.jsx';
import * as CareContextModule from '../../src/context/CareContext.jsx';

describe('LowStockBanner Component', () => {
  it('renders nothing when no active medications are below the low stock threshold', () => {
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      medications: [
        { id: 'm1', name: 'Vitamin C', stockQuantity: 30, lowStockThreshold: 7, status: 'active' }
      ]
    });

    const { container } = render(<LowStockBanner onOpenRefillModal={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders warning alert banner when medication stock is at or below threshold', () => {
    const mockOpenRefill = vi.fn();
    const lowStockMed = {
      id: 'm1',
      name: 'Calcium Citrate',
      stockQuantity: 4,
      lowStockThreshold: 7,
      status: 'active'
    };

    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      medications: [lowStockMed]
    });

    render(<LowStockBanner onOpenRefillModal={mockOpenRefill} />);

    expect(screen.getByText(/Medication Refill Alert/i)).toBeInTheDocument();
    expect(screen.getByText(/Calcium Citrate \(4 pills remaining\)/i)).toBeInTheDocument();

    const refillBtn = screen.getByRole('button', { name: /Refill Calcium Citrate/i });
    fireEvent.click(refillBtn);

    expect(mockOpenRefill).toHaveBeenCalledWith(lowStockMed);
  });
});
