'use client';

import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { toast } from 'sonner';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderNumber: string;
  orderItems: string;
  merchantReply?: string;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    customerName: 'David K.',
    rating: 5,
    comment: 'The Margherita was crispy, hot, and arrived in under 20 mins! Best stonebaked pizza in town.',
    date: '19 Nov 2026',
    orderNumber: '#A104',
    orderItems: '1x Margherita D.O.P., 1x Garlic Bread',
    merchantReply: 'Thank you so much David! We take pride in our 48-hour sourdough ferment.',
  },
  {
    id: 'rev_2',
    customerName: 'Chloe M.',
    rating: 4,
    comment: 'Great pizza, but the driver struggled a bit with our intercom buzzer. Food was delicious though.',
    date: '17 Nov 2026',
    orderNumber: '#A098',
    orderItems: '2x Diavola Spicy Salami',
  },
  {
    id: 'rev_3',
    customerName: 'Marcus B.',
    rating: 5,
    comment: 'Ordered via the AI Voice assistant — genuinely shocked at how smoothly it took my order and sent the WhatsApp link. 10/10!',
    date: '15 Nov 2026',
    orderNumber: '#A082',
    orderItems: '1x Quattro Formaggi, 1x Tiramisu',
  },
];

export default function MerchantReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, merchantReply: text } : r))
    );
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
    toast.success('Reply published to customer review');
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedback & Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your customer ratings, read feedback on food quality, and respond directly to diners.
        </p>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left sm:pr-8 sm:border-r border-gray-100">
          <p className="text-4xl font-extrabold text-gray-900">{avgRating}</p>
          <div className="flex items-center gap-1 justify-center sm:justify-start my-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-gray-400">Based on {reviews.length} recent reviews</p>
        </div>

        <div className="flex-1 w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const pct = Math.round((count / reviews.length) * 100);
            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-medium">
                <span className="w-12 text-gray-500">{stars} Stars</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-gray-900">{r.customerName}</h4>
                <p className="text-[11px] text-gray-400">
                  Order {r.orderNumber} ({r.orderItems}) • {r.date}
                </p>
              </div>
              <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-md text-amber-900 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{r.rating}.0</span>
              </div>
            </div>

            <p className="text-sm text-gray-700">{r.comment}</p>

            {/* Existing Merchant Reply */}
            {r.merchantReply ? (
              <div className="bg-gray-50 border-l-2 border-primary p-3 rounded-r-xl space-y-1 text-xs">
                <p className="font-bold text-gray-900">Your Response:</p>
                <p className="text-gray-600">{r.merchantReply}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write a public response to this review..."
                  value={replyText[r.id] || ''}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [r.id]: e.target.value })
                  }
                  className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary"
                />
                <Button size="sm" onClick={() => handleSendReply(r.id)} className="text-xs h-9">
                  Reply
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
