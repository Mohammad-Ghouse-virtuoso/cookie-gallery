import { describe, expect, test, beforeEach, vi } from 'vitest';
import {
  loadPendingOrder,
  persistPendingOrder,
  clearPendingOrder,
  updatePendingOrderStatus,
} from '../pendingOrderStorage';
import type { PendingOrderSnapshot } from '@/types/checkout';

describe('pendingOrderStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('persistPendingOrder', () => {
    test('stores order snapshot in localStorage', () => {
      const snapshot: PendingOrderSnapshot = {
        localOrderId: 'order-123',
        checkoutUrl: 'https://stripe.com/checkout/123',
        providerSessionId: 'sess_123',
        createdAt: Date.now(),
        cart: { classic: 2 },
        status: 'pending',
      };

      persistPendingOrder(snapshot);

      expect(localStorage.getItem('pendingOrder:current')).toBe('order-123');
      expect(localStorage.getItem('pendingOrder:order-123')).toBe(JSON.stringify(snapshot));
    });

    test('replaces previous order when persisting new one', () => {
      const snapshot1: PendingOrderSnapshot = {
        localOrderId: 'order-1',
        checkoutUrl: 'https://stripe.com/checkout/1',
        providerSessionId: 'sess_1',
        createdAt: Date.now(),
        cart: { classic: 1 },
        status: 'pending',
      };

      const snapshot2: PendingOrderSnapshot = {
        localOrderId: 'order-2',
        checkoutUrl: 'https://stripe.com/checkout/2',
        providerSessionId: 'sess_2',
        createdAt: Date.now(),
        cart: { classic: 2 },
        status: 'pending',
      };

      persistPendingOrder(snapshot1);
      persistPendingOrder(snapshot2);

      expect(localStorage.getItem('pendingOrder:current')).toBe('order-2');
      expect(localStorage.getItem('pendingOrder:order-1')).toBeNull();
      expect(localStorage.getItem('pendingOrder:order-2')).toBe(JSON.stringify(snapshot2));
    });
  });

  describe('loadPendingOrder', () => {
    test('returns null when no order exists', () => {
      expect(loadPendingOrder()).toBeNull();
    });

    test('loads stored order snapshot', () => {
      const snapshot: PendingOrderSnapshot = {
        localOrderId: 'order-456',
        checkoutUrl: 'https://stripe.com/checkout/456',
        providerSessionId: 'sess_456',
        createdAt: Date.now(),
        cart: { chocolate: 3 },
        status: 'pending',
      };

      persistPendingOrder(snapshot);
      const loaded = loadPendingOrder();

      expect(loaded).toEqual(snapshot);
    });

    test('returns null for invalid JSON', () => {
      localStorage.setItem('pendingOrder:current', 'order-bad');
      localStorage.setItem('pendingOrder:order-bad', 'invalid-json');

      expect(loadPendingOrder()).toBeNull();
    });

    test('migrates legacy order format', () => {
      const legacySnapshot: PendingOrderSnapshot = {
        localOrderId: 'legacy-order',
        checkoutUrl: 'https://stripe.com/checkout/legacy',
        providerSessionId: 'sess_legacy',
        createdAt: Date.now(),
        cart: { classic: 1 },
        status: 'pending',
      };

      localStorage.setItem('cg_pending_order_v1', JSON.stringify(legacySnapshot));

      const loaded = loadPendingOrder();

      expect(loaded).toEqual(legacySnapshot);
      expect(localStorage.getItem('cg_pending_order_v1')).toBeNull();
      expect(localStorage.getItem('pendingOrder:current')).toBe('legacy-order');
    });
  });

  describe('clearPendingOrder', () => {
    test('removes all order data from localStorage', () => {
      const snapshot: PendingOrderSnapshot = {
        localOrderId: 'order-789',
        checkoutUrl: 'https://stripe.com/checkout/789',
        providerSessionId: 'sess_789',
        createdAt: Date.now(),
        cart: { classic: 1 },
        status: 'pending',
      };

      persistPendingOrder(snapshot);
      clearPendingOrder();

      expect(localStorage.getItem('pendingOrder:current')).toBeNull();
      expect(localStorage.getItem('pendingOrder:order-789')).toBeNull();
    });

    test('handles clearing when no order exists', () => {
      expect(() => clearPendingOrder()).not.toThrow();
    });
  });

  describe('updatePendingOrderStatus', () => {
    test('updates status of existing order', () => {
      const snapshot: PendingOrderSnapshot = {
        localOrderId: 'order-update',
        checkoutUrl: 'https://stripe.com/checkout/update',
        providerSessionId: 'sess_update',
        createdAt: Date.now(),
        cart: { classic: 1 },
        status: 'pending',
      };

      persistPendingOrder(snapshot);
      const updated = updatePendingOrderStatus('completed');

      expect(updated).toBeTruthy();
      expect(updated?.status).toBe('completed');
      expect(updated?.updatedAt).toBeDefined();
    });

    test('updates with additional fields', () => {
      const snapshot: PendingOrderSnapshot = {
        localOrderId: 'order-fields',
        checkoutUrl: 'https://stripe.com/checkout/fields',
        providerSessionId: 'sess_fields',
        createdAt: Date.now(),
        cart: { classic: 1 },
        status: 'pending',
      };

      persistPendingOrder(snapshot);
      const updated = updatePendingOrderStatus('completed', { 
        returnPath: '/success' 
      });

      expect(updated?.status).toBe('completed');
      expect(updated?.returnPath).toBe('/success');
    });

    test('returns null when no order exists', () => {
      const result = updatePendingOrderStatus('completed');
      expect(result).toBeNull();
    });
  });
});
