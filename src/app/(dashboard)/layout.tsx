'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  PhoneCall,
  QrCode,
  Truck,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Star,
  DollarSign,
  Store,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [restaurantName, setRestaurantName] = useState('Restaurant Portal');
  const [userInitials, setUserInitials] = useState('RP');

  useEffect(() => {
    // 1. Verify user authentication session
    const token = localStorage.getItem('foodai_token');
    const userStr = localStorage.getItem('foodai_user');

    if (!token || !userStr) {
      router.replace('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    } catch {
      localStorage.removeItem('foodai_token');
      localStorage.removeItem('foodai_user');
      router.replace('/login');
      return;
    }

    // 2. Load restaurant profile info
    const storedName = localStorage.getItem('foodai_restaurant_name');
    if (storedName) {
      setRestaurantName(storedName);
      const initials = storedName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      setUserInitials(initials || 'RP');
    }

    setIsAuthChecking(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('foodai_token');
    localStorage.removeItem('foodai_user');
    localStorage.removeItem('foodai_restaurant_id');
    localStorage.removeItem('foodai_restaurant_name');
    localStorage.removeItem('foodai_restaurant_slug');
    document.cookie = 'foodai_token=; path=/; max-age=0; SameSite=Lax';
    toast.info('Signed out successfully');
    router.replace('/login');
  };

  // If still verifying auth, show a secure loading barrier
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg animate-pulse shadow-lg shadow-orange-500/20">
          🍽️
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
          <span>Verifying merchant session...</span>
        </div>
      </div>
    );
  }

  // Live order badge count
  const liveOrderCount = 4;

  const navLinks = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
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

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-black text-sm shadow-sm">
            🍽️
          </div>
          <div className="leading-tight">
            <span className="font-bold text-base tracking-tight text-gray-900 block">FoodAI</span>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase block">Merchant Portal</span>
          </div>
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
                      ? 'bg-orange-600 text-white shadow-sm'
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
                        isActive ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'
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
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </div>

          {/* Super Admin Switcher Link - STRICTLY restricted to Super Admin role */}
          {isSuperAdmin && (
            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Super Admin Portal</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Account & Sign Out */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xs">
              {userInitials}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-gray-900 truncate">{restaurantName}</p>
              <p className="text-[11px] text-gray-400 truncate">{currentUser?.email || 'Active Session'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
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
                {item.badge && <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
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
            {isSuperAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center p-2 rounded-lg text-xs font-bold text-red-600 bg-red-50"
              >
                Super Admin Portal
              </Link>
            )}
            <div className="h-px bg-gray-100 my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
