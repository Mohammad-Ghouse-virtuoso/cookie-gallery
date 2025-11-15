import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import {
  loadCheckoutAddress,
  persistCheckoutAddress,
  clearCheckoutAddress,
  hasCheckoutAddress,
  getEmptyCheckoutAddress,
} from '../checkoutAddressStorage';
import type { CheckoutAddress } from '@/types/checkout';

describe('checkoutAddressStorage', () => {
  const mockAddress: CheckoutAddress = {
    fullName: 'Ada Lovelace',
    phone: '+919999999999',
    line1: '42 Baker Street',
    line2: 'Apt 4',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('getEmptyCheckoutAddress returns default address structure', () => {
    const empty = getEmptyCheckoutAddress();
    expect(empty).toEqual({
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    });
  });

  test('loadCheckoutAddress returns null when no address exists', () => {
    const result = loadCheckoutAddress();
    expect(result).toBeNull();
  });

  test('persistCheckoutAddress stores and loadCheckoutAddress retrieves address', () => {
    persistCheckoutAddress(mockAddress);
    const result = loadCheckoutAddress();
    expect(result).toEqual(mockAddress);
  });

  test('clearCheckoutAddress removes stored address', () => {
    persistCheckoutAddress(mockAddress);
    expect(loadCheckoutAddress()).not.toBeNull();
    
    clearCheckoutAddress();
    expect(loadCheckoutAddress()).toBeNull();
  });

  test('hasCheckoutAddress returns false when no address exists', () => {
    expect(hasCheckoutAddress()).toBe(false);
  });

  test('hasCheckoutAddress returns false for incomplete address', () => {
    const incompleteAddress = { ...mockAddress, fullName: '', phone: '' };
    persistCheckoutAddress(incompleteAddress);
    expect(hasCheckoutAddress()).toBe(false);
  });

  test('hasCheckoutAddress returns true for complete address', () => {
    persistCheckoutAddress(mockAddress);
    expect(hasCheckoutAddress()).toBe(true);
  });

  test('supports user-scoped storage with ownerId', () => {
    const user1Address = { ...mockAddress, fullName: 'User One' };
    const user2Address = { ...mockAddress, fullName: 'User Two' };

    persistCheckoutAddress(user1Address, 'user1@test.com');
    persistCheckoutAddress(user2Address, 'user2@test.com');

    const loaded1 = loadCheckoutAddress('user1@test.com');
    const loaded2 = loadCheckoutAddress('user2@test.com');

    expect(loaded1?.fullName).toBe('User One');
    expect(loaded2?.fullName).toBe('User Two');
  });

  test('clears user-scoped address independently', () => {
    persistCheckoutAddress(mockAddress, 'user1@test.com');
    persistCheckoutAddress(mockAddress, 'user2@test.com');

    clearCheckoutAddress('user1@test.com');

    expect(loadCheckoutAddress('user1@test.com')).toBeNull();
    expect(loadCheckoutAddress('user2@test.com')).not.toBeNull();
  });

  test('migrates legacy storage to user-scoped storage', () => {
    const legacyKey = 'cg_checkout_address_v1';
    localStorage.setItem(legacyKey, JSON.stringify(mockAddress));

    const result = loadCheckoutAddress('user@test.com');
    expect(result).toEqual(mockAddress);

    // Legacy key should be removed after migration
    expect(localStorage.getItem(legacyKey)).toBeNull();
  });

  test('handles malformed JSON gracefully', () => {
    localStorage.setItem('cg_checkout_address_v1', 'invalid json');
    const result = loadCheckoutAddress();
    expect(result).toBeNull();
  });

  test('merges partial address with empty defaults', () => {
    const partialAddress = {
      fullName: 'Test User',
      city: 'TestCity',
    } as CheckoutAddress;

    persistCheckoutAddress(partialAddress);
    const result = loadCheckoutAddress();

    expect(result?.fullName).toBe('Test User');
    expect(result?.city).toBe('TestCity');
    expect(result?.country).toBe('India');
    expect(result?.phone).toBe('');
  });

  test('handles case-insensitive ownerId', () => {
    persistCheckoutAddress(mockAddress, 'User@Test.COM');
    const result = loadCheckoutAddress('user@test.com');
    expect(result).toEqual(mockAddress);
  });
});
