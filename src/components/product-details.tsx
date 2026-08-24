"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Maximize2,
  Tag,
  Ticket,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ImageLightbox } from "@/components/image-lightbox";
import { ButtonDeliveryAnimation } from "@/components/delivery-animation";
import { VariantSelector } from "@/components/variant-selector";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_type?: string;
  discount_value?: number;
  image_urls?: string[];
  image_url?: string;
  category?: string;
  brand?: string;
  series?: string;
  ram_size?: string;
  storage_size?: string;
  specs?: any;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  description?: string | null;
  expires_at?: string | null;
}

export function ProductDetails({
  product,
  coupon,
}: {
  product: Product;
  coupon?: Coupon | null;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [animatingButton, setAnimatingButton] = useState<"buyNow" | "addToCart" | null>(null);
  const [variantPrice, setVariantPrice] = useState(product.price);
  const [selectedRamLabel, setSelectedRamLabel] = useState<string | null>(null);
  const [selectedStorageLabel, setSelectedStorageLabel] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    discount_amount: number;
    discount_type: string;
    discount_value: number;
    coupon_id: string;
    code: string;
    description?: string | null;
  } | null>(null);
  const couponInputRef = useRef<HTMLInputElement>(null);

  const { addItem, setIsOpen } = useCart();
  const router = useRouter();

  const hasCatalogCoupon = !!coupon;

  // Calculate product discount
  const hasProductDiscount = (product.discount_value ?? 0) > 0;
  const productDiscountAmount = hasProductDiscount
    ? product.discount_type === "percentage"
      ? Math.round(product.price * (product.discount_value! / 100))
      : Math.round(product.discount_value!)
    : 0;
  const priceWithProductDiscount = hasProductDiscount
    ? Math.max(0, product.price - productDiscountAmount)
    : product.price;

  // Adjust variant price with product discount
  const variantPriceWithDiscount = variantPrice - (product.price - priceWithProductDiscount);

  const handleVariantChange = (totalPrice: number, ram: any, storage: any) => {
    setVariantPrice(totalPrice);
    setSelectedRamLabel(ram?.variant_value ?? null);
    setSelectedStorageLabel(storage?.variant_value ?? null);
    // Revalidate discount when variant changes
    if (appliedCoupon) setAppliedCoupon(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    if (product) {
      import("@/lib/meta-client").then(({ trackMetaEvent }) => {
        trackMetaEvent("ViewContent", {
          content_ids: [product.id],
          content_name: product.title,
          content_type: "product",
          value: product.price,
          currency: "PKR",
        });
      });
    }
  }, [product.id, product.title, product.price]);

  const images =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : [
          product.image_url ||
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        ];

  // ── Discounted price ──────────────────────────────────────────────────────
  const discountedPrice = appliedCoupon
    ? Math.max(0, variantPriceWithDiscount - appliedCoupon.discount_amount)
    : variantPriceWithDiscount;

  const hasDiscount = appliedCoupon !== null && discountedPrice < variantPriceWithDiscount;

  // ── Coupon validation ─────────────────────────────────────────────────────
  const handleValidateCoupon = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    const trimmed = couponCode.trim();
    if (!trimmed) return;
    setCouponStatus("loading");
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmed,
          order_amount: variantPriceWithDiscount,
          product_id: product.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponStatus("valid");
        setAppliedCoupon({
          discount_amount: data.discount_amount,
          discount_type: data.discount_type,
          discount_value: data.discount_value,
          coupon_id: data.coupon_id,
          code: data.code,
          description: data.description,
        });
      } else {
        setCouponStatus("invalid");
        setCouponError(data.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponStatus("invalid");
      setCouponError("Could not validate coupon. Please try again.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponStatus("idle");
    setCouponCode("");
    setCouponError("");
    setTimeout(() => couponInputRef.current?.focus(), 50);
  };

  // ── Add to cart ───────────────────────────────────────────────────────────
  const buildCartItem = () => {
    const variantSuffix = [
      selectedRamLabel ? `${selectedRamLabel} RAM` : null,
      selectedStorageLabel ? selectedStorageLabel : null,
    ]
      .filter(Boolean)
      .join(", ");
    const itemName = variantSuffix
      ? `${product.title} (${variantSuffix})`
      : product.title;
    return { name: itemName, price: discountedPrice };
  };

  const handleAddToCart = () => {
    if (animatingButton) return;
    setAnimatingButton("addToCart");
    const { name, price } = buildCartItem();
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name,
        price,
        image: images[0],
        variantLabel: buildCartItem().name !== product.title ? name.replace(`${product.title} `, "") : undefined,
      });
    }
    import("@/lib/meta-client").then(({ trackMetaEvent }) => {
      trackMetaEvent("AddToCart", {
        content_ids: [product.id],
        content_name: product.title,
        content_type: "product",
        value: price * quantity,
        currency: "PKR",
      });
    });
  };

  const handleBuyNow = () => {
    if (animatingButton) return;
    setAnimatingButton("buyNow");
    const { name, price } = buildCartItem();
    addItem({ id: product.id, name, price, image: images[0] });
    import("@/lib/meta-client").then(({ trackMetaEvent }) => {
      trackMetaEvent("InitiateCheckout", {
        content_ids: [product.id],
        content_name: product.title,
        content_type: "product",
        value: price * quantity,
        currency: "PKR",
      });
    });
  };

  const onAnimationComplete = () => {
    const type = animatingButton;
    setAnimatingButton(null);
    if (type === "buyNow") router.push("/cart");
    else if (type === "addToCart") setIsOpen(true);
  };

  const specs = [
    { label: "Brand", value: product.brand },
    { label: "Series", value: product.series },
    { label: "Category", value: product.category },
    { label: "RAM", value: product.ram_size || product.specs?.ram },
    { label: "Storage", value: product.storage_size || product.specs?.storage },
    ...(product.specs
      ? Object.entries(product.specs)
          .filter(([k]) => k.toLowerCase() !== "ram" && k.toLowerCase() !== "storage")
          .map(([k, v]) => ({ label: k.toUpperCase(), value: String(v) }))
      : []),
  ].filter((s) => s.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* ── Image Gallery ─────────────────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-border p-8 group/image cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out pointer-events-none"
              style={{
                transform: isZoomed ? "scale(2.5)" : "scale(1)",
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
            >
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                className="object-contain"
                priority
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl opacity-0 group-hover/image:opacity-100 transition-all shadow-xl border border-border hover:bg-navy hover:text-white group/btn z-10"
            >
              <Maximize2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-navy shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="80px"
                    quality={60}
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec, idx) => (
            <div key={idx} className="bg-muted/50 p-4 rounded-2xl border border-border/50">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                {spec.label}
              </span>
              <span className="text-base font-bold text-navy">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product Info ───────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {product.brand && (
              <Badge
                variant="outline"
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border-red-100"
              >
                {product.brand}
              </Badge>
            )}
            {product.series && (
              <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {product.series}
              </Badge>
            )}
            {/* Coupon applicable badge */}
            {hasCatalogCoupon && (
              <Badge className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white border-0 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Coupon Applicable
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-navy mb-4 tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-3xl font-black text-navy">
              Rs. {discountedPrice.toLocaleString()}
            </span>
            {(hasProductDiscount || hasDiscount) && (
              <span className="text-lg text-muted-foreground line-through">
                Rs. {variantPrice.toLocaleString()}
              </span>
            )}
            {hasProductDiscount && !hasDiscount && (
              <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                {product.discount_type === "percentage" ? `${product.discount_value}% OFF` : `Rs. ${product.discount_value} OFF`}
              </span>
            )}
            {hasDiscount && appliedCoupon && (
              <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                {appliedCoupon.discount_type === "percentage"
                  ? `${appliedCoupon.discount_value}% OFF`
                  : `Rs. ${Number(appliedCoupon.discount_value).toLocaleString()} OFF`}
              </span>
            )}
            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
              In Stock
            </span>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="space-y-6 pt-6 border-t border-border">
          {/* Quantity */}
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-muted rounded-full p-1 border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-white hover:text-[#00172E] transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-white hover:text-[#00172E] transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* ── Coupon Input Box ─────────────────────────────────────────── */}
          <div className="bg-gray-50 border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm font-semibold text-navy">Have a coupon code?</span>
            </div>

            {couponStatus !== "valid" ? (
              <>
                <form onSubmit={handleValidateCoupon} className="flex gap-2">
                  <input
                    ref={couponInputRef}
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponStatus !== "idle") {
                        setCouponStatus("idle");
                        setCouponError("");
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={couponStatus === "loading" || !couponCode.trim()}
                    onClick={handleValidateCoupon}
                    className="h-[38px] px-4 text-sm bg-emerald-600 hover:bg-emerald-700 shrink-0 rounded-xl"
                  >
                    {couponStatus === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </form>

                {couponStatus === "invalid" && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    {couponError}
                  </p>
                )}
              </>
            ) : (
              /* Coupon applied */
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-emerald-700">
                    &quot;{appliedCoupon!.code}&quot; applied!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rs. {appliedCoupon!.discount_amount.toLocaleString()} off &rarr;{" "}
                    <span className="font-bold text-navy">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>
                  </p>
                  {appliedCoupon!.description && (
                    <p className="text-xs text-emerald-700 mt-1">{appliedCoupon!.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-0.5 shrink-0"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Add to Cart / Buy Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleAddToCart}
              size="lg"
              variant="outline"
              disabled={!!animatingButton}
              className="relative h-14 rounded-2xl border-2 font-bold text-lg gap-3 hover:bg-navy hover:text-[#00172E] transition-all group overflow-hidden"
            >
              <div
                className={
                  animatingButton === "addToCart"
                    ? "invisible"
                    : "flex items-center gap-3"
                }
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Add to Cart
              </div>
              <ButtonDeliveryAnimation
                isOpen={animatingButton === "addToCart"}
                onComplete={onAnimationComplete}
                type="addToCart"
              />
            </Button>

            <Button
              onClick={handleBuyNow}
              size="lg"
              disabled={!!animatingButton}
              className="relative h-14 rounded-2xl font-bold text-lg gap-3 overflow-hidden bg-[#00172E] text-white shadow-lg hover:bg-white hover:text-[#00172E] hover:border-2 hover:border-[#00172E] hover:shadow-none transition-all duration-300 ease-out"
            >
              <div
                className={
                  animatingButton === "buyNow" ? "invisible" : "flex items-center gap-3"
                }
              >
                <Zap className="w-5 h-5 fill-current" />
                Buy It Now
              </div>
              <ButtonDeliveryAnimation
                isOpen={animatingButton === "buyNow"}
                onComplete={onAnimationComplete}
                type="buyNow"
              />
            </Button>
          </div>
        </div>

        {/* Variant Selector */}
        <VariantSelector
          productId={product.id}
          basePrice={product.price}
          onPriceChange={handleVariantChange}
        />

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-navy" />
            </div>
            <span className="text-xs font-bold text-navy uppercase tracking-tighter">
              30 days Warranty
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center mb-3">
              <Truck className="w-6 h-6 text-navy" />
            </div>
            <span className="text-xs font-bold text-navy uppercase tracking-tighter">
              Fast Delivery
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6 text-navy" />
            </div>
            <span className="text-xs font-bold text-navy uppercase tracking-tighter">
              30 Days Return
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          className="mt-8 pt-6 border-t border-border text-lg text-muted-foreground leading-relaxed prose prose-sm max-w-none prose-slate prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={images[selectedImage]}
        altText={product.title}
      />
    </div>
  );
}
