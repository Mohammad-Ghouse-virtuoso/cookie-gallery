/**
 * Test data fixtures for E2E tests
 * These fixtures provide consistent test data across different test files
 */

export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  fullName: 'Test User',
  phone: '9876543210',
};

export const testAddress = {
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  address: '123 Test Street, Apartment 4B',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
};

export const testCookie = {
  name: 'Chocolate Chip Cookie',
  price: 299,
  quantity: 2,
};

export const testPaymentCard = {
  // Stripe test card numbers
  validCard: '4242424242424242',
  declinedCard: '4000000000000002',
  insufficientFundsCard: '4000000000009995',
  expiry: '12/34',
  cvc: '123',
  zipCode: '12345',
};
