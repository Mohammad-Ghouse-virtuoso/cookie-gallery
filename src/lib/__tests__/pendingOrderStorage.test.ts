import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import {
  loadPendingOrder,
  persistPendingOrder,
  clearPendingOrder,
  updatePendingOrderStatus,
} from '../pendingOrderStorage';
import type { PendingOrderSnapshot } from '@/types/checkout';

describe('pendingOrderStorage', () => {
  const mockOrder: PendingOrderSnapshot = {
    localOrderId: 'order-123',
    checkoutUrl: 'https://stripe.test/session/abc',
    providerSessionId: 'sess_123',
    createdAt: Date.now(),
    cart: { 'choco-cookie': 2 },
    status: 'pending',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('loadPendingOrder returns null when no order exists', () => {
    const result = loadPendingOrder();
    expect(result).toBeNull();
  });

  test('persistPendingOrder stores and loadPendingOrder retrieves order', () => {
    persistPendingOrder(mockOrder);
    const result = loadPendingOrder();
    expect(result).toEqual(mockOrder);
  });

  test('clearPendingOrder removes stored order', () => {
    persistPendingOrder(mockOrder);
    expect(loadPendingOrder()).not.toBeNull();
    
    clearPendingOrder();
    expect(loadPendingOrder()).toBeNull();
  });

  test('persistPendingOrder replaces previous order', () => {
    const firstOrder = { ...mockOrder, localOrderId: 'order-1' };
    const secondOrder = { ...mockOrder, localOrderId: 'order-2' };

    persistPendingOrder(firstOrder);
    persistPendingOrder(secondOrder);

    const result = loadPendingOrder();
    expect(result?.localOrderId).toBe('order-2');
  });

  test('updatePendingOrderStatus updates existing order status', () => {
    persistPendingOrder(mockOrder);
    
    const updated = updatePendingOrderStatus('completed');
    expect(updated?.status).toBe('completed');
    expect(updated?.localOrderId).toBe(mockOrder.localOrderId);
    
    const loaded = loadPendingOrder();
    expect(loaded?.status).toBe('completed');
  });

  test('updatePendingOrderStatus returns null when no order exists', () => {
    const result = updatePendingOrderStatus('completed');
    expect(result).toBeNull();
  });

  test('updatePendingOrderStatus merges additional fields', () => {
    persistPendingOrder(mockOrder);
    
    const updated = updatePendingOrderStatus('completed', {
      returnPath: '/success',
    });
    
    expect(updated?.status).toBe('completed');
    expect(updated?.returnPath).toBe('/success');
  });

  test('handles legacy storage key migration', () => {
    const legacyKey = 'cg_pending_order_v1';
    localStorage.setItem(legacyKey, JSON.stringify(mockOrder));
    
    const result = loadPendingOrder();
    expect(result).toEqual(mockOrder);
    
    // Legacy key should be removed after migration
    expect(localStorage.getItem(legacyKey)).toBeNull();
  });

  test('handles malformed JSON gracefully', () => {
    localStorage.setItem('pendingOrder:current', 'order-invalid');
    localStorage.setItem('pendingOrder:order-invalid', 'invalid json');
    
    const result = loadPendingOrder();
    expect(result).toBeNull();
  });

  test('handles missing localOrderId in snapshot', () => {
    const invalidOrder = { checkoutUrl: 'https://test.com' } as any;
    localStorage.setItem('pendingOrder:current', 'order-123');
    localStorage.setItem('pendingOrder:order-123', JSON.stringify(invalidOrder));
    
    const result = loadPendingOrder();
    expect(result).toBeNull();
  });
});
