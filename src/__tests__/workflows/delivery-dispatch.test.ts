import { describe, it, expect } from 'vitest';

export interface ProviderIntegration {
  id: 'uber_direct' | 'stuart' | 'deliveroo_express' | 'gophr' | 'shipday';
  name: string;
  enabled: boolean;
  mode: 'platform' | 'byok';
  apiKey?: string;
  apiSecret?: string;
}

export function validateDeliverySettings(providers: ProviderIntegration[]) {
  const activeProviders = providers.filter((p) => p.enabled);
  if (activeProviders.length === 0) {
    throw new Error('At least one delivery provider must be enabled to accept delivery orders.');
  }

  for (const provider of activeProviders) {
    if (provider.mode === 'byok' && (!provider.apiKey || provider.apiKey.trim() === '')) {
      throw new Error(`Provider ${provider.name} is in BYOK mode but missing API credentials.`);
    }
  }

  return true;
}

export function selectOptimalCourier(
  distanceKm: number,
  orderValueGbp: number,
  activeProviders: ProviderIntegration[]
) {
  // Rate estimation engine
  const rates: Record<string, number> = {
    uber_direct: 3.50 + distanceKm * 1.20,
    stuart: 3.20 + distanceKm * 1.35,
    deliveroo_express: 4.00 + distanceKm * 1.10,
    gophr: 4.50 + distanceKm * 1.50,
  };

  const enabledRates = activeProviders
    .filter((p) => p.enabled && rates[p.id] !== undefined)
    .map((p) => ({
      providerId: p.id,
      name: p.name,
      estimatedCostGbp: Number(rates[p.id].toFixed(2)),
    }))
    .sort((a, b) => a.estimatedCostGbp - b.estimatedCostGbp);

  if (enabledRates.length === 0) {
    throw new Error('No available courier service for this route');
  }

  return enabledRates[0]; // Cheapest optimal courier
}

describe('Delivery Dispatch Integration Workflow Tests', () => {
  const sampleProviders: ProviderIntegration[] = [
    {
      id: 'uber_direct',
      name: 'Uber Direct',
      enabled: true,
      mode: 'platform',
    },
    {
      id: 'stuart',
      name: 'Stuart Delivery',
      enabled: true,
      mode: 'platform',
    },
    {
      id: 'deliveroo_express',
      name: 'Deliveroo Express Dispatch',
      enabled: false,
      mode: 'byok',
      apiKey: '',
    },
  ];

  it('validates active platform-mode delivery providers', () => {
    expect(validateDeliverySettings(sampleProviders)).toBe(true);
  });

  it('throws error when BYOK provider is enabled without API key', () => {
    const invalidByok: ProviderIntegration[] = [
      {
        id: 'deliveroo_express',
        name: 'Deliveroo Express Dispatch',
        enabled: true,
        mode: 'byok',
        apiKey: '', // missing
      },
    ];

    expect(() => validateDeliverySettings(invalidByok)).toThrow('missing API credentials');
  });

  it('throws error when all delivery providers are disabled', () => {
    const allDisabled = sampleProviders.map((p) => ({ ...p, enabled: false }));
    expect(() => validateDeliverySettings(allDisabled)).toThrow('At least one delivery provider must be enabled');
  });

  it('selects the cheapest optimal courier for a 3km urban delivery', () => {
    // 3km:
    // Uber: 3.50 + (3 * 1.20) = £7.10
    // Stuart: 3.20 + (3 * 1.35) = £7.25
    const optimal = selectOptimalCourier(3.0, 25.00, sampleProviders);
    expect(optimal.providerId).toBe('uber_direct');
    expect(optimal.estimatedCostGbp).toBe(7.10);
  });

  it('selects Stuart for shorter 1km trip where base fee is lower', () => {
    // 1km:
    // Uber: 3.50 + 1.20 = £4.70
    // Stuart: 3.20 + 1.35 = £4.55
    const optimal = selectOptimalCourier(1.0, 18.00, sampleProviders);
    expect(optimal.providerId).toBe('stuart');
    expect(optimal.estimatedCostGbp).toBe(4.55);
  });
});
