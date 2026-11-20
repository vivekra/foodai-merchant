'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  QrCode,
  MonitorCheck,
  TrendingUp,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui';

const features = [
  {
    icon: PhoneCall,
    title: 'AI Phone Voice Agent',
    description:
      'Never miss a phone order during rush hours. Aria answers calls 24/7, understands British accents and dietary requests, and logs orders straight to your kitchen.',
  },
  {
    icon: QrCode,
    title: 'QR Code Table Ordering',
    description:
      'Turn tables 30% faster. Guests scan unique table QR codes to view your digital menu, order, and pay instantly via Apple Pay or card.',
  },
  {
    icon: MonitorCheck,
    title: 'Live Kitchen Display (KDS)',
    description:
      'Full-screen tablet display with sound alerts and touch controls. Direct synchronization across online, QR, and voice orders.',
  },
  {
    icon: Truck,
    title: 'Multi-Delivery Integration',
    description:
      'Dispatch couriers on-demand across Uber Direct, Stuart, Deliveroo Express, Gophr, and Shipday with smart automated rate-shopping.',
  },
  {
    icon: CreditCard,
    title: 'Instant Stripe Payouts',
    description:
      'Stripe Connect Express UK integration. Direct daily payouts to your UK bank account with low platform commission.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time SaaS Analytics',
    description:
      'Deep insights into customer lifetime value, top-selling dishes, peak dining hours, and delivery carrier speed.',
  },
];

const tiers = [
  {
    name: 'Free Tier',
    price: '£0',
    frequency: 'forever',
    commission: '15% per order',
    description: 'Perfect for small independent cafes and popups testing AI food delivery.',
    features: ['QR Table Ordering', 'Online Web Ordering', 'Standard KDS Support', 'Stripe Connect Payouts'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Starter',
    price: '£29',
    frequency: '/month',
    commission: '8% per order',
    description: 'Ideal for busy local bistros and restaurants looking to scale up takeaway.',
    features: [
      'Everything in Free',
      'AI Voice Agent (100 free mins/mo)',
      'Multi-carrier Delivery Dispatch',
      'Real-time WhatsApp Notifications',
      'Email & Chat Support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '£79',
    frequency: '/month',
    commission: '5% per order',
    description: 'For high-volume restaurants demanding maximum automation and lowest commission.',
    features: [
      'Everything in Starter',
      'Dedicated UK Twilio Phone Number',
      'Unlimited Voice Agent Hours',
      'Custom Delivery API Keys (BYOK)',
      'Dedicated Account Manager',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '£199',
    frequency: '/month',
    commission: '2% per order',
    description: 'Designed for restaurant groups, multi-location franchises, and dark kitchens.',
    features: [
      'Everything in Pro',
      'Multi-branch Central Dashboard',
      'Custom POS Integrations',
      '99.99% SLA & 24/7 Phone Support',
      'Bespoke AI Persona Tuning',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function MerchantLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              FoodAI <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">MERCHANT</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-1.5 font-semibold">
                Start Free <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent -z-10" />
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Restaurant Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          >
            Power Your Restaurant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
              With Autonomous AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Supercharge your kitchen with conversational phone ordering, contactless QR menus, live KDS
            dispatch, and instant Stripe payouts with the lowest commission in the UK.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-bold gap-2 shadow-lg shadow-orange-500/20">
                Start Free Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 font-semibold">
                Explore Demo Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need to Automate Orders</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Engineered specifically for British restaurants, pubs, takeaways, and dark kitchen networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all group"
                >
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Cards */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Transparent, Fair UK Pricing</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              No hidden gateway charges or lock-in contracts. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'border-orange-500 bg-card shadow-xl shadow-orange-500/10 ring-2 ring-orange-500'
                    : 'border-border bg-card shadow-sm'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-lg text-foreground">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold">{tier.price}</span>
                    <span className="text-xs text-muted-foreground">{tier.frequency}</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                    + {tier.commission}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 pb-4 border-b border-border/80">
                    {tier.description}
                  </p>

                  <ul className="mt-4 space-y-2.5 text-xs">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/register" className="mt-8">
                  <Button
                    variant={tier.popular ? 'default' : 'outline'}
                    className="w-full font-semibold"
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© 2025 FoodAI Platform Ltd. London, United Kingdom. Powering modern restaurant operations.</p>
      </footer>
    </div>
  );
}
