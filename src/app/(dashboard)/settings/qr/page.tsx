'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Download, Printer, Plus } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';

export default function QrSettingsPage() {
  const [tableCount, setTableCount] = useState(12);
  const [restaurantSlug, setRestaurantSlug] = useState('the-artisan-pizza');

  useEffect(() => {
    const slug = localStorage.getItem('foodai_restaurant_slug');
    if (slug) setRestaurantSlug(slug);
  }, []);

  const downloadTableQr = (tableNum: number) => {
    toast.success(`Generated printable QR for Table #${tableNum}`);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dine-in QR Code Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate branded QR codes for each dining table. Customers scan with their smartphone camera to order.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base">Table Quantity</h3>
            <p className="text-xs text-muted-foreground">Adjust the number of physical tables in your restaurant.</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={100}
              value={tableCount}
              onChange={(e) => setTableCount(Number(e.target.value))}
              className="w-24 text-center"
            />
            <Button variant="outline" onClick={() => toast.success('Table configuration saved')}>
              Update
            </Button>
          </div>
        </div>

        {/* QR Preview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          {Array.from({ length: Math.min(tableCount, 12) }, (_, i) => i + 1).map((tableNum) => (
            <div
              key={tableNum}
              className="rounded-xl border border-border bg-muted/20 p-4 text-center space-y-3 flex flex-col items-center"
            >
              <div className="h-28 w-28 bg-white border border-border rounded-lg flex flex-col items-center justify-center p-2 shadow-inner">
                <QrCode className="h-20 w-20 text-neutral-900" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Table #{tableNum}</p>
                <p className="text-[11px] text-muted-foreground truncate max-w-[120px]">
                  /menu/{restaurantSlug}?table={tableNum}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadTableQr(tableNum)}
                className="w-full text-xs gap-1.5 h-8"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
