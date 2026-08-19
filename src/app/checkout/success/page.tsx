"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="https://ojvgpgjokyjriesqkncz.supabase.co/storage/v1/object/public/test-clones/3703ae26-4d55-4c16-ad94-b7374ad76a02-lapzen-store/assets/svgs/347e75bb-ec5b-455b-be95-96a1d46d0742_096381d0-0717-1.svg"
              alt="Lapzen"
              width={100}
              height={36}
              className="h-auto w-[100px] brightness-0"
            />
          </Link>
        </div>
      </header>

      <main className="container py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-[scale-in_0.5s_ease-out]">
              <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-green-200/50 animate-ping" />
          </div>

          <h1 className="text-4xl font-bold text-navy mb-4">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation shortly.
          </p>

          <div className="bg-white border border-border rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              What happens next?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                <span>You will receive an order confirmation email with details of your purchase.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                <span>Our team will prepare your order and you will be notified when it ships.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                <span>Track your package with the shipping link provided in the email.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="h-12 px-8 gap-2">
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="h-12 px-8 gap-2">
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
