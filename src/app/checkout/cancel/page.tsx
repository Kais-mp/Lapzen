"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { XCircle, ShoppingCart, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
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
          <div className="mb-8">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-amber-600" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-navy mb-4">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your payment was not completed. Don&apos;t worry - your cart items are still saved and you can try again whenever you&apos;re ready.
          </p>

          <div className="bg-white border border-border rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-navy mb-4">Common reasons for cancellation:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-navy">•</span>
                <span>You clicked the back button or cancelled the payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy">•</span>
                <span>There was an issue with your payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy">•</span>
                <span>The session timed out due to inactivity</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <Button className="h-12 px-8 gap-2">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="h-12 px-8 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Button>
            </Link>
          </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-navy underline hover:no-underline">
                Contact our support team
              </Link>
            </p>
        </div>
      </main>
    </div>
  );
}
