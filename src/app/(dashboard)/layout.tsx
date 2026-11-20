'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  Settings,
  PhoneCall,
  QrCode,
  Truck,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Star,
  DollarSign,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);

  // Live order badge count
  const liveOrderCount = 4;

  const navLinks = [
    {
      label: 'Live Orders',
      href: '/orders',
      icon: ShoppingBag,
      badge: liveOrderCount > 0 ? liveOrderCount : undefined,
    },
    { label: 'Menu Catalog', href: '/menu', icon: UtensilsCrossed },
    { label: 'Analytics & Reports', href: '/analytics', icon: BarChart3 },
    { label: 'Customer Reviews', href: '/reviews', icon: Star },
    { label: 'Revenue & Payouts', href: '/payouts', icon: DollarSign },
  ];

  const settingLinks = [
    { label: 'Store Profile', href: '/settings/shop', icon: Store },
    { label: 'Delivery Dispatch', href: '/settings/delivery', icon: Truck },
    { label: 'AI Voice Agent', href: '/settings/voice', icon: PhoneCall },
    { label: 'Table QR Generator', href: '/settings/qr', icon: QrCode },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-black text-sm">
            🍽️
          </div>
          <span className="font-bold text-base tracking-tight text-gray-900">FoodAI Merchant</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Restaurant Management
            </p>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        isActive ? 'bg-white text-primary' : 'bg-orange-600 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center justify-between px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-900"
            >
              <span>Configuration</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
            </button>
            {settingsOpen &&
              settingLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </div>

          {/* Super Admin Switcher Link */}
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Super Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Footer Account */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
              AP
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-gray-900 truncate">The Artisan Pizza Bar</p>
              <p className="text-[11px] text-gray-400 truncate">Manchester Central #01</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
              🍽️
            </div>
            <span className="font-bold text-sm text-gray-900">FoodAI Merchant</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-2 z-20">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span>{item.label}</span>
                {item.badge && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {settingLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center p-2 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-50"
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center p-2 rounded-lg text-xs font-bold text-red-600 bg-red-50"
            >
              Super Admin Portal
            </Link>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
