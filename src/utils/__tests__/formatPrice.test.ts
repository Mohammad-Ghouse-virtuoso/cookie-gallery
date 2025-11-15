import { describe, expect, test } from 'vitest';
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  test('formats price in INR by default', () => {
    const result = formatPrice(100);
    expect(result).toBe('₹100.00');
  });

  test('formats price with decimal values', () => {
    const result = formatPrice(99.99);
    expect(result).toBe('₹99.99');
  });

  test('formats zero price', () => {
    const result = formatPrice(0);
    expect(result).toBe('₹0.00');
  });

  test('formats large price values', () => {
    const result = formatPrice(123456.78);
    expect(result).toBe('₹1,23,456.78');
  });

  test('formats price with custom currency', () => {
    const result = formatPrice(100, 'USD');
    expect(result).toMatch(/100/);
  });

  test('handles negative values', () => {
    const result = formatPrice(-50);
    expect(result).toMatch(/-.*50/);
  });

  test('rounds to maximum 2 decimal places', () => {
    const result = formatPrice(99.999);
    expect(result).toBe('₹100.00');
  });
});
