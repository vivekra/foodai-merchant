'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Building2,
  Percent,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Platform Overview', href: '/admin', icon: TrendingUp },
    { label: 'Restaurants & Verifications', href: '/admin/restaurants', icon: Building2 },
    { label: 'Dynamic Pricing Engine', href: '/admin/pricing', icon: Percent },
    { label: 'User Management', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full sm:w-64 bg-neutral-900 text-white shrink-0 p-5 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
          <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-sm">
            🛡️
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight">Super Admin</h2>
            <p className="text-[10px] text-neutral-400">FoodAI Platform UK</p>
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

        <div className="pt-6 border-t border-neutral-800">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Merchant App
          </Link>
        </div>
      </aside>

      {/* Main Admin View */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
