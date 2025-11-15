import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GiftForm from '../GiftForm';

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    cart: {},
    setCart: vi.fn(),
  }),
}));

vi.mock('@/lib/giftFormStorage', () => ({
  persistGiftAddress: vi.fn(),
  getEmptyAddress: () => ({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    pincode: '',
    landmark: '',
  }),
  readStoredAddress: () => null,
}));

const mockBox = {
  id: 'golden-classic',
  name: 'Golden Classic',
  description: 'A timeless collection',
  price: 1999,
  image: '/golden-classic.jpg',
  cookies: [],
};

describe('GiftForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders gift form', () => {
    render(
      <MemoryRouter>
        <GiftForm selectedBox={mockBox} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/who are you gifting this to/i)).toBeInTheDocument();
  });

  test('displays recipient options', () => {
    render(
      <MemoryRouter>
        <GiftForm selectedBox={mockBox} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/mom/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/dad/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/friend/i).length).toBeGreaterThan(0);
  });

  test('shows progress bar', () => {
    render(
      <MemoryRouter>
        <GiftForm selectedBox={mockBox} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
