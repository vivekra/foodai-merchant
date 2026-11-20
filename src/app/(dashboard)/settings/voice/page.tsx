'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneCall, Sparkles, Bot, PhoneForwarded, Check, History, Play } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';

export default function VoiceAgentSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [personaName, setPersonaName] = useState('Aria');
  const [assignedNumber] = useState('+44 20 7946 0991');

  const previewScript = `"Hello! Thank you for calling Artisan Sourdough Pizza. I'm ${personaName || 'Aria'}, your AI ordering assistant. I can take your food order, check allergen info, or tell you our chef's specials today. What would you like to order?"`;

  const handleSave = () => {
    toast.success('AI Voice Agent preferences saved');
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Voice Agent Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Automate inbound phone orders with OpenAI Realtime API &amp; LiveKit voice technology.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm">
        {/* Toggle Voice Agent */}
        <div className="flex items-center justify-between pb-6 border-b border-border">
          <div className="space-y-1">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Enable Autonomous Inbound Ordering
            </h3>
            <p className="text-xs text-muted-foreground">
              When active, incoming calls to your assigned number are answered by your AI assistant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enabled ? 'bg-orange-600' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Assigned Number */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Assigned Twilio UK Dedicated Phone Number
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <PhoneCall className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                readOnly
                value={assignedNumber}
                className="w-full rounded-xl border border-border bg-muted/60 px-10 py-2.5 text-sm font-mono font-bold text-foreground cursor-not-allowed"
              />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-3 py-2 rounded-xl">
              Verified &amp; Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Print this phone number on your menus, flyers, Google Maps, or forward calls from your landline.
          </p>
        </div>

        {/* Persona Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            AI Persona Name
          </label>
          <div className="relative">
            <Bot className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={personaName}
              onChange={(e) => setPersonaName(e.target.value)}
              placeholder="e.g. Aria, Oliver, Luna"
              className="w-full rounded-xl border border-border bg-card px-10 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            What name should the AI introduce itself with when greeting your guests?
          </p>
        </div>

        {/* Preview Greeting Script */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Inbound Greeting Script Preview
          </label>
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs font-medium text-foreground leading-relaxed italic">
            {previewScript}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Link
            href="/analytics/calls"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <History className="h-4 w-4" /> View AI Voice Call Logs &amp; Recordings
          </Link>
          <Button onClick={handleSave} className="font-bold gap-2">
            <Check className="h-4 w-4" /> Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
