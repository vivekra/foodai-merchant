import { describe, it, expect } from 'vitest';

export interface AdminPricingUpdatePayload {
  freeCommissionRate: number;
  starterCommissionRate: number;
  proCommissionRate: number;
  enterpriseCommissionRate: number;
  voiceSurchargeRate: number;
  changeReason: string;
}

export function validatePricingUpdate(payload: AdminPricingUpdatePayload) {
  if (!payload.changeReason || payload.changeReason.trim().length < 5) {
    throw new Error('Compliance requires an audit change reason of at least 5 characters');
  }

  const rates = [
    payload.freeCommissionRate,
    payload.starterCommissionRate,
    payload.proCommissionRate,
    payload.enterpriseCommissionRate,
    payload.voiceSurchargeRate,
  ];

  for (const rate of rates) {
    if (typeof rate !== 'number' || isNaN(rate) || rate < 0 || rate > 50) {
      throw new Error(`Invalid commission rate: ${rate}. Must be between 0% and 50%.`);
    }
  }

  // Hierarchy check: Free >= Starter >= Pro >= Enterprise
  if (
    payload.freeCommissionRate < payload.starterCommissionRate ||
    payload.starterCommissionRate < payload.proCommissionRate ||
    payload.proCommissionRate < payload.enterpriseCommissionRate
  ) {
    throw new Error('Plan tier rates must decrease or remain equal with higher subscription tiers');
  }

  return {
    success: true,
    cacheKeyToInvalidate: 'platform:pricing:active',
    appliedAt: new Date().toISOString(),
  };
}

describe('Super Admin Pricing Engine Workflow Tests', () => {
  const validPayload: AdminPricingUpdatePayload = {
    freeCommissionRate: 15.0,
    starterCommissionRate: 8.0,
    proCommissionRate: 5.0,
    enterpriseCommissionRate: 2.0,
    voiceSurchargeRate: 2.0,
    changeReason: 'Q4 Promotional incentive for new merchant acquisition',
  };

  it('approves compliant pricing update and invalidates Redis cache key', () => {
    const result = validatePricingUpdate(validPayload);
    expect(result.success).toBe(true);
    expect(result.cacheKeyToInvalidate).toBe('platform:pricing:active');
    expect(result.appliedAt).toBeDefined();
  });

  it('rejects update without an audit note for compliance', () => {
    const withoutAudit = { ...validPayload, changeReason: 'tiny' };
    expect(() => validatePricingUpdate(withoutAudit)).toThrow(
      'Compliance requires an audit change reason'
    );
  });

  it('rejects rate higher than 50%', () => {
    const excessiveRate = { ...validPayload, freeCommissionRate: 65.0 };
    expect(() => validatePricingUpdate(excessiveRate)).toThrow(
      'Must be between 0% and 50%'
    );
  });

  it('rejects illogical tier hierarchy (e.g. Pro rate higher than Starter)', () => {
    const invertedTiers = {
      ...validPayload,
      starterCommissionRate: 5.0,
      proCommissionRate: 10.0, // Invalid: paying £79/mo for higher fee than £29/mo!
    };
    expect(() => validatePricingUpdate(invertedTiers)).toThrow(
      'Plan tier rates must decrease or remain equal'
    );
  });
});
