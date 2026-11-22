import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Merchant registration validation schema matching FoodAI UK specifications
const ukMerchantRegisterSchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/, 'Must be a valid UK mobile number (+44 7...)'),
  postcode: z.string().regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, 'Must be a valid UK postal code'),
  cuisine: z.string().min(2),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const merchantLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

describe('Merchant Authentication Workflow Tests', () => {
  describe('Registration Workflow', () => {
    it('accepts valid UK restaurant registration details', () => {
      const validPayload = {
        restaurantName: 'The Artisan Italian & Pizza Bar',
        ownerName: 'Marco Rossi',
        email: 'marco@artisanpizza.co.uk',
        phone: '+44 7123 456789',
        postcode: 'M1 5QA',
        cuisine: 'Italian & Pizza',
        password: 'SecurePassword123!',
      };

      const result = ukMerchantRegisterSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('marco@artisanpizza.co.uk');
        expect(result.data.postcode).toBe('M1 5QA');
      }
    });

    it('rejects invalid UK phone number (non +44 7 format)', () => {
      const invalidPayload = {
        restaurantName: 'The Artisan Italian',
        ownerName: 'Marco Rossi',
        email: 'marco@artisanpizza.co.uk',
        phone: '+1 555 123 4567', // US number
        postcode: 'M1 5QA',
        cuisine: 'Italian & Pizza',
        password: 'SecurePassword123!',
      };

      const result = ukMerchantRegisterSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('phone');
        expect(result.error.issues[0].message).toContain('UK mobile');
      }
    });

    it('rejects invalid UK postal code', () => {
      const invalidPayload = {
        restaurantName: 'The Artisan Italian',
        ownerName: 'Marco Rossi',
        email: 'marco@artisanpizza.co.uk',
        phone: '+44 7123 456789',
        postcode: '90210', // US zip
        cuisine: 'Italian & Pizza',
        password: 'SecurePassword123!',
      };

      const result = ukMerchantRegisterSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('postcode');
      }
    });

    it('enforces password minimum length of 8 characters', () => {
      const shortPass = {
        restaurantName: 'The Artisan Italian',
        ownerName: 'Marco Rossi',
        email: 'marco@artisanpizza.co.uk',
        phone: '+44 7123 456789',
        postcode: 'SW1A 1AA',
        cuisine: 'Italian & Pizza',
        password: 'short',
      };

      const result = ukMerchantRegisterSchema.safeParse(shortPass);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });
  });

  describe('Login Workflow', () => {
    it('validates credentials schema for sign in', () => {
      const validLogin = {
        email: 'manager@artisanpizza.co.uk',
        password: 'Password123!',
      };

      const result = merchantLoginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('rejects malformed email on login', () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'Password123!',
      };

      const result = merchantLoginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });
});
