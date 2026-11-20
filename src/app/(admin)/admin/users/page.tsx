'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Lock,
  UserPlus,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'RESTAURANT_OWNER' | 'RESTAURANT_STAFF' | 'CUSTOMER';
  phone?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'BLOCKED';
}

const SAMPLE_USERS: UserRecord[] = [
  { id: 'usr_1', name: 'Super Admin', email: 'admin@foodai.co.uk', role: 'SUPER_ADMIN', joinedDate: '01 Oct 2026', status: 'ACTIVE' },
  { id: 'usr_2', name: 'Marco Bellini', email: 'marco@artisanpizza.co.uk', role: 'RESTAURANT_OWNER', phone: '+44 161 947 1234', joinedDate: '12 Oct 2026', status: 'ACTIVE' },
  { id: 'usr_3', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: 'CUSTOMER', phone: '+44 7911 123456', joinedDate: '18 Nov 2026', status: 'ACTIVE' },
  { id: 'usr_4', name: 'Kitchen Staff #1', email: 'kitchen@artisanpizza.co.uk', role: 'RESTAURANT_STAFF', joinedDate: '14 Oct 2026', status: 'ACTIVE' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(SAMPLE_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const handleToggleBlock = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    toast.info(`${name} has been marked ${nextStatus}`);
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management & Role Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Oversee all registered accounts, audit permission tiers, and enforce access controls.
          </p>
        </div>
        <Button size="sm" onClick={() => toast.info('Invite admin dialog')} className="text-xs font-bold gap-1">
          <UserPlus className="h-4 w-4" /> Invite Admin
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'SUPER_ADMIN', 'RESTAURANT_OWNER', 'CUSTOMER'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === role ? 'bg-neutral-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role & Access Tier</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Account Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900">{u.name}</div>
                  <div className="text-[11px] text-gray-400">{u.email}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      u.role === 'SUPER_ADMIN'
                        ? 'bg-red-50 text-red-700'
                        : u.role === 'RESTAURANT_OWNER'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{u.phone || '—'}</td>
                <td className="p-4 text-gray-400">{u.joinedDate}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'SUPER_ADMIN' && (
                    <button
                      onClick={() => handleToggleBlock(u.id, u.name, u.status)}
                      className={`text-xs font-semibold hover:underline ${
                        u.status === 'ACTIVE' ? 'text-red-600' : 'text-emerald-600'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Block Account' : 'Unblock'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
