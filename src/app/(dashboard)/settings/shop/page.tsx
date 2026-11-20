'use client';

import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  DollarSign,
  Save,
  Image as ImageIcon,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';

export default function ShopSettingsPage() {
  const [shop, setShop] = useState({
    name: 'The Artisan Italian & Pizza Bar',
    description: 'Authentic stonebaked sourdough pizza, handmade pasta, and fresh drinks in Manchester.',
    addressLine1: '14 Oxford Road',
    city: 'Manchester',
    postcode: 'M1 5QA',
    phone: '+44 161 947 1234',
    whatsappNumber: '+44 7911 888999',
    email: 'hello@artisanpizza.co.uk',
    minOrderGbp: 12.0,
    avgPrepTimeMinutes: 20,
    cuisineTags: 'Italian, Pizza, Sourdough, Pasta',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Restaurant profile updated successfully!');
    }, 500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Profile & Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your public listing details, opening hours, minimum order amount, and contact numbers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" /> Store Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Restaurant Name</label>
              <Input
                value={shop.name}
                onChange={(e) => setShop({ ...shop, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">Cuisine Tags (Comma separated)</label>
              <Input
                value={shop.cuisineTags}
                onChange={(e) => setShop({ ...shop, cuisineTags: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700">Bio / Description</label>
            <textarea
              value={shop.description}
              onChange={(e) => setShop({ ...shop, description: e.target.value })}
              className="mt-1 w-full h-24 p-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Location & Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Street Address</label>
              <Input
                value={shop.addressLine1}
                onChange={(e) => setShop({ ...shop, addressLine1: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">City</label>
              <Input
                value={shop.city}
                onChange={(e) => setShop({ ...shop, city: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">UK Postcode</label>
              <Input
                value={shop.postcode}
                onChange={(e) => setShop({ ...shop, postcode: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-gray-700">Public Phone Number</label>
              <Input
                value={shop.phone}
                onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">WhatsApp Notification Number</label>
              <Input
                value={shop.whatsappNumber}
                onChange={(e) => setShop({ ...shop, whatsappNumber: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Logistics */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Kitchen & Order Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700">Minimum Order (£ GBP)</label>
              <Input
                type="number"
                step="0.5"
                value={shop.minOrderGbp}
                onChange={(e) => setShop({ ...shop, minOrderGbp: parseFloat(e.target.value) || 0 })}
                className="mt-1 font-bold"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700">Average Preparation Time (Mins)</label>
              <Input
                type="number"
                value={shop.avgPrepTimeMinutes}
                onChange={(e) => setShop({ ...shop, avgPrepTimeMinutes: parseInt(e.target.value) || 0 })}
                className="mt-1 font-bold"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="font-bold">
            <Save className="h-4 w-4 mr-1.5" /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
