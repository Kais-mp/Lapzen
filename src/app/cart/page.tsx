"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-5 lg:px-8 max-w-[1200px]">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingBag size={28} />
          Your Cart
          <span className="text-sm font-normal text-slate-500 ml-2">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 text-center max-w-md px-6">
              Looks like you haven&apos;t added anything to your cart yet. Explore our latest products and find something you love!
            </p>
            <Link 
              href="/catalog" 
              className="bg-[#002b5c] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition-all flex items-center gap-2 group"
            >
              Continue Shopping
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-24 h-24 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-slate-900 text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-[#ff0000] font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-slate-500 hover:text-[#ff0000] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-slate-500 hover:text-blue-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right sm:w-28">
                    <p className="font-bold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-400 hover:text-[#ff0000] hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <div className="pt-4">
                <Link 
                  href="/catalog" 
                  className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
                >
                  <ArrowRight size={18} className="rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-32">
                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-[#ff0000]">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full bg-[#ff0000] text-white py-4 rounded-xl font-bold text-center hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

