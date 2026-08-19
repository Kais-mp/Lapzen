"use client";

import React, { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'shipped': return { icon: Truck, class: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Shipped' };
      case 'delivered': return { icon: CheckCircle, class: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Delivered' };
      case 'cancelled': return { icon: AlertCircle, class: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Cancelled' };
      default: return { icon: Clock, class: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Processing' };
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">Sales Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage customer transactions</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Order Ref</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Product</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Customer Details</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Amount</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : orders.map((order) => {
                const status = getStatusDisplay(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-mono text-xs text-navy font-bold flex items-center gap-2">
                        <Package className="w-3 h-3 text-slate-400" />
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-navy truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No items</p>
                      )}
                    </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-navy">{order.customer_details?.name || 'Guest User'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{order.customer_details?.email}</p>
                        {order.customer_details?.payment_method && (
                          <div className="mt-2 space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-navy/5 text-navy text-[10px] font-bold rounded uppercase">
                              {order.customer_details.payment_method.replace('_', ' ')}
                            </span>
                            <p className="text-[10px] text-muted-foreground">ID: {order.customer_details.transaction_id}</p>
                          </div>
                        )}
                      </td>
                    <td className="px-6 py-5 font-bold text-navy text-sm">
                      Rs. {order.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.class}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-[10px] font-bold text-navy border border-slate-100 bg-slate-50 rounded-xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all appearance-none cursor-pointer hover:bg-white"
                        >
                          <option value="pending">Processing</option>
                          <option value="shipped">Ship Order</option>
                          <option value="delivered">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-20 bg-slate-50/30">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium tracking-tight">No commerce activity recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
