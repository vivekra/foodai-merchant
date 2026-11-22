import { describe, it, expect } from 'vitest';

export interface PricingConfig {
  freeCommissionRate: number;
  starterCommissionRate: number;
  proCommissionRate: number;
  enterpriseCommissionRate: number;
  voiceSurchargeRate: number;
}

export function calculateOrderPayout(
  subtotalGbp: number,
  tier: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE',
  orderChannel: 'VOICE' | 'QR_TABLE' | 'AI_CHAT' | 'DELIVERY',
  config: PricingConfig,
  stripeFeePercent = 1.5,
  stripeFixedFeeGbp = 0.20
) {
  const baseRate = {
    FREE: config.freeCommissionRate,
    STARTER: config.starterCommissionRate,
    PRO: config.proCommissionRate,
    ENTERPRISE: config.enterpriseCommissionRate,
  }[tier];

  // Voice AI orders apply voice surcharge on top of tier rate
  const effectiveCommissionPercent = orderChannel === 'VOICE' 
    ? baseRate + config.voiceSurchargeRate 
    : baseRate;

  const platformCommissionGbp = Number(((subtotalGbp * effectiveCommissionPercent) / 100).toFixed(2));
  const stripeFeeGbp = Number((((subtotalGbp * stripeFeePercent) / 100) + stripeFixedFeeGbp).toFixed(2));
  const netPayoutGbp = Number((subtotalGbp - platformCommissionGbp - stripeFeeGbp).toFixed(2));

  return {
    subtotalGbp,
    effectiveCommissionPercent,
    platformCommissionGbp,
    stripeFeeGbp,
    netPayoutGbp,
  };
}

describe('Pricing Engine Unit Tests', () => {
  const defaultConfig: PricingConfig = {
    freeCommissionRate: 15.0,
    starterCommissionRate: 8.0,
    proCommissionRate: 5.0,
    enterpriseCommissionRate: 2.0,
    voiceSurchargeRate: 2.0,
  };

  it('calculates correct commission on Pro tier dine-in QR order', () => {
    const result = calculateOrderPayout(34.0, 'PRO', 'QR_TABLE', defaultConfig);
    expect(result.effectiveCommissionPercent).toBe(5.0);
    expect(result.platformCommissionGbp).toBe(1.70); // 5% of £34.00
    expect(result.stripeFeeGbp).toBe(0.71); // 1.5% of 34 = 0.51 + 0.20 = 0.71
    expect(result.netPayoutGbp).toBe(31.59); // 34 - 1.70 - 0.71
  });

  it('adds +2% voice surcharge on AI phone order', () => {
    const result = calculateOrderPayout(28.50, 'PRO', 'VOICE', defaultConfig);
    // 5.0% Pro + 2.0% Voice = 7.0%
    expect(result.effectiveCommissionPercent).toBe(7.0);
    expect(result.platformCommissionGbp).toBe(2.00); // 7% of £28.50 = £1.995 rounded to £2.00
    expect(result.netPayoutGbp).toBe(25.87);
  });

  it('calculates correct commission on Free tier delivery order', () => {
    const result = calculateOrderPayout(50.00, 'FREE', 'DELIVERY', defaultConfig);
    expect(result.effectiveCommissionPercent).toBe(15.0);
    expect(result.platformCommissionGbp).toBe(7.50); // 15% of £50.00
    expect(result.netPayoutGbp).toBe(41.55);
  });

  it('calculates Enterprise tier high-volume rate', () => {
    const result = calculateOrderPayout(100.00, 'ENTERPRISE', 'QR_TABLE', defaultConfig);
    expect(result.effectiveCommissionPercent).toBe(2.0);
    expect(result.platformCommissionGbp).toBe(2.00);
  });
});
