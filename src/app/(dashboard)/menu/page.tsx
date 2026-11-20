'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, UtensilsCrossed, Check } from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceGbp: number;
  available: boolean;
  dietary: string[];
}

export default function MerchantMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([
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
      name: 'Truffle & Wild Mushroom',
      category: 'Pizzas',
      priceGbp: 14.5,
      available: true,
      dietary: ['Vegetarian'],
    },
    {
      id: 'item_4',
      name: 'Beef Shin Ragu Tagliatelle',
      category: 'Pastas',
      priceGbp: 15.5,
      available: false,
      dietary: [],
    },
  ]);

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
    toast.success('Item availability toggled');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Manage your dishes, real-time 86/stock availability, and prices.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add New Dish
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Dish</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Price</th>
                <th className="px-6 py-3 font-semibold">Dietary</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-semibold text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 font-bold text-foreground">£{item.priceGbp.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {item.dietary.map((d) => (
                        <Badge key={d} variant="secondary" className="text-[10px]">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.available
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {item.available ? 'In Stock' : '86 / Sold Out'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Edit3 className="h-4 w-4 inline" />
                    </button>
                    <button className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
