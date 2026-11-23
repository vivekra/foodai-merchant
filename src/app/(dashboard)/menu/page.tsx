'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  UtensilsCrossed,
  Check,
  X,
  Loader2,
  DollarSign,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  priceGbp: number;
  available: boolean;
  description?: string;
  dietary: string[];
}

const AVAILABLE_DIETARY = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Spicy'];

export default function MerchantMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restaurantId, setRestaurantId] = useState('');

  // Form State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Pizzas',
    customCategory: '',
    priceGbp: '',
    description: '',
    dietary: [] as string[],
  });

  // Load existing menu from API if available
  useEffect(() => {
    const storedResId = localStorage.getItem('foodai_restaurant_id');
    if (!storedResId) {
      setIsLoading(false);
      return;
    }
    setRestaurantId(storedResId);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/api/v1/menu/${storedResId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          const apiItems: MenuItem[] = [];
          data.data.forEach((cat: any) => {
            if (cat.items && Array.isArray(cat.items)) {
              cat.items.forEach((it: any) => {
                apiItems.push({
                  id: it.id,
                  name: it.name,
                  category: cat.name || 'General',
                  categoryId: cat.id,
                  priceGbp: it.basePrice || 0,
                  available: it.isActive !== false,
                  description: it.description,
                  dietary: it.dietary || [],
                });
              });
            }
          });
          setItems(apiItems);
        }
      })
      .catch(() => {
        // Empty on failure
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const toggleAvailability = async (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const newStatus = !current.available;

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: newStatus } : i))
    );

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('foodai_token');
      await fetch(`${apiUrl}/api/v1/menu/item/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isActive: newStatus }),
      });
    } catch {
      // Optimistic update retained
    }

    toast.success(newStatus ? `"${current.name}" is now In Stock` : `"${current.name}" marked as 86 / Sold Out`);
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('foodai_token');
      await fetch(`${apiUrl}/api/v1/menu/item/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // Local removal
    }

    toast.success(`Removed "${item?.name || 'Dish'}" from menu`);
  };

  const handleDietaryToggle = (tag: string) => {
    setNewDish((prev) => {
      const exists = prev.dietary.includes(tag);
      return {
        ...prev,
        dietary: exists ? prev.dietary.filter((d) => d !== tag) : [...prev.dietary, tag],
      };
    });
  };

  const handleAddDishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) {
      toast.error('Please enter a dish name');
      return;
    }
    const priceNum = parseFloat(newDish.priceGbp);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price in GBP');
      return;
    }

    setIsSubmitting(true);
    const categoryName = newDish.category === 'Custom' ? newDish.customCategory || 'Chef Specials' : newDish.category;

    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      name: newDish.name.trim(),
      category: categoryName,
      priceGbp: Number(priceNum.toFixed(2)),
      available: true,
      description: newDish.description.trim(),
      dietary: newDish.dietary,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('foodai_token');

      // 1. Create category if needed or find existing
      let categoryId = 'cat_1';
      const catRes = await fetch(`${apiUrl}/api/v1/menu/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          restaurantId,
          name: categoryName,
        }),
      }).catch(() => null);

      if (catRes && catRes.ok) {
        const catData = await catRes.json().catch(() => ({}));
        if (catData?.data?.id) categoryId = catData.data.id;
      }

      // 2. Create the menu item
      const itemRes = await fetch(`${apiUrl}/api/v1/menu/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          restaurantId,
          categoryId,
          name: newItem.name,
          description: newItem.description,
          basePrice: newItem.priceGbp,
          dietary: newItem.dietary,
        }),
      }).catch(() => null);

      if (itemRes && itemRes.ok) {
        const itemData = await itemRes.json().catch(() => ({}));
        if (itemData?.data?.id) newItem.id = itemData.data.id;
      }
    } catch {
      // Local fallback in demo mode
    }

    setItems((prev) => [newItem, ...prev]);
    toast.success(`Dish "${newItem.name}" added to menu catalog!`);

    // Reset form and close
    setNewDish({
      name: '',
      category: 'Pizzas',
      customCategory: '',
      priceGbp: '',
      description: '',
      dietary: [],
    });
    setIsSubmitting(false);
    setIsAddModalOpen(false);
  };

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Manage your dishes, real-time 86/stock availability, and GBP prices across AI Voice, QR Table, and Web channels.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 font-bold shadow-md shadow-primary/20">
          <Plus className="h-4 w-4" /> Add New Dish
        </Button>
      </div>

      {/* Catalog Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground font-semibold">Total Dishes</span>
          <p className="text-2xl font-black text-foreground">{items.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground font-semibold">In Stock</span>
          <p className="text-2xl font-black text-emerald-600">{items.filter((i) => i.available).length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground font-semibold">86'd / Sold Out</span>
          <p className="text-2xl font-black text-red-600">{items.filter((i) => !i.available).length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground font-semibold">Categories</span>
          <p className="text-2xl font-black text-foreground">{categories.length}</p>
        </div>
      </div>

      {/* Menu Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Dish &amp; Description</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Price (GBP)</th>
                <th className="px-6 py-3 font-semibold">Dietary</th>
                <th className="px-6 py-3 font-semibold">Availability</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-xs font-semibold">Loading restaurant menu...</p>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto">
                        <UtensilsCrossed className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">No dishes added yet</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Click "Add New Dish" above to create your restaurant's menu offerings.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground text-sm">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-sm mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">£{item.priceGbp.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.dietary.length > 0 ? (
                          item.dietary.map((d) => (
                            <span
                              key={d}
                              className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-400"
                            >
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          item.available
                            ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                        }`}
                      >
                        {item.available ? 'In Stock' : '86 / Sold Out'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Dish Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">Add New Dish</h3>
                <p className="text-xs text-muted-foreground">Add a dish to your menu and AI ordering catalogue</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Dish Name *</label>
                <Input
                  required
                  placeholder="e.g. Quattro Formaggi Sourdough"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pizzas">Pizzas</option>
                    <option value="Pastas">Pastas</option>
                    <option value="Starters & Sides">Starters &amp; Sides</option>
                    <option value="Mains & Grills">Mains &amp; Grills</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                    <option value="Beer & Wine">Beer &amp; Wine</option>
                    <option value="Custom">+ Custom Category</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Price (£ GBP) *</label>
                  <Input
                    required
                    type="number"
                    step="0.05"
                    min="0.50"
                    placeholder="12.50"
                    value={newDish.priceGbp}
                    onChange={(e) => setNewDish({ ...newDish, priceGbp: e.target.value })}
                  />
                </div>
              </div>

              {newDish.category === 'Custom' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-semibold text-muted-foreground">Custom Category Name</label>
                  <Input
                    placeholder="e.g. Chef Specials or Weekend Brunch"
                    value={newDish.customCategory}
                    onChange={(e) => setNewDish({ ...newDish, customCategory: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description / Ingredients</label>
                <textarea
                  rows={3}
                  placeholder="San Marzano tomato sauce, fior di latte mozzarella, gorgonzola..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_DIETARY.map((diet) => {
                    const selected = newDish.dietary.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => handleDietaryToggle(diet)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          selected
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3 inline mr-1" />}
                        {diet}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="font-bold gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving Dish...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Save Dish to Menu
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
