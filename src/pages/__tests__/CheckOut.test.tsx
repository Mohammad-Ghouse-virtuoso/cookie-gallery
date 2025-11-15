import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckOut from '../CheckOut';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    cart: { classic: 2 },
    setCart: vi.fn(),
  }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
  }),
}));

vi.mock('@/lib/checkoutAddressStorage', () => ({
  loadCheckoutAddress: () => ({
    fullName: 'Test User',
    phone: '+919999999999',
    line1: '123 Test St',
    line2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
  }),
}));

vi.mock('@/lib/pendingOrderStorage', () => ({
  loadPendingOrder: () => null,
}));

vi.mock('@/components/payments/StripeCheckoutFlow', () => ({
  StripeCheckoutFlow: () => <div data-testid="stripe-checkout-flow">Stripe Checkout</div>,
}));

describe('CheckOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });

  test('renders checkout page', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('stripe-checkout-flow')).toBeInTheDocument();
  });

  test('displays cart items', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>,
    );

    expect(screen.getByText(/classic/i)).toBeInTheDocument();
  });
});
