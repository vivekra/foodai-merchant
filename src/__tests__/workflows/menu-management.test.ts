import { describe, it, expect } from 'vitest';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceGbp: number;
  available: boolean;
  dietary: string[];
}

export function toggleItem86Stock(items: MenuItem[], itemId: string): MenuItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, available: !item.available } : item
  );
}

export function calculateCategoryStats(items: MenuItem[]) {
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const totalDishes = items.length;
  const inStock = items.filter((i) => i.available).length;
  const outOfStock = totalDishes - inStock;

  return {
    categories,
    totalDishes,
    inStock,
    outOfStock,
  };
}

describe('Menu Management Workflow Tests', () => {
  const initialMenu: MenuItem[] = [
    {
      id: 'item_1',
      name: 'Margherita D.O.P.',
      category: 'Pizzas',
      priceGbp: 11.95,
      available: true,
      dietary: ['Vegetarian'],
    },
    {
      id: 'item_2',
      name: 'Diavola Hot Honey',
      category: 'Pizzas',
      priceGbp: 13.95,
      available: true,
      dietary: ['Spicy'],
    },
    {
      id: 'item_3',
      name: 'Beef Shin Ragu Tagliatelle',
      category: 'Pastas',
      priceGbp: 15.50,
      available: false,
      dietary: [],
    },
  ];

  it('toggles item 86/stock availability in real time', () => {
    // 86 the Margherita
    const updated = toggleItem86Stock(initialMenu, 'item_1');
    const margherita = updated.find((i) => i.id === 'item_1');
    expect(margherita?.available).toBe(false);

    // Bring Beef Shin Ragu back in stock
    const restored = toggleItem86Stock(updated, 'item_3');
    const ragu = restored.find((i) => i.id === 'item_3');
    expect(ragu?.available).toBe(true);
  });

  it('accurately computes catalog inventory breakdown', () => {
    const stats = calculateCategoryStats(initialMenu);
    expect(stats.categories).toEqual(['Pizzas', 'Pastas']);
    expect(stats.totalDishes).toBe(3);
    expect(stats.inStock).toBe(2);
    expect(stats.outOfStock).toBe(1);
  });

  it('validates GBP pricing precision and currency', () => {
    initialMenu.forEach((dish) => {
      expect(dish.priceGbp).toBeGreaterThan(0);
      expect(typeof dish.priceGbp).toBe('number');
      // Format as standard GBP currency string
      const formatted = `£${dish.priceGbp.toFixed(2)}`;
      expect(formatted).toMatch(/^£\d+\.\d{2}$/);
    });
  });
});
