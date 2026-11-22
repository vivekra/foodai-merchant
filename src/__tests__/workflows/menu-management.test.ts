import { describe, it, expect } from 'vitest';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceGbp: number;
  available: boolean;
  description?: string;
  dietary: string[];
}

export function toggleItem86Stock(items: MenuItem[], itemId: string): MenuItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, available: !item.available } : item
  );
}

export function addNewMenuItem(
  items: MenuItem[],
  input: {
    name: string;
    category: string;
    priceGbp: number;
    description?: string;
    dietary: string[];
  }
): MenuItem[] {
  if (!input.name.trim()) throw new Error('Dish name is required');
  if (isNaN(input.priceGbp) || input.priceGbp <= 0) throw new Error('Valid GBP price is required');

  const newItem: MenuItem = {
    id: `item_${Date.now()}`,
    name: input.name.trim(),
    category: input.category || 'General',
    priceGbp: Number(input.priceGbp.toFixed(2)),
    available: true,
    description: input.description,
    dietary: input.dietary || [],
  };

  return [newItem, ...items];
}

export function deleteMenuItem(items: MenuItem[], itemId: string): MenuItem[] {
  return items.filter((item) => item.id !== itemId);
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

  it('adds a new dish to the menu catalog with dietary and GBP pricing', () => {
    const updated = addNewMenuItem(initialMenu, {
      name: 'Truffle Arancini',
      category: 'Starters & Sides',
      priceGbp: 7.50,
      description: 'Crispy Sicilian risotto balls with black truffle and mozzarella center',
      dietary: ['Vegetarian'],
    });

    expect(updated.length).toBe(4);
    expect(updated[0].name).toBe('Truffle Arancini');
    expect(updated[0].category).toBe('Starters & Sides');
    expect(updated[0].priceGbp).toBe(7.50);
    expect(updated[0].available).toBe(true);
    expect(updated[0].dietary).toContain('Vegetarian');
  });

  it('rejects adding a dish with missing name or invalid price', () => {
    expect(() =>
      addNewMenuItem(initialMenu, {
        name: '',
        category: 'Pizzas',
        priceGbp: 12.00,
        dietary: [],
      })
    ).toThrow('Dish name is required');

    expect(() =>
      addNewMenuItem(initialMenu, {
        name: 'Garlic Bread',
        category: 'Sides',
        priceGbp: -3.00,
        dietary: [],
      })
    ).toThrow('Valid GBP price is required');
  });

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

  it('deletes a dish from the menu catalogue', () => {
    const afterDelete = deleteMenuItem(initialMenu, 'item_2');
    expect(afterDelete.length).toBe(2);
    expect(afterDelete.find((i) => i.id === 'item_2')).toBeUndefined();
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
      const formatted = `£${dish.priceGbp.toFixed(2)}`;
      expect(formatted).toMatch(/^£\d+\.\d{2}$/);
    });
  });
});
