'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  QrCode,
  Truck,
  Loader2,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

export default function MerchantRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    postcode: '',
    cuisine: 'Italian & Pizza',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // 1. Submit user registration to backend API
      const res = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.ownerName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: 'RESTAURANT_OWNER',
        }),
      }).catch(() => null);

      if (res && !res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || 'Registration failed, please check your details');
        setLoading(false);
        return;
      }

      let token: string | null = null;
      let userId: string | null = null;

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        token = data?.data?.token || null;
        userId = data?.data?.user?.id || null;
        if (token) localStorage.setItem('foodai_token', token);
        if (data?.data?.user) localStorage.setItem('foodai_user', JSON.stringify(data.data.user));
      }

      // 2. Automatically onboard and provision the Restaurant entity
      const restaurantSlug = form.restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

      const restRes = await fetch(`${apiUrl}/api/v1/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.restaurantName,
          slug: restaurantSlug,
          description: `Authentic ${form.cuisine} restaurant & takeaway in the UK`,
          addressLine1: form.postcode,
          city: 'Manchester',
          postcode: form.postcode.toUpperCase(),
          phone: form.phone,
          whatsappNumber: form.phone,
          email: form.email,
          cuisineType: [form.cuisine],
          userId: userId || undefined,
        }),
      }).catch(() => null);

      if (restRes && restRes.ok) {
        const restData = await restRes.json().catch(() => ({}));
        const restaurant = restData?.data;
        if (restaurant?.id) {
          localStorage.setItem('foodai_restaurant_id', restaurant.id);
          localStorage.setItem('foodai_restaurant_slug', restaurant.slug);
          localStorage.setItem('foodai_restaurant', JSON.stringify(restaurant));
        }
      } else {
        // Fallback for offline / demo mode
        localStorage.setItem('foodai_restaurant_id', 'res_1');
        localStorage.setItem('foodai_restaurant_name', form.restaurantName);
      }

      toast.success('Restaurant onboarded successfully! Welcome to FoodAI.');
      router.push('/dashboard');
    } catch {
      // In demo mode or offline, navigate to dashboard
      localStorage.setItem('foodai_restaurant_id', 'res_1');
      localStorage.setItem('foodai_restaurant_name', form.restaurantName);
      toast.success('Restaurant account registered successfully!');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              FoodAI <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">MERCHANT</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">Already registered?</span>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Area */}
      <main className="max-w-6xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200 text-xs px-2.5 py-0.5 font-bold">
              14-DAY RISK-FREE TRIAL
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Register Your Restaurant
            </h1>
            <p className="text-sm text-muted-foreground">
              Join hundreds of UK restaurants automating phone orders, table QR menus, and courier dispatch.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Restaurant / Takeaway Name</label>
              <Input
                required
                placeholder="e.g. The Artisan Sourdough Pizza"
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Owner / Manager Full Name</label>
                <Input
                  required
                  placeholder="e.g. Marco Rossi"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Work Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="marco@artisanpizza.co.uk"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">UK Contact Mobile (+44)</label>
                <Input
                  required
                  placeholder="+44 7123 456789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Business Postcode</label>
                <Input
                  required
                  placeholder="e.g. SW1A 1AA"
                  value={form.postcode}
                  onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Primary Cuisine</label>
                <select
                  value={form.cuisine}
                  onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Italian &amp; Pizza</option>
                  <option>Indian &amp; Curry</option>
                  <option>Burgers &amp; Fast Food</option>
                  <option>Japanese &amp; Sushi</option>
                  <option>Chinese &amp; Asian</option>
                  <option>British Pub &amp; Grill</option>
                  <option>Cafe, Bakery &amp; Dessert</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Create Secure Password</label>
                <Input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" disabled={loading} className="w-full font-bold gap-2 h-12 shadow-md shadow-primary/20">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Provisioning Restaurant...
                  </span>
                ) : (
                  <>
                    Complete Registration &amp; Open Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground text-center pt-2">
              By registering, you agree to FoodAI's Merchant Terms of Service and Privacy Policy.
              No upfront credit card required.
            </p>
          </form>
        </div>

        {/* Right Column: Platform Features */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why UK Restaurants Switch</span>
            <h2 className="text-2xl font-black text-foreground">Everything Included Out of the Box</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">AI Voice Phone Ordering</h3>
                <p className="text-xs text-muted-foreground">
                  Never miss an order during dinner rush. Your automated agent answers customer calls, takes orders, and sends WhatsApp payment links.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <QrCode className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">Contactless Table QR Ordering</h3>
                <p className="text-xs text-muted-foreground">
                  Dine-in guests scan table QR codes to view your digital menu and order directly from their phone with zero app download.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">5 UK Couriers Dispatch</h3>
                <p className="text-xs text-muted-foreground">
                  Compare rates across Uber Direct, Stuart, Deliveroo Express, Gophr, and Shipday automatically on every delivery order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground">Weekly Stripe Express UK Payouts</h3>
                <p className="text-xs text-muted-foreground">
                  Money lands in your bank every Friday with transparent platform commission deductions and complete sales reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 FoodAI Platform Ltd. All rights reserved. Registered in England &amp; Wales.
      </footer>
    </div>
  );
}
