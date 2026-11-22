'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  UtensilsCrossed,
  QrCode,
  Truck,
  PhoneCall,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function MerchantDashboardOverviewPage() {
  const stats = [
    {
      title: "Today's Revenue",
      value: '£482.50',
      change: '+14% vs yesterday',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Active Orders',
      value: '4 Live',
      change: '2 Cooking, 1 Out, 1 Pending',
      trend: 'neutral',
      icon: ShoppingBag,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40',
    },
    {
      title: 'Avg Kitchen Prep Time',
      value: '18 mins',
      change: 'Target < 25 mins',
      trend: 'up',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Customer Rating',
      value: '4.9 ★',
      change: 'From 128 verified orders',
      trend: 'up',
      icon: Star,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  const quickActions = [
    {
      title: 'Live Order Terminal',
      description: 'Manage active kitchen tickets and courier dispatch',
      href: '/orders',
      icon: ShoppingBag,
      badge: '4 Active',
      badgeColor: 'bg-orange-600 text-white',
    },
    {
      title: 'Menu Catalog & 86ing',
      description: 'Edit prices, modifier groups, and toggle item stock',
      href: '/menu',
      icon: UtensilsCrossed,
    },
    {
      title: 'Table QR Generator',
      description: 'Generate and print branded dine-in table QR codes',
      href: '/settings/qr',
      icon: QrCode,
    },
    {
      title: 'AI Phone Voice Agent',
      description: 'Configure automated phone ordering & conversational AI',
      href: '/settings/voice',
      icon: PhoneCall,
      badge: 'Live',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      title: 'UK Courier Dispatch',
      description: 'Configure Uber Direct, Stuart, Deliveroo Express & Gophr',
      href: '/settings/delivery',
      icon: Truck,
    },
    {
      title: 'Stripe Payouts',
      description: 'Track weekly Friday payouts and net fee deductions',
      href: '/payouts',
      icon: DollarSign,
    },
  ];

  const recentOrders = [
    {
      id: '#A104',
      type: 'Voice AI Order',
      items: '2x Margherita D.O.P., 1x Garlic Rosemary Sourdough',
      amount: '£28.50',
      status: 'Pending Acceptance',
      time: '2 mins ago',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    },
    {
      id: '#A103',
      type: 'Table 4 Dine-In QR',
      items: '1x Diavola Hot Honey, 1x Truffle Mushroom',
      amount: '£34.00',
      status: 'Accepted by Kitchen',
      time: '8 mins ago',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    {
      id: '#A102',
      type: 'UK Courier Delivery',
      items: '1x Slow-Cooked Beef Shin Ragu, 1x Tiramisu',
      amount: '£19.95',
      status: 'Cooking & Preparing',
      time: '15 mins ago',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Merchant Operations Hub
            </h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs px-2.5 py-0.5 gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE &amp; TAKING ORDERS
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            The Artisan Italian &amp; Pizza Bar — Store ID: <span className="font-mono text-foreground font-semibold">res_the_artisan</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/orders">
            <Button size="lg" className="font-bold gap-2 bg-primary shadow-md shadow-primary/20">
              <ShoppingBag className="h-4 w-4" /> Open Live Order Screen
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Management Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    {action.badge && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Open Module</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Recent Live Orders</h3>
            <p className="text-xs text-muted-foreground">Orders synchronized via WebSocket in real-time</p>
          </div>
          <Link href="/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View All Orders <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-muted/20 gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-foreground">{order.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${order.color}`}>
                    {order.type}
                  </span>
                  <span className="text-xs text-muted-foreground">• {order.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{order.items}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="font-black text-sm text-foreground">{order.amount}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-background border border-border text-foreground">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
