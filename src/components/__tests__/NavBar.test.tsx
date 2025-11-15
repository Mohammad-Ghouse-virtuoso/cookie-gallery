import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../NavBar';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOutUser: vi.fn(),
  }),
}));

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    cart: {},
    setCart: vi.fn(),
  }),
}));

vi.mock('@/lib/checkoutAddressStorage', () => ({
  hasCheckoutAddress: () => false,
}));

vi.mock('../CartPreviewModal', () => ({
  default: () => <div data-testid="cart-preview-modal">Cart Modal</div>,
}));

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation bar', () => {
    const { container } = render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  test('renders logo and brand name', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/cookie gallery/i)).toBeInTheDocument();
  });

  test('renders navigation elements', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/cookie gallery/i)).toBeInTheDocument();
  });
});
