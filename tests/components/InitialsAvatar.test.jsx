import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InitialsAvatar } from '../../src/components/common/InitialsAvatar.jsx';

describe('InitialsAvatar Component', () => {
  it('renders initials for a full two-word name', () => {
    render(<InitialsAvatar name="Eleanor Thompson" size={44} />);
    expect(screen.getByText('ET')).toBeInTheDocument();
  });

  it('renders single initial for a single-word name', () => {
    render(<InitialsAvatar name="Eleanor" size={40} />);
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('renders first and last initial for multi-word name', () => {
    render(<InitialsAvatar name="Mary Jane Watson" size={50} />);
    expect(screen.getByText('MW')).toBeInTheDocument();
  });

  it('renders an image when avatar URL or data URI is provided', () => {
    const avatarUrl = 'https://example.com/avatar.jpg';
    render(<InitialsAvatar name="Arthur Dent" avatar={avatarUrl} size={48} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', avatarUrl);
    expect(img).toHaveAttribute('alt', 'Arthur Dent');
  });

  it('renders neutral user silhouette fallback when name is empty or null', () => {
    const { container } = render(<InitialsAvatar name="" size={40} />);
    // SVG icon from lucide-react should be rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(screen.queryByText(/^[A-Z]{1,2}$/)).not.toBeInTheDocument();
  });

  it('handles whitespace-only name gracefully', () => {
    const { container } = render(<InitialsAvatar name="    " size={40} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
