import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmergencyCard } from '../../src/components/widgets/EmergencyCard.jsx';
import * as CareContextModule from '../../src/context/CareContext.jsx';

describe('EmergencyCard Component', () => {
  it('renders clean empty state with setup advice when no contact is configured', () => {
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      patient: {
        emergencyContact: { name: '', relation: '', phone: '', email: '' }
      }
    });

    render(<EmergencyCard />);

    expect(screen.getByText(/No emergency contact configured/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument(); // No broken tel: links
  });

  it('renders configured emergency contact details and direct dial tel: link', () => {
    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      patient: {
        physician: 'Dr. Gregory House',
        emergencyContact: {
          name: 'Wilson James',
          relation: 'Son & Primary Caregiver',
          phone: '+1 (555) 789-0123'
        }
      }
    });

    render(<EmergencyCard />);

    expect(screen.getByText('Wilson James')).toBeInTheDocument();
    expect(screen.getByText('Son & Primary Caregiver')).toBeInTheDocument();

    const callLink = screen.getByRole('link', { name: /Call Now/i });
    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute('href', 'tel:+15557890123');

    expect(screen.getByText(/Attending Physician: Dr\. Gregory House/i)).toBeInTheDocument();
  });
});
