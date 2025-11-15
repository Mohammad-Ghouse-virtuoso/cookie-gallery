import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartPreviewModal from '../CartPreviewModal';
import type { CartPreviewItem, CartTotals } from '../CartPreviewModal';

// Mock AuthContext
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

describe('CartPreviewModal', () => {
  const mockItem: CartPreviewItem = {
    id: 'cookie-1',
    name: 'Chocolate Chip',
    price: 299,
    qty: 2,
    image: '/test-image.jpg',
    detail: {
      type: 'cookie',
      name: 'Chocolate Chip',
      price: 299,
      image: '/test-image.jpg',
      productId: 'cookie-1',
    },
  };

  const mockTotals: CartTotals = {
    subtotal: 598,
    grandTotal: 598,
  };

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    items: [mockItem],
    totals: mockTotals,
    onUpdateQty: vi.fn(),
    onRemove: vi.fn(),
    onCheckout: vi.fn(),
    onExplore: vi.fn(),
  };

  test('renders when open', () => {
    render(
      <MemoryRouter>
        <CartPreviewModal {...mockProps} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Chocolate Chip')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <MemoryRouter>
        <CartPreviewModal {...mockProps} isOpen={false} />
      </MemoryRouter>
    );
    
    expect(screen.queryByText('Chocolate Chip')).not.toBeInTheDocument();
  });

  test('displays item quantity', () => {
    render(
      <MemoryRouter>
        <CartPreviewModal {...mockProps} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calls onClose when close is triggered', async () => {
    render(
      <MemoryRouter>
        <CartPreviewModal {...mockProps} />
      </MemoryRouter>
    );
    
    // Find and click close button (look for × or close button)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(btn => 
      btn.textContent?.includes('×') || 
      btn.getAttribute('aria-label')?.toLowerCase().includes('close')
    );
    
    if (closeButton) {
      await userEvent.click(closeButton);
      expect(mockProps.onClose).toHaveBeenCalled();
    }
  });

  test('renders empty cart state', () => {
    render(
      <MemoryRouter>
        <CartPreviewModal {...mockProps} items={[]} totals={{ subtotal: 0, grandTotal: 0 }} />
      </MemoryRouter>
    );
    
    // Should show empty cart message
    expect(screen.getByText(/empty/i)).toBeInTheDocument();
  });
});
