import { describe, expect, test } from 'vitest';
import { formatPrice } from '../formatPrice';

describe('formatPrice', () => {
  test('formats price in INR by default', () => {
    expect(formatPrice(1000)).toBe('₹1,000.00');
  });

  test('formats price with decimals', () => {
    expect(formatPrice(1234.56)).toBe('₹1,234.56');
  });

  test('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('₹0.00');
  });

  test('formats large numbers with proper grouping', () => {
    expect(formatPrice(1234567.89)).toBe('₹12,34,567.89');
  });

  test('formats small decimal amounts', () => {
    expect(formatPrice(0.99)).toBe('₹0.99');
  });

  test('handles negative amounts', () => {
    expect(formatPrice(-100)).toBe('-₹100.00');
  });

  test('formats with custom currency', () => {
    const formatted = formatPrice(1000, 'USD');
    expect(formatted).toContain('1,000.00');
  });

  test('truncates to maximum 2 decimal places', () => {
    expect(formatPrice(99.999)).toBe('₹100.00');
  });
});
