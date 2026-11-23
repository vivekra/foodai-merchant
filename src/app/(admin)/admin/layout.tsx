'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Percent,
  Users,
  TrendingUp,
  ArrowLeft,
  ShieldAlert,
  Lock,
  Mail,
  Loader2,
  LogOut,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api-config';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Login form state for unauthenticated visitors
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, [pathname]);

  const checkAdminAuth = () => {
    try {
      const token = localStorage.getItem('foodai_token');
      const userStr = localStorage.getItem('foodai_user');

      if (!token || !userStr) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      const user = JSON.parse(userStr);
      if (user && user.role === 'SUPER_ADMIN') {
        setIsAuthorized(true);
        setAdminUser(user);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const apiUrl = getApiUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
        signal: controller.signal,
      }).catch((err) => {
        console.error('Admin login fetch error:', err);
        return null;
      });

      clearTimeout(timeoutId);

      if (!res) {
        toast.error(`Unable to connect to authentication server at ${apiUrl}. Please check your connection.`);
        setIsLoggingIn(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData?.message || 'Invalid administrator credentials');
        setIsLoggingIn(false);
        return;
      }

      const data = await res.json();
      const user = data?.data?.user;
      const token = data?.data?.token;

      if (!user || user.role !== 'SUPER_ADMIN') {
        toast.error('Access Denied: This account does not possess Super Admin privileges.');
        setIsLoggingIn(false);
        return;
      }

      // Persist authenticated Super Admin session
      localStorage.setItem('foodai_token', token);
      localStorage.setItem('foodai_user', JSON.stringify(user));
      document.cookie = `foodai_token=${token}; path=/; max-age=604800; SameSite=Lax`;

      setAdminUser(user);
      setIsAuthorized(true);
      toast.success('Super Admin authenticated successfully!');
    } catch (err: any) {
      toast.error(err?.name === 'AbortError' ? 'Login request timed out' : 'Authentication service unreachable');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('foodai_token');
    localStorage.removeItem('foodai_user');
    document.cookie = 'foodai_token=; path=/; max-age=0';
    setIsAuthorized(false);
    setAdminUser(null);
    toast.info('Super Admin logged out');
    router.push('/login');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="text-sm font-semibold text-neutral-400">Verifying Super Admin clearance...</p>
      </div>
    );
  }

  // If NOT authorized as Super Admin, show Security Gate Challenge
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col justify-between text-white p-4">
        <header className="max-w-7xl mx-auto w-full py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-600 flex items-center justify-center font-black shadow-lg shadow-red-600/30">
              🛡️
            </div>
            <span className="font-extrabold tracking-tight text-lg">
              FoodAI <span className="text-red-500">SuperAdmin</span>
            </span>
          </div>

          <Link href="/login" className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Merchant Portal
          </Link>
        </header>

        <main className="max-w-md mx-auto w-full my-auto py-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Super Admin Clearance Required</h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This portal is strictly restricted to platform administrators. Sign in with your authorized Super Admin credentials to proceed.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Admin Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    type="email"
                    required
                    placeholder="admin@foodai.co.uk"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoggingIn}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 gap-2 shadow-lg shadow-red-600/30"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying Clearance...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Authenticate Super Admin
                  </>
                )}
              </Button>
            </form>

            <div className="pt-2 text-center border-t border-neutral-800">
              <p className="text-[11px] text-neutral-500">
                Unauthorized access attempts are audited and logged with IP timestamping.
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center py-4 text-xs text-neutral-600">
          © 2026 FoodAI Platform UK Ltd. All rights reserved.
        </footer>
      </div>
    );
  }

  // Super Admin Authenticated View
  const navItems = [
    { label: 'Platform Overview', href: '/admin', icon: TrendingUp },
    { label: 'Restaurants & Verifications', href: '/admin/restaurants', icon: Building2 },
    { label: 'Dynamic Pricing Engine', href: '/admin/pricing', icon: Percent },
    { label: 'User Management', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full sm:w-64 bg-neutral-900 text-white shrink-0 p-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-sm">
              🛡️
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">Super Admin</h2>
              <p className="text-[10px] text-neutral-400">{adminUser?.name || 'Authorized Session'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-800 space-y-2">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors p-2 rounded-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Merchant App
          </Link>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10 font-semibold"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out of Admin
          </button>
        </div>
      </aside>

      {/* Main Admin View */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
