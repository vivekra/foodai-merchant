'use client';

import React from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function MerchantPayoutsPage() {
  const payoutHistory = [
    { id: 'po_102', date: '15 Nov 2026', grossGbp: 3420.5, feeGbp: 273.64, netGbp: 3146.86, status: 'PAID' },
    { id: 'po_101', date: '08 Nov 2026', grossGbp: 2890.0, feeGbp: 231.2, netGbp: 2658.8, status: 'PAID' },
    { id: 'po_100', date: '01 Nov 2026', grossGbp: 3105.0, feeGbp: 248.4, netGbp: 2856.6, status: 'PAID' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Stripe Connect Payouts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track customer payments, platform commission deductions, and automated weekly bank payouts.
        </p>
      </div>

      {/* Stripe Connected Status Banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-950">Stripe Connect Account Active</h4>
            <p className="text-xs text-emerald-700">Bank payouts transfer automatically every Friday to Barclays •••• 4012</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-white border-emerald-200 text-emerald-800 text-xs font-semibold">
          View Stripe Dashboard
        </Button>
      </div>

      {/* Current Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold">Pending Next Payout (Friday)</span>
          <p className="text-2xl font-black text-gray-900">£1,420.50</p>
          <p className="text-[11px] text-emerald-600 font-medium">Estimated arrival in 3 days</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold">Total Net Earnings (This Month)</span>
          <p className="text-2xl font-black text-gray-900">£8,662.26</p>
          <p className="text-[11px] text-gray-400">After platform commission & delivery fees</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold">Active Plan Commission</span>
          <p className="text-2xl font-black text-primary">8.0%</p>
          <p className="text-[11px] text-gray-400">Starter Plan Tier (Super Admin set)</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900">Payout History (GBP)</h3>
          <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
            <Download className="h-3.5 w-3.5" /> Export Statements
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Payout Date</th>
                <th className="p-4">Gross Sales</th>
                <th className="p-4">Commission & Fees</th>
                <th className="p-4">Net Transferred</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {payoutHistory.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{po.date}</td>
                  <td className="p-4">£{po.grossGbp.toFixed(2)}</td>
                  <td className="p-4 text-red-600">-£{po.feeGbp.toFixed(2)}</td>
                  <td className="p-4 font-bold text-gray-900">£{po.netGbp.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
