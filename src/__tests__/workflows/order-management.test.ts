import { describe, it, expect } from 'vitest';

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderTicket {
  id: string;
  orderNumber: string;
  orderType: 'QR_TABLE' | 'VOICE' | 'AI_CHAT' | 'DELIVERY' | 'COLLECTION';
  status: OrderStatus;
  items: { name: string; quantity: number; priceGbp: number }[];
  totalGbp: number;
  tableNumber?: string;
  estimatedPrepTimeMinutes?: number;
}

// Order state transition engine verifying valid restaurant workflows
export function transitionOrderStatus(
  order: OrderTicket,
  newStatus: OrderStatus,
  prepTimeMinutes?: number
): OrderTicket {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
  }

  return {
    ...order,
    status: newStatus,
    ...(prepTimeMinutes ? { estimatedPrepTimeMinutes: prepTimeMinutes } : {}),
  };
}

describe('Order Management Workflow Tests', () => {
  const sampleTicket: OrderTicket = {
    id: 'ord_1',
    orderNumber: '#A104',
    orderType: 'VOICE',
    status: 'PENDING',
    items: [
      { name: 'Margherita D.O.P.', quantity: 2, priceGbp: 11.95 },
      { name: 'Garlic Rosemary Sourdough', quantity: 1, priceGbp: 4.60 },
    ],
    totalGbp: 28.50,
  };

  it('progresses ticket through complete kitchen fulfillment lifecycle', () => {
    // 1. Accept pending order with 20 min estimated kitchen time
    const accepted = transitionOrderStatus(sampleTicket, 'ACCEPTED', 20);
    expect(accepted.status).toBe('ACCEPTED');
    expect(accepted.estimatedPrepTimeMinutes).toBe(20);

    // 2. Kitchen starts cooking / firing oven
    const preparing = transitionOrderStatus(accepted, 'PREPARING');
    expect(preparing.status).toBe('PREPARING');

    // 3. Mark ready on pass for courier / front-of-house
    const ready = transitionOrderStatus(preparing, 'READY');
    expect(ready.status).toBe('READY');

    // 4. Handover to driver / customer
    const completed = transitionOrderStatus(ready, 'COMPLETED');
    expect(completed.status).toBe('COMPLETED');
  });

  it('rejects illegal status skipping (e.g. PENDING straight to COMPLETED)', () => {
    expect(() => {
      transitionOrderStatus(sampleTicket, 'COMPLETED');
    }).toThrow('Invalid status transition from PENDING to COMPLETED');
  });

  it('allows cancellation from PENDING status', () => {
    const cancelled = transitionOrderStatus(sampleTicket, 'CANCELLED');
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('does not allow transitioning from terminal state COMPLETED', () => {
    const completedTicket: OrderTicket = { ...sampleTicket, status: 'COMPLETED' };
    expect(() => {
      transitionOrderStatus(completedTicket, 'PREPARING');
    }).toThrow('Invalid status transition');
  });

  it('correctly filters orders by active tab', () => {
    const orders: OrderTicket[] = [
      { ...sampleTicket, id: '1', status: 'PENDING' },
      { ...sampleTicket, id: '2', status: 'ACCEPTED' },
      { ...sampleTicket, id: '3', status: 'PREPARING' },
      { ...sampleTicket, id: '4', status: 'READY' },
      { ...sampleTicket, id: '5', status: 'PENDING' },
    ];

    const pending = orders.filter((o) => o.status === 'PENDING');
    expect(pending.length).toBe(2);

    const activeKitchen = orders.filter((o) => ['ACCEPTED', 'PREPARING', 'READY'].includes(o.status));
    expect(activeKitchen.length).toBe(3);
  });
});
