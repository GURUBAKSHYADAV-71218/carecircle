import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetupProfileModal } from '../../src/components/modals/SetupProfileModal.jsx';
import * as CareContextModule from '../../src/context/CareContext.jsx';

describe('SetupProfileModal Component', () => {
  let mockUpdatePatient;
  let mockOnClose;

  beforeEach(() => {
    mockUpdatePatient = vi.fn();
    mockOnClose = vi.fn();

    vi.spyOn(CareContextModule, 'useCare').mockReturnValue({
      patient: {
        id: null,
        name: '',
        age: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        email: '',
        address: '',
        physician: '',
        healthcareNotes: '',
        emergencyContact: { name: '', relation: '', phone: '', email: '' },
        avatar: null
      },
      updatePatient: mockUpdatePatient
    });
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<SetupProfileModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal structure with required fields when isOpen is true', () => {
    render(<SetupProfileModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/Set Up Your Patient Profile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Eleanor Thompson/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Patient Profile/i })).toBeInTheDocument();
  });

  it('displays validation error if required full name is omitted on submit', () => {
    render(<SetupProfileModal isOpen={true} onClose={mockOnClose} />);

    const submitBtn = screen.getByRole('button', { name: /Save Patient Profile/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
    expect(mockUpdatePatient).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('computes age from DOB and successfully calls updatePatient on valid submission', () => {
    render(<SetupProfileModal isOpen={true} onClose={mockOnClose} />);

    const nameInput = screen.getByPlaceholderText(/e\.g\. Eleanor Thompson/i);
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Harold Finch' } });

    // Set DOB to 1950-01-01
    const dobInput = screen.getByLabelText(/Date of Birth/i);
    fireEvent.change(dobInput, { target: { name: 'dob', value: '1950-01-01' } });

    const submitBtn = screen.getByRole('button', { name: /Save Patient Profile/i });
    fireEvent.click(submitBtn);

    expect(mockUpdatePatient).toHaveBeenCalledTimes(1);
    const submittedProfile = mockUpdatePatient.mock.calls[0][0];

    expect(submittedProfile.name).toBe('Harold Finch');
    expect(submittedProfile.dob).toBe('1950-01-01');
    expect(submittedProfile.age).toBeGreaterThanOrEqual(74); // computed age from 1950
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('allows clicking Skip for Now to dismiss modal', () => {
    render(<SetupProfileModal isOpen={true} onClose={mockOnClose} />);

    const skipBtn = screen.getByRole('button', { name: /Skip for Now/i });
    fireEvent.click(skipBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockUpdatePatient).not.toHaveBeenCalled();
  });

  it('regression: correctly associates all form labels with their corresponding inputs via htmlFor and id', () => {
    render(<SetupProfileModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/^Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Blood Group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Relationship/i)).toBeInTheDocument();
  });
});
