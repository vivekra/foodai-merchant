'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';

export default function MerchantLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => null);

      if (res && !res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        const token = data?.data?.token;
        const user = data?.data?.user;

        if (token) localStorage.setItem('foodai_token', token);
        if (user) localStorage.setItem('foodai_user', JSON.stringify(user));

        // Fetch user profile to retrieve linked restaurantId
        if (token) {
          const meRes = await fetch(`${apiUrl}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => null);

          if (meRes && meRes.ok) {
            const meData = await meRes.json().catch(() => ({}));
            const restaurantUser = meData?.data?.user?.restaurantUsers?.[0];
            if (restaurantUser?.restaurantId) {
              localStorage.setItem('foodai_restaurant_id', restaurantUser.restaurantId);
            }
          }
        }
      }

      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch {
      toast.success('Welcome back!');
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
            <span className="text-muted-foreground hidden sm:inline">New to FoodAI?</span>
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register Restaurant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Merchant Sign In
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter your credentials to access your restaurant operations dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="manager@restaurant.co.uk"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" disabled={loading} className="w-full font-bold gap-2 h-11 shadow-md shadow-primary/20">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                  </span>
                ) : (
                  <>
                    Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account yet?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Start 14-Day Free Trial
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 FoodAI Platform Ltd. All rights reserved.
      </footer>
    </div>
  );
}
