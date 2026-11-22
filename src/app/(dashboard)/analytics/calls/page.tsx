'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Clock,
  Play,
  Pause,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  PhoneIncoming,
  Bot,
  User,
} from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { toast } from 'sonner';

interface CallRecord {
  id: string;
  caller: string;
  timestamp: string;
  duration: string;
  intent: 'ORDER_PLACED' | 'MENU_INQUIRY' | 'HOURS_LOCATION' | 'TRANSFERRED_STAFF';
  orderNumber?: string;
  orderTotal?: string;
  sentiment: 'POSITIVE' | 'NEUTRAL';
  transcript: { role: 'ai' | 'customer'; text: string }[];
}

export default function VoiceAgentCallLogsPage() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const calls: CallRecord[] = [
    {
      id: 'call_1',
      caller: '+44 7911 123456',
      timestamp: 'Today at 19:42',
      duration: '1m 45s',
      intent: 'ORDER_PLACED',
      orderNumber: '#A104',
      orderTotal: '£28.50',
      sentiment: 'POSITIVE',
      transcript: [
        { role: 'ai', text: 'Hello! Thank you for calling Artisan Sourdough Pizza. I am Aria, your AI ordering assistant. What would you like to order today?' },
        { role: 'customer', text: 'Hi Aria, could I get two Margherita D.O.P. pizzas and one garlic rosemary sourdough?' },
        { role: 'ai', text: 'Certainly! Two Margherita D.O.P. pizzas and one garlic rosemary sourdough. Would you like delivery or collection?' },
        { role: 'customer', text: 'Collection please in about 20 minutes.' },
        { role: 'ai', text: 'Perfect. Your total is £28.50. I have texted a secure WhatsApp checkout link to this phone number to confirm your order #A104.' },
      ],
    },
    {
      id: 'call_2',
      caller: '+44 7822 998811',
      timestamp: 'Today at 19:15',
      duration: '0m 52s',
      intent: 'MENU_INQUIRY',
      sentiment: 'POSITIVE',
      transcript: [
        { role: 'ai', text: 'Hello! Thank you for calling Artisan Sourdough Pizza. How can I help you today?' },
        { role: 'customer', text: 'Do you have gluten free pizza dough available tonight?' },
        { role: 'ai', text: 'Yes, we prepare fresh gluten-free sourdough bases every morning! It is available on all 12-inch pizzas for a £2 surcharge.' },
        { role: 'customer', text: 'Wonderful, thank you!' },
      ],
    },
    {
      id: 'call_3',
      caller: '+44 7700 900222',
      timestamp: 'Today at 18:30',
      duration: '2m 10s',
      intent: 'ORDER_PLACED',
      orderNumber: '#A098',
      orderTotal: '£34.00',
      sentiment: 'POSITIVE',
      transcript: [
        { role: 'ai', text: 'Welcome to Artisan Sourdough Pizza! What can I get started for you?' },
        { role: 'customer', text: 'I want to order a Diavola Hot Honey and a Truffle Wild Mushroom pizza.' },
        { role: 'ai', text: 'Great choices! Adding Diavola Hot Honey and Truffle Mushroom. Would you like any drinks or desserts with that?' },
        { role: 'customer', text: 'Two blood orange San Pellegrinos as well.' },
        { role: 'ai', text: 'Order confirmed! Total is £34.00. Payment link sent via SMS.' },
      ],
    },
    {
      id: 'call_4',
      caller: '+44 7450 112233',
      timestamp: 'Today at 17:50',
      duration: '0m 38s',
      intent: 'HOURS_LOCATION',
      sentiment: 'NEUTRAL',
      transcript: [
        { role: 'ai', text: 'Artisan Pizza Bar, how can I assist you?' },
        { role: 'customer', text: 'Are you open till 11pm tonight?' },
        { role: 'ai', text: 'We are open until 10:30 PM tonight for dining in, and delivery orders are accepted until 11:00 PM.' },
      ],
    },
  ];

  const toggleAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      toast.info('Simulating audio call recording playback');
    }
  };

  const filteredCalls = calls.filter((c) =>
    c.caller.includes(searchQuery) || (c.orderNumber && c.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/settings/voice"
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Voice Call Recordings &amp; Logs</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-7">
            Auditable conversation logs, transcriptions, and automated order extractions handled by Aria.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Calls Handled Today</span>
            <PhoneIncoming className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-2xl font-black text-foreground">42</p>
          <span className="text-xs text-emerald-600 font-semibold">100% automated (0 dropped)</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Voice Order Conversions</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-foreground">31 Orders</p>
          <span className="text-xs text-purple-600 font-semibold">73.8% conversion rate</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Avg Call Duration</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-foreground">1m 18s</p>
          <span className="text-xs text-muted-foreground font-semibold">Industry avg: 3m 45s</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>AI Voice Revenue</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-foreground">£894.20</p>
          <span className="text-xs text-emerald-600 font-semibold">+2% surcharge accounted</span>
        </div>
      </div>

      {/* Main Table and Transcript Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Calls */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search phone number or order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {filteredCalls.length} calls logged
            </span>
          </div>

          <div className="divide-y divide-border">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  selectedCall?.id === call.id ? 'bg-orange-500/10' : 'hover:bg-muted/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{call.caller}</span>
                    {call.orderNumber && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px] font-bold">
                        {call.orderNumber} ({call.orderTotal})
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{call.timestamp}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {call.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudio(call.id);
                    }}
                    className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all ${
                      playingId === call.id
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                    }`}
                  >
                    {playingId === call.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1 h-8"
                    onClick={() => setSelectedCall(call)}
                  >
                    <FileText className="h-3.5 w-3.5" /> Transcript
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript Details Panel */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          {selectedCall ? (
            <div className="space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-foreground">Call Transcript</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedCall.caller} • {selectedCall.timestamp}
                  </p>
                </div>
                {selectedCall.orderNumber && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs font-bold">
                    Order Created: {selectedCall.orderNumber}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {selectedCall.transcript.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      msg.role === 'ai'
                        ? 'bg-purple-500/10 border border-purple-200 dark:border-purple-900/40 text-foreground'
                        : 'bg-muted/50 border border-border text-foreground ml-4'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-muted-foreground">
                      {msg.role === 'ai' ? (
                        <>
                          <Bot className="h-3.5 w-3.5 text-purple-600" />
                          <span className="text-purple-600 font-extrabold">Aria (Voice Agent)</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3.5 w-3.5 text-foreground" />
                          <span>Customer</span>
                        </>
                      )}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <PhoneCall className="h-8 w-8 mx-auto text-muted-foreground/60" />
              <h3 className="font-bold text-sm text-foreground">Select a Call</h3>
              <p className="text-xs text-muted-foreground">
                Click on any phone call record to view the dialogue transcript and order generation events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
