"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Check, ShoppingBag, AlertCircle, Package, Smartphone, Landmark, ReceiptText, MessageCircle, Truck, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentMethod = "jazzcash" | "bank_transfer" | "cash_on_delivery" | "order_on_whatsapp";

function LocalCheckoutForm({ 
  onSuccess, 
  customerDetails, 
  total,
  items,
  clearCart
}: { 
  onSuccess: (method: PaymentMethod, details: any) => void; 
  customerDetails: { name: string; email: string; phone: string; address: string };
  total: number;
  items: any[];
  clearCart: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("jazzcash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      setError("Please complete all customer information fields.");
      return;
    }

    if (paymentMethod === "order_on_whatsapp") {
      // First confirm the order, then redirect to WhatsApp
      setIsProcessing(true);
      setError(null);
      
      try {
        // Save order to database directly for WhatsApp orders
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_details: {
              ...customerDetails,
              payment_method: "order_on_whatsapp",
              transaction_id: null
            },
            total_amount: total,
              items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                variantLabel: item.variantLabel || null,
              })),
            }),
          });
          
          if (!response.ok) {
            throw new Error("Failed to save order");
          }
          
          // Get order ID from response
          const orderData = await response.json();
          const orderId = orderData.id || `ORD-${Date.now()}`;
        
        // Send confirmation email
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: customerDetails.email,
              orderId: orderId,
              customerName: customerDetails.name,
              totalAmount: total,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              paymentMethod: "order_on_whatsapp",
              address: customerDetails.address,
              phone: customerDetails.phone
            }),
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
        
        // Clear cart and track purchase
        clearCart();
        import('@/lib/meta-client').then(({ trackMetaEvent }) => {
          trackMetaEvent('Purchase', {
            content_ids: items.map(i => i.id),
            content_type: 'product',
            value: total,
            currency: 'PKR',
            num_items: items.reduce((acc, i) => acc + i.quantity, 0),
          }, {
            email: customerDetails.email,
            phone: customerDetails.phone,
          });
        });
        
        // Generate WhatsApp message with order and product details
        const productDetails = items.map((item, index) => 
          `${index + 1}. ${item.name}\n   Quantity: ${item.quantity} × Rs. ${item.price.toLocaleString()} = Rs. ${(item.quantity * item.price).toLocaleString()}`
        ).join('\n\n');
        
        const message = encodeURIComponent(
          `Hello! I want to place an order on Lapzen.\n\n` +
          `Order Items:\n` +
          `${productDetails}\n\n` +
          `Customer Details:\n` +
          `Name: ${customerDetails.name}\n` +
          `Email: ${customerDetails.email}\n` +
          `Phone: ${customerDetails.phone}\n` +
          `Address: ${customerDetails.address}\n\n` +
          ` Payment Method: Order on WhatsApp\n` +
          ` Total Amount: Rs. ${total.toLocaleString()}\n\n` +
          `Please confirm this order and proceed with payment instructions.`
        );
        
        // Redirect to WhatsApp
        window.location.href = `https://wa.me/923090009022?text=${message}`;
      } catch (error) {
        console.error("Error confirming order:", error);
        setError("Failed to confirm order. Please try again.");
        setIsProcessing(false);
      }
      return;
    }

    if (paymentMethod !== "cash_on_delivery" && !transactionId) {
      setError("Please provide the Transaction ID or Reference Number for verification.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSuccess(paymentMethod, { transactionId });
  };

  const paymentInstructions = {
    jazzcash: {
      title: "JazzCash/EasyPaisa",
      accountName: "Muhammad Asim",
      accountNumber: "0309-0009022",
      account: "JazzCash/EasyPaisa Mobile Account",
      instructions: "Transfer the total amount to the JazzCash/EasyPaisa account below and enter the Transaction ID."
    },
    bank_transfer: {
      title: "Bank Transfer",
      accountName: "M. Asim",
      bankName: "United Bank Limited (UBL)",
      accountNumber: "0360274723326",
      instructions: "Transfer the total amount to our Meezan Bank account and enter the reference number."
    },
    cash_on_delivery: {
      title: "Cash on Delivery",
      accountName: "N/A",
      accountNumber: "N/A",
      instructions: "Pay when you receive your order. Our delivery partner will collect payment at your doorstep.A small verification fee may apply for COD orders, which will be refunded after successful delivery."
    },
    order_on_whatsapp: {
      title: "Order on WhatsApp",
      accountName: "N/A",
      accountNumber: "N/A",
      instructions: "Chat with our team on WhatsApp to discuss custom payment options and finalize your order."
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-navy mb-6 flex items-center gap-2">
          <ReceiptText className="w-5 h-5" />
          Select Payment Method
        </h3>
        
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setPaymentMethod("jazzcash")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
              paymentMethod === "jazzcash" 
                ? "border-navy bg-navy/5 shadow-sm" 
                : "border-border hover:border-navy/30"
            )}
          >
            <Smartphone className={cn("w-8 h-8", paymentMethod === "jazzcash" ? "text-navy" : "text-muted-foreground")} />
            <span className="font-semibold">JazzCash</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("bank_transfer")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
              paymentMethod === "bank_transfer" 
                ? "border-navy bg-navy/5 shadow-sm" 
                : "border-border hover:border-navy/30"
            )}
          >
            <Landmark className={cn("w-8 h-8", paymentMethod === "bank_transfer" ? "text-navy" : "text-muted-foreground")} />
            <span className="font-semibold">Bank Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("cash_on_delivery")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
              paymentMethod === "cash_on_delivery" 
                ? "border-navy bg-navy/5 shadow-sm" 
                : "border-border hover:border-navy/30"
            )}
          >
            <Truck className={cn("w-8 h-8", paymentMethod === "cash_on_delivery" ? "text-navy" : "text-muted-foreground")} />
            <span className="font-semibold">Cash on Delivery</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("order_on_whatsapp")}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all gap-3",
              paymentMethod === "order_on_whatsapp" 
                ? "border-navy bg-navy/5 shadow-sm" 
                : "border-border hover:border-navy/30"
            )}
          >
            <MessageCircle className={cn("w-8 h-8", paymentMethod === "order_on_whatsapp" ? "text-navy" : "text-muted-foreground")} />
            <span className="font-semibold">WhatsApp Order</span>
          </button>
        </div>

        {paymentMethod !== "cash_on_delivery" && paymentMethod !== "order_on_whatsapp" && (
          <div className="bg-muted/30 rounded-xl p-5 mb-6 border border-dashed border-navy/20">
            <h4 className="font-bold text-navy mb-3 flex items-center gap-2">
              Payment Instructions ({paymentInstructions[paymentMethod].title})
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {paymentInstructions[paymentMethod].instructions}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-bold text-navy">{paymentInstructions[paymentMethod].accountName}</span>
              </div>
              {paymentMethod === "bank_transfer" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-bold text-navy">{(paymentInstructions.bank_transfer as any).bankName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-bold text-navy tracking-wider">{paymentInstructions[paymentMethod].accountNumber}</span>
              </div>
              <div className="flex justify-between border-t border-navy/10 pt-2 mt-2">
                <span className="text-muted-foreground">Total to Pay:</span>
                <span className="font-bold text-navy">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "cash_on_delivery" && (
          <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              {paymentInstructions[paymentMethod].instructions}
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>✓ No upfront payment required</p>
              <p>✓ Pay when you receive your order</p>
              <p>✓ Completely secure and hassle-free</p>
            </div>
          </div>
        )}

        {paymentMethod === "order_on_whatsapp" && (
          <div className="bg-green-50 rounded-xl p-5 mb-6 border border-green-200">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {paymentInstructions[paymentMethod].instructions}
            </h4>
            <div className="space-y-2 text-sm text-green-800">
              <p>✓ Direct conversation with our team</p>
              <p>✓ Custom payment options available</p>
              <p>✓ Fast order confirmation</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {paymentMethod !== "cash_on_delivery" && paymentMethod !== "order_on_whatsapp" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Transaction ID / Reference Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                placeholder="Enter ID from payment receipt"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Our team will verify this ID before shipping your order.
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-14 text-lg font-semibold bg-navy hover:bg-navy/90"
        disabled={isProcessing || (paymentMethod !== "cash_on_delivery" && paymentMethod !== "order_on_whatsapp" && !transactionId)}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Submit Order
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {paymentMethod === "order_on_whatsapp" 
          ? "You'll be directed to WhatsApp to complete your order"
          : paymentMethod === "cash_on_delivery"
          ? "Order will be confirmed and shipped to your address"
          : "Order will be processed after payment verification"}
      </p>

      <div className="bg-green-50 rounded-xl p-6 border border-green-100">
        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Custom Payment Option
        </h4>
        <p className="text-sm text-green-700 mb-4">
          Click the button below to choose a custom payment option other than the four available above. Our team will assist you on WhatsApp.
        </p>
        <a 
          href="https://wa.me/923090009022" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
        >
          <Smartphone className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </form>
  );
}

function OrderSummary() {
  const { items, total } = useCart();

  return (
    <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-navy mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        Order Summary
      </h3>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">Rs. {item.price.toLocaleString()}</p>
            </div>
            <p className="text-sm font-semibold text-navy">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">Rs. {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">Rs. 0</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-navy pt-3 border-t border-border">
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function SuccessState({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-navy mb-4">Order Submitted!</h2>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We have received your order and payment reference. Our team will verify the payment and process your shipment shortly.
        </p>
        <Button onClick={onContinue} className="h-12 px-8">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

  export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ 
      name: "", 
      email: "", 
      phone: "", 
      address: "" 
    });
  
    useEffect(() => {
      if (items.length > 0) {
        import('@/lib/meta-client').then(({ trackMetaEvent }) => {
          trackMetaEvent('InitiateCheckout', {
            content_ids: items.map(i => i.id),
            content_type: 'product',
            value: total,
            currency: 'PKR',
            num_items: items.reduce((acc, i) => acc + i.quantity, 0),
          });
        });
      }
    }, []);

    const handleLocalSuccess = async (method: PaymentMethod, paymentData: any) => {
    try {
      // Save order to database with payment info inside customer_details
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_details: {
            ...customerDetails,
            payment_method: method,
            transaction_id: paymentData.transactionId
          },
          total_amount: total,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save order");
      }

        // Get order ID from response
        const orderData = await response.json();
        const orderId = orderData.id || `ORD-${Date.now()}`;
        
        // Send confirmation email
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: customerDetails.email,
              orderId: orderId,
              customerName: customerDetails.name,
              totalAmount: total,
              items: items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              paymentMethod: method,
              address: customerDetails.address,
              phone: customerDetails.phone
            }),
          });
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }

        setIsSuccess(true);
        clearCart();

        // Track Purchase event
        import('@/lib/meta-client').then(({ trackMetaEvent }) => {
          trackMetaEvent('Purchase', {
            content_ids: items.map(i => i.id),
            content_type: 'product',
            value: total,
            currency: 'PKR',
            num_items: items.reduce((acc, i) => acc + i.quantity, 0),
          }, {
            email: customerDetails.email,
            phone: customerDetails.phone,
          });
        });
      } catch (err) {
      console.error("Error saving order:", err);
      alert("There was an error submitting your order. Please try again.");
    }
  };

  const handleContinue = () => {
    window.location.href = "/";
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-border bg-white sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
                <Image
                  src="/logo.png"
                  alt="Lapzen Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tighter text-navy">Lapzen</span>
            </Link>
          </div>
        </header>
        <main className="container py-12">
          <SuccessState onContinue={handleContinue} />
        </main>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-border bg-white sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group transition-all">
              <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
                <Image
                  src="/logo.png"
                  alt="Lapzen Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tighter text-navy">Lapzen</span>
            </Link>
          </div>
        </header>
        <main className="container py-12">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-navy mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to proceed to checkout</p>
              <Link href="/">
                <Button className="h-12 px-8">Browse Products</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
              <Image
                src="/logo.png"
                alt="Lapzen Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tighter text-navy">Lapzen</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="container py-8 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-navy transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <h1 className="text-3xl font-bold text-navy mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start gap-4">
              <Gift className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-1">Be Our Valuable Customer</h3>
                <p className="text-sm text-emerald-800">Enjoy a 50-day return window on all purchases. Shop with confidence!</p>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="John Doe"
                    required
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="john@example.com"
                    required
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="0300-1234567"
                    required
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipping Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="Street, City, Province"
                    required
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Details
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <div className="relative w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-navy text-sm mb-1">{item.name}</p>
                      <p className="text-xs text-slate-500 mb-2">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-sm text-navy font-bold">Qty: {item.quantity} × Rs. {(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                <span className="font-bold text-navy">Total:</span>
                <span className="font-bold text-navy">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <LocalCheckoutForm 
              onSuccess={handleLocalSuccess} 
              customerDetails={customerDetails}
              total={total}
              items={items}
              clearCart={clearCart}
            />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}
