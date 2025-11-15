import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckOut from '../CheckOut';

// Mock contexts
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    loading: false,
  }),
}));

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    cart: { 'cookie-1': 2 },
    setCart: vi.fn(),
  }),
}));

// Mock storage functions
vi.mock('@/lib/checkoutAddressStorage', () => ({
  loadCheckoutAddress: () => ({
    fullName: 'Test User',
    phone: '+919999999999',
    line1: '123 Test St',
    city: 'Bengaluru',
    postalCode: '560001',
    country: 'India',
  }),
}));

vi.mock('@/lib/pendingOrderStorage', () => ({
  loadPendingOrder: () => null,
}));

// Mock StripeCheckoutFlow component
vi.mock('@/components/payments/StripeCheckoutFlow', () => ({
  StripeCheckoutFlow: () => <div data-testid="stripe-checkout-flow">Stripe Checkout</div>,
}));

describe('CheckOut', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>
    );
    
    expect(document.body).toBeTruthy();
  });

  test('displays Stripe checkout flow when address exists', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('stripe-checkout-flow')).toBeInTheDocument();
  });

  test('renders with authenticated user', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>
    );
    
    // Should render checkout flow
    expect(screen.getByTestId('stripe-checkout-flow')).toBeInTheDocument();
  });

  test('handles cart with items', () => {
    render(
      <MemoryRouter>
        <CheckOut />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('stripe-checkout-flow')).toBeInTheDocument();
  });
});
