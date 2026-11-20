'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bike,
  QrCode,
  PhoneCall,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { toast } from 'sonner';

type OrderTab = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED';

interface OrderItem {
  name: string;
  quantity: number;
  selectedSize?: string;
  addons?: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  orderType: 'QR_TABLE' | 'VOICE' | 'AI_CHAT' | 'DELIVERY' | 'COLLECTION';
  status: OrderTab;
  items: OrderItem[];
  totalGbp: number;
  createdAt: string;
  tableNumber?: string;
  customerName: string;
  customerPhone?: string;
}

export default function MerchantOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>('PENDING');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_1',
      orderNumber: '#A104',
      orderType: 'VOICE',
      status: 'PENDING',
      customerName: 'Sarah Jenkins',
      customerPhone: '+447911123456',
      totalGbp: 28.5,
      createdAt: '2 mins ago',
      items: [
        { name: 'Margherita D.O.P.', quantity: 2 },
        { name: 'Garlic Rosemary Sourdough', quantity: 1 },
      ],
    },
    {
      id: 'ord_2',
      orderNumber: '#A103',
      orderType: 'QR_TABLE',
      tableNumber: '4',
      status: 'ACCEPTED',
      customerName: 'Table 4 (Guest)',
      totalGbp: 34.0,
      createdAt: '8 mins ago',
      items: [
        { name: 'Diavola Hot Honey', quantity: 1 },
        { name: 'Truffle & Wild Mushroom', quantity: 1 },
        { name: 'San Pellegrino Blood Orange', quantity: 2 },
      ],
    },
    {
      id: 'ord_3',
      orderNumber: '#A102',
      orderType: 'DELIVERY',
      status: 'PREPARING',
      customerName: 'David Miller',
      customerPhone: '+447822998811',
      totalGbp: 19.95,
      createdAt: '15 mins ago',
      items: [
        { name: 'Slow-Cooked Beef Shin Ragu', quantity: 1 },
        { name: 'House Tiramisu Classico', quantity: 1 },
      ],
    },
    {
      id: 'ord_4',
      orderNumber: '#A101',
      orderType: 'AI_CHAT',
      status: 'READY',
      customerName: 'Emma Watson',
      totalGbp: 22.0,
      createdAt: '24 mins ago',
      items: [
        { name: 'Cacio e Pepe Rigatoni', quantity: 1 },
        { name: 'House Red Wine (Bottle)', quantity: 1 },
      ],
    },
  ]);

  const restaurantId = 'res_1';

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket: Socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      socket.emit('join:kitchen', { restaurantId });
    });

    socket.on('order:new', (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.info(`New Order received: ${newOrder.orderNumber}`);
    });

    socket.on('order:update', (updated: { id: string; status: OrderTab }) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  const handleUpdateStatus = async (orderId: string, status: OrderTab, estimatedPrepTime = 20) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/v1/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, estimatedPrepTime }),
      });
    } catch {
      // optimistic local update
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    toast.success(`Order ${orderId} updated to ${status}`);
  };

  const filteredOrders = orders.filter((o) => o.status === activeTab);

  const getChannelBadge = (type: Order['orderType'], table?: string) => {
    switch (type) {
      case 'VOICE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 text-purple-600 px-2.5 py-0.5 text-xs font-semibold">
            <PhoneCall className="h-3 w-3" /> Voice AI
          </span>
        );
      case 'QR_TABLE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 px-2.5 py-0.5 text-xs font-semibold">
            <QrCode className="h-3 w-3" /> Table {table || '#'}
          </span>
        );
      case 'AI_CHAT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-600 px-2.5 py-0.5 text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> Web AI Chat
          </span>
        );
      case 'DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-xs font-semibold">
            <Bike className="h-3 w-3" /> Delivery
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Live Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming live orders from AI Voice, QR Table, and Web channels.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-2 no-scrollbar">
        {(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'] as OrderTab[]).map((tab) => {
          const count = orders.filter((o) => o.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === tab ? 'bg-white text-primary' : 'bg-muted text-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-2">
          <Clock className="h-8 w-8 mx-auto text-muted-foreground/60" />
          <h3 className="font-semibold text-foreground">No orders in {activeTab}</h3>
          <p className="text-xs text-muted-foreground">New incoming tickets will pop up automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-foreground">{order.orderNumber}</span>
                    {getChannelBadge(order.orderType, order.tableNumber)}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {order.createdAt}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{order.customerName}</p>
                  {order.customerPhone && <p>{order.customerPhone}</p>}
                </div>

                {/* Items List */}
                <div className="space-y-1.5 pt-2 border-t border-border/80">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-foreground font-medium">
                      <span>
                        <span className="font-bold text-orange-600 mr-1.5">{item.quantity}x</span>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Total & Actions */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-xs text-muted-foreground">Order Total</span>
                  <span className="font-extrabold text-foreground">£{order.totalGbp.toFixed(2)}</span>
                </div>

                {order.status === 'PENDING' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Accept (20m)
                    </Button>
                  </div>
                )}

                {order.status === 'ACCEPTED' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                    className="w-full"
                  >
                    <ChefHat className="h-4 w-4 mr-1.5" /> Start Preparing
                  </Button>
                )}

                {order.status === 'PREPARING' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, 'READY')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Ready
                  </Button>
                )}

                {order.status === 'READY' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Complete / Handover
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
