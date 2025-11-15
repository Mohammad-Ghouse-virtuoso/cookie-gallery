import { describe, expect, test, beforeEach } from 'vitest';
import {
  loadCheckoutAddress,
  persistCheckoutAddress,
  clearCheckoutAddress,
  getEmptyCheckoutAddress,
  hasCheckoutAddress,
} from '../checkoutAddressStorage';
import type { CheckoutAddress } from '@/types/checkout';

describe('checkoutAddressStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getEmptyCheckoutAddress', () => {
    test('returns an empty address with India as default country', () => {
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

    test('returns a new object each time', () => {
      const empty1 = getEmptyCheckoutAddress();
      const empty2 = getEmptyCheckoutAddress();

      expect(empty1).not.toBe(empty2);
      expect(empty1).toEqual(empty2);
    });
  });

  describe('persistCheckoutAddress', () => {
    test('stores address in localStorage without owner', () => {
      const address: CheckoutAddress = {
        fullName: 'Ada Lovelace',
        phone: '+919999999999',
        line1: '42 Baker Street',
        line2: 'Apt 4',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
      };

      persistCheckoutAddress(address);

      const stored = localStorage.getItem('cg_checkout_address_v1');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(address);
    });

    test('stores address with owner ID', () => {
      const address: CheckoutAddress = {
        fullName: 'Grace Hopper',
        phone: '+918888888888',
        line1: '123 Main St',
        line2: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      };

      persistCheckoutAddress(address, 'user123');

      const stored = localStorage.getItem('cg_checkout_address_v1:user123');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(address);
    });

    test('normalizes owner ID to lowercase', () => {
      const address = getEmptyCheckoutAddress();
      address.fullName = 'Test User';

      persistCheckoutAddress(address, 'USER456');

      expect(localStorage.getItem('cg_checkout_address_v1:user456')).toBeTruthy();
    });
  });

  describe('loadCheckoutAddress', () => {
    test('returns null when no address is stored', () => {
      expect(loadCheckoutAddress()).toBeNull();
    });

    test('loads stored address without owner', () => {
      const address: CheckoutAddress = {
        fullName: 'Alan Turing',
        phone: '+917777777777',
        line1: '456 Computing Rd',
        line2: '',
        city: 'Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
      };

      persistCheckoutAddress(address);
      const loaded = loadCheckoutAddress();

      expect(loaded).toEqual(address);
    });

    test('loads stored address with owner ID', () => {
      const address: CheckoutAddress = {
        fullName: 'Margaret Hamilton',
        phone: '+916666666666',
        line1: '789 Software Lane',
        line2: 'Suite 100',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
      };

      persistCheckoutAddress(address, 'user789');
      const loaded = loadCheckoutAddress('user789');

      expect(loaded).toEqual(address);
    });

    test('migrates legacy address when owner ID is provided', () => {
      const legacyAddress: CheckoutAddress = {
        fullName: 'Legacy User',
        phone: '+915555555555',
        line1: '999 Old St',
        line2: '',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        country: 'India',
      };

      localStorage.setItem('cg_checkout_address_v1', JSON.stringify(legacyAddress));

      const loaded = loadCheckoutAddress('newuser');

      expect(loaded).toEqual(legacyAddress);
      expect(localStorage.getItem('cg_checkout_address_v1')).toBeNull();
      expect(localStorage.getItem('cg_checkout_address_v1:newuser')).toBeTruthy();
    });

    test('returns null for invalid JSON', () => {
      localStorage.setItem('cg_checkout_address_v1', 'invalid-json');

      expect(loadCheckoutAddress()).toBeNull();
    });

    test('fills missing fields with empty values', () => {
      const partial = {
        fullName: 'Partial User',
        city: 'Kolkata',
        country: 'India',
      };

      localStorage.setItem('cg_checkout_address_v1', JSON.stringify(partial));

      const loaded = loadCheckoutAddress();

      expect(loaded).toEqual({
        fullName: 'Partial User',
        phone: '',
        line1: '',
        line2: '',
        city: 'Kolkata',
        state: '',
        postalCode: '',
        country: 'India',
      });
    });
  });

  describe('clearCheckoutAddress', () => {
    test('removes address from localStorage without owner', () => {
      const address = getEmptyCheckoutAddress();
      address.fullName = 'Test User';

      persistCheckoutAddress(address);
      clearCheckoutAddress();

      expect(localStorage.getItem('cg_checkout_address_v1')).toBeNull();
    });

    test('removes address with owner ID', () => {
      const address = getEmptyCheckoutAddress();
      address.fullName = 'Test User';

      persistCheckoutAddress(address, 'user999');
      clearCheckoutAddress('user999');

      expect(localStorage.getItem('cg_checkout_address_v1:user999')).toBeNull();
    });

    test('does not throw when clearing non-existent address', () => {
      expect(() => clearCheckoutAddress()).not.toThrow();
    });
  });

  describe('hasCheckoutAddress', () => {
    test('returns false when no address is stored', () => {
      expect(hasCheckoutAddress()).toBe(false);
    });

    test('returns false for incomplete address', () => {
      const incomplete: CheckoutAddress = {
        fullName: 'Incomplete User',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      };

      persistCheckoutAddress(incomplete);

      expect(hasCheckoutAddress()).toBe(false);
    });

    test('returns true for complete address', () => {
      const complete: CheckoutAddress = {
        fullName: 'Complete User',
        phone: '+914444444444',
        line1: '123 Complete St',
        line2: '',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500001',
        country: 'India',
      };

      persistCheckoutAddress(complete);

      expect(hasCheckoutAddress()).toBe(true);
    });

    test('returns true for complete address with owner ID', () => {
      const complete: CheckoutAddress = {
        fullName: 'Owner User',
        phone: '+913333333333',
        line1: '456 Owner Ave',
        line2: '',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380001',
        country: 'India',
      };

      persistCheckoutAddress(complete, 'owner123');

      expect(hasCheckoutAddress('owner123')).toBe(true);
    });

    test('requires all mandatory fields to be present', () => {
      const missingCity: CheckoutAddress = {
        fullName: 'No City',
        phone: '+912222222222',
        line1: '789 Street',
        line2: '',
        city: '',
        state: 'State',
        postalCode: '123456',
        country: 'India',
      };

      persistCheckoutAddress(missingCity);

      expect(hasCheckoutAddress()).toBe(false);
    });
  });
});
