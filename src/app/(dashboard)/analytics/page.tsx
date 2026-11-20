'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, PoundSterling, ShoppingBag, Sparkles } from 'lucide-react';

const revenueData = [
  { day: 'Mon', revenue: 640, voiceOrders: 120 },
  { day: 'Tue', revenue: 780, voiceOrders: 180 },
  { day: 'Wed', revenue: 920, voiceOrders: 210 },
  { day: 'Thu', revenue: 1100, voiceOrders: 290 },
  { day: 'Fri', revenue: 1850, voiceOrders: 480 },
  { day: 'Sat', revenue: 2300, voiceOrders: 650 },
  { day: 'Sun', revenue: 1640, voiceOrders: 410 },
];

export default function MerchantAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales &amp; AI Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track sales performance, AI voice conversions, and delivery breakdown.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Weekly Revenue</span>
            <PoundSterling className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">£9,230</p>
          <span className="text-xs text-green-600 font-semibold">+18.4% vs last week</span>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">398</p>
          <span className="text-xs text-green-600 font-semibold">+12% new customers</span>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>AI Voice Orders</span>
            <Sparkles className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">112</p>
          <span className="text-xs text-purple-600 font-semibold">28% of all phone calls</span>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Platform Commission</span>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">5.0%</p>
          <span className="text-xs text-muted-foreground">Pro Tier active</span>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground">Revenue Trend (GBP)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
