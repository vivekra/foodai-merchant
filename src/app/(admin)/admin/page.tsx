'use client';

import React from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  PhoneCall,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const stats = [
    { label: 'Total GMV (Platform Volume)', value: '£384,920', change: '+18.4% this month', icon: DollarSign },
    { label: 'Platform Net Commission', value: '£42,810', change: 'Avg 11.1% cut', icon: TrendingUp },
    { label: 'Onboarded Restaurants', value: '142', change: 'Across 18 UK cities', icon: Building2 },
    { label: 'AI Voice Orders Placed', value: '1,840', change: '8.4% of total orders', icon: PhoneCall },
  ];

  const recentRegistrations = [
    { name: 'The Rustic Smokehouse', city: 'Manchester', date: 'Today, 03:14', status: 'PENDING_VERIFICATION' },
    { name: 'Sushi Katsu & Bar', city: 'Birmingham', date: 'Yesterday', status: 'VERIFIED' },
    { name: 'Napoli Woodfire Pizzas', city: 'Bristol', date: '2 days ago', status: 'VERIFIED' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics & Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          High-level metrics across all 1000+ UK restaurants, platform revenue, and live order throughput.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-semibold">{s.label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> {s.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Verification Queue & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">Pending Restaurant Verifications</h3>
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
              1 Action Required
            </span>
          </div>

          <div className="space-y-3">
            {recentRegistrations.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs text-gray-800">{r.name}</h4>
                  <p className="text-[11px] text-gray-400">{r.city} • Applied {r.date}</p>
                </div>
                {r.status === 'PENDING_VERIFICATION' ? (
                  <button className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-primary/90">
                    Review & Verify
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Active
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Delivery Courier Distribution</h3>
          <p className="text-xs text-gray-500">Live order breakdown across enabled UK couriers.</p>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Uber Direct', share: 44, color: 'bg-black' },
              { name: 'Deliveroo Express', share: 28, color: 'bg-teal-500' },
              { name: 'Stuart', share: 18, color: 'bg-blue-600' },
              { name: 'Gophr / Shipday', share: 10, color: 'bg-amber-500' },
            ].map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{c.name}</span>
                  <span>{c.share}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color}`} style={{ width: `${c.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
