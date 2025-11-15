import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartPreviewModal, { type CartPreviewItem, type CartTotals } from '../CartPreviewModal';

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
  }),
}));

vi.mock('@/lib/checkoutAddressStorage', () => ({
  loadCheckoutAddress: () => null,
}));

describe('CartPreviewModal', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdateQty = vi.fn();
  const mockOnRemove = vi.fn();
  const mockOnCheckout = vi.fn();
  const mockOnExplore = vi.fn();

  const defaultItems: CartPreviewItem[] = [
    {
      id: 'classic',
      name: 'Classic Crunch',
      price: 499,
      qty: 2,
      image: '/classic.jpg',
      detail: {
        type: 'cookie',
        name: 'Classic Crunch',
        price: 499,
        image: '/classic.jpg',
        productId: 'classic',
      },
    },
  ];

  const defaultTotals: CartTotals = {
    subtotal: 998,
    grandTotal: 998,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does not render when closed', () => {
    render(
      <CartPreviewModal
        isOpen={false}
        onClose={mockOnClose}
        items={defaultItems}
        totals={defaultTotals}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    expect(screen.queryByText(/classic crunch/i)).not.toBeInTheDocument();
  });

  test('renders cart items when open', () => {
    render(
      <CartPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        items={defaultItems}
        totals={defaultTotals}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    expect(screen.getByText(/classic crunch/i)).toBeInTheDocument();
  });

  test('displays correct totals', () => {
    render(
      <CartPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        items={defaultItems}
        totals={defaultTotals}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    expect(screen.getAllByText(/₹998\.00/).length).toBeGreaterThan(0);
  });

  test('displays checkout UI with items', async () => {
    render(
      <CartPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        items={defaultItems}
        totals={defaultTotals}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    // Check that the cart shows the items
    expect(screen.getByText(/classic crunch/i)).toBeInTheDocument();
  });

  test('shows empty cart message when no items', () => {
    render(
      <CartPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        items={[]}
        totals={{ subtotal: 0, grandTotal: 0 }}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('calls onExplore when explore button is clicked in empty cart', async () => {
    render(
      <CartPreviewModal
        isOpen={true}
        onClose={mockOnClose}
        items={[]}
        totals={{ subtotal: 0, grandTotal: 0 }}
        onUpdateQty={mockOnUpdateQty}
        onRemove={mockOnRemove}
        onCheckout={mockOnCheckout}
        onExplore={mockOnExplore}
      />,
    );

    const exploreButton = screen.getByRole('button', { name: /browse cookies/i });
    await userEvent.click(exploreButton);

    expect(mockOnExplore).toHaveBeenCalledTimes(1);
  });
});
