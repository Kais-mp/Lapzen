"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { useRouter } from "next/navigation";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  customer_details: {
    email: string;
    name: string;
  };
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { icon: <Clock className="w-4 h-4" />, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  processing: { icon: <Package className="w-4 h-4" />, color: "text-blue-600 bg-blue-50", label: "Processing" },
  shipped: { icon: <Truck className="w-4 h-4" />, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserEmail(user.email || null);
      
      try {
        const response = await fetch("/api/orders");
        if (response.ok) {
          const allOrders: Order[] = await response.json();
          const userOrders = allOrders.filter(
            (order) => order.customer_details?.email === user.email
          );
          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };
    checkUserAndFetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-5 lg:px-8 max-w-[900px]">
          <div className="mb-6">
            <Link 
              href="/account" 
              className="inline-flex items-center gap-2 text-navy hover:text-navy/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Account
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h1 className="text-2xl font-bold text-navy">My Orders</h1>
              <p className="text-muted-foreground">View your order history and track deliveries</p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-navy mb-2">No orders yet</h2>
                <p className="text-muted-foreground mb-6">
                  You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link href="/catalog">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <div key={order.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm font-medium text-navy">{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="text-sm font-medium text-navy">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                            {item.image && (
                              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-navy truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-navy">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="font-medium text-muted-foreground">Total</span>
                        <span className="text-xl font-bold text-navy">
                          Rs. {order.total_amount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
