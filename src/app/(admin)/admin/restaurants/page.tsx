'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

interface RestaurantItem {
  id: string;
  name: string;
  city: string;
  postcode: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  appliedDate: string;
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  aiVoiceEnabled: boolean;
  stripeConnected: boolean;
}

const SAMPLE_RESTAURANTS: RestaurantItem[] = [
  {
    id: 'res_1',
    name: 'The Rustic Smokehouse',
    city: 'Manchester',
    postcode: 'M4 1LE',
    ownerName: 'James Wilson',
    ownerEmail: 'james@rusticsmokehouse.co.uk',
    phone: '+44 161 888 2345',
    appliedDate: '20 Nov 2026',
    status: 'PENDING',
    plan: 'STARTER',
    aiVoiceEnabled: true,
    stripeConnected: true,
  },
  {
    id: 'res_2',
    name: 'The Artisan Italian & Pizza Bar',
    city: 'Manchester',
    postcode: 'M1 5QA',
    ownerName: 'Marco Bellini',
    ownerEmail: 'marco@artisanpizza.co.uk',
    phone: '+44 161 947 1234',
    appliedDate: '12 Oct 2026',
    status: 'VERIFIED',
    plan: 'PRO',
    aiVoiceEnabled: true,
    stripeConnected: true,
  },
  {
    id: 'res_3',
    name: 'Bombay Spice Kitchen',
    city: 'Birmingham',
    postcode: 'B1 1BB',
    ownerName: 'Rajesh Patel',
    ownerEmail: 'rajesh@bombayspice.co.uk',
    phone: '+44 121 555 4321',
    appliedDate: '01 Nov 2026',
    status: 'VERIFIED',
    plan: 'FREE',
    aiVoiceEnabled: false,
    stripeConnected: true,
  },
];

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(SAMPLE_RESTAURANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');

  const handleVerify = (id: string, name: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'VERIFIED' } : r))
    );
    toast.success(`${name} has been verified! Automated welcome email sent to owner.`);
  };

  const handleSuspend = (id: string, name: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'SUSPENDED' } : r))
    );
    toast.error(`${name} has been temporarily suspended.`);
  };

  const filtered = restaurants.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (
      searchQuery &&
      !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Registrations & Oversight</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review onboarding submissions, verify business licenses, inspect Stripe Connect status, and manage partner access.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by restaurant name, city, or postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'VERIFIED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Location</th>
                <th className="p-4">Owner & Contact</th>
                <th className="p-4">Plan & Add-ons</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    <div>{r.name}</div>
                    <span className="text-[10px] text-gray-400 font-normal">Registered {r.appliedDate}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-800">
                      <MapPin className="h-3 w-3 text-gray-400" /> {r.city}, {r.postcode}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{r.ownerName}</div>
                    <div className="text-[11px] text-gray-400">{r.ownerEmail}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px] mr-1.5">
                      {r.plan}
                    </span>
                    {r.aiVoiceEnabled && (
                      <span className="bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                        🎙️ Voice
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {r.status === 'VERIFIED' ? (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : r.status === 'PENDING' ? (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold text-[10px] w-fit">
                        Pending Approval
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold text-[10px] w-fit">
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {r.status === 'PENDING' ? (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(r.id, r.name)}
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Verify & Activate
                      </Button>
                    ) : r.status === 'VERIFIED' ? (
                      <button
                        onClick={() => handleSuspend(r.id, r.name)}
                        className="text-red-600 hover:underline text-xs font-semibold"
                      >
                        Suspend
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(r.id, r.name)}
                        className="text-xs h-8"
                      >
                        Re-activate
                      </Button>
                    )}
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
