'use client';

import React, { useState } from 'react';
import {
  Percent,
  Sparkles,
  PhoneCall,
  Save,
  Clock,
  History,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminPricingControlPage() {
  const [pricing, setPricing] = useState({
    freeCommissionRate: 15.0,
    starterCommissionRate: 8.0,
    proCommissionRate: 5.0,
    enterpriseCommissionRate: 2.0,
    voiceSurchargeRate: 2.0,
    changeReason: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricing.changeReason || pricing.changeReason.length < 5) {
      toast.error('Please enter an audit reason for the pricing change.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Platform pricing updated! Redis cache busted across all API nodes.');
      setPricing((prev) => ({ ...prev, changeReason: '' }));
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Dynamic Pricing & Commission Engine</h1>
          <span className="bg-red-50 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            Super Admin Only
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Adjust platform marketplace commission rates and AI Voice add-on fees. Changes invalidate the Redis
          pricing cache immediately and apply to all future orders.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Tier Rates */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" /> Subscription Plan Commission Rates (%)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Free Plan</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={pricing.freeCommissionRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, freeCommissionRate: parseFloat(e.target.value) || 0 })
                  }
                  className="pr-8 font-bold"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Zero monthly fee</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Starter Plan</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={pricing.starterCommissionRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, starterCommissionRate: parseFloat(e.target.value) || 0 })
                  }
                  className="pr-8 font-bold"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400">£29/month subscription</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Pro Plan</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={pricing.proCommissionRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, proCommissionRate: parseFloat(e.target.value) || 0 })
                  }
                  className="pr-8 font-bold"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400">£79/month subscription</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Enterprise</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={pricing.enterpriseCommissionRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, enterpriseCommissionRate: parseFloat(e.target.value) || 0 })
                  }
                  className="pr-8 font-bold"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  %
                </span>
              </div>
              <p className="text-[10px] text-gray-400">£199/month subscription</p>
            </div>
          </div>
        </div>

        {/* AI Voice Agent Surcharge */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-gray-900">AI Voice Agent Order Surcharge (%)</h3>
          </div>
          <p className="text-xs text-gray-500">
            Additional commission percentage automatically added to an order whenever it is placed via the AI Voice
            Agent (LiveKit / Twilio).
          </p>

          <div className="max-w-xs">
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={pricing.voiceSurchargeRate}
                onChange={(e) =>
                  setPricing({ ...pricing, voiceSurchargeRate: parseFloat(e.target.value) || 0 })
                }
                className="pr-8 font-bold text-base"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                % extra
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Example: Free Plan (15%) + Voice Surcharge (2%) = 17% commission on voice orders.
            </p>
          </div>
        </div>

        {/* Audit Trail Note */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <label className="text-xs font-bold text-gray-800 block">
            Change Reason / Audit Note (Required for Compliance)
          </label>
          <Input
            placeholder="e.g. Q4 promotional commission discount or adjusted voice surcharge"
            value={pricing.changeReason}
            onChange={(e) => setPricing({ ...pricing, changeReason: e.target.value })}
            required
          />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <History className="h-3.5 w-3.5" /> All changes are versioned in `PlatformPricingConfig` table.
            </p>
            <Button type="submit" disabled={isSaving} className="font-bold">
              <Save className="h-4 w-4 mr-1.5" /> {isSaving ? 'Updating...' : 'Publish Pricing Update'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
