"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Maximize2, Tag, Ticket, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/schema";
import { ImageLightbox } from "@/components/image-lightbox";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  description?: string | null;
  expires_at?: string | null;
}

interface Product {
  id: string;
  title?: string;
  description?: string;
  price: number;
  discount_type?: string;
  discount_value?: number;
  images?: string[];
  image_url?: string;
  image_urls?: string[];
  category?: string;
  brand?: string;
  series?: string;
  ram_size?: string;
  storage_size?: string;
  specs?: any;
  coupon?: Coupon | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    discount_amount: number;
    discount_type: string;
    discount_value: number;
    coupon_id: string;
    code: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const catalogCoupon = product.coupon ?? null;
  const title = product.title || "Untitled Product";

  const image =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : product.images && product.images.length > 0
      ? product.images[0]
      : product.image_url ||
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop";

  const secondImage =
    product.image_urls && product.image_urls.length > 1
      ? product.image_urls[1]
      : product.images && product.images.length > 1
      ? product.images[1]
      : null;

  const displaySpecs = [
    product.ram_size || product.specs?.ram,
    product.storage_size || product.specs?.storage,
  ]
    .filter(Boolean)
    .join(" • ");

  const slug = slugify(title);

  // Calculate product discount
  const hasProductDiscount = (product.discount_value ?? 0) > 0;
  const discountAmount = hasProductDiscount
    ? product.discount_type === "percentage"
      ? Math.round(product.price * (product.discount_value! / 100))
      : Math.round(product.discount_value!)
    : 0;
  const discountedPriceProduct = hasProductDiscount
    ? Math.max(0, product.price - discountAmount)
    : product.price;

  const discountedPrice = appliedCoupon
    ? Math.max(0, discountedPriceProduct - appliedCoupon.discount_amount)
    : discountedPriceProduct;

  // Auto-focus input when panel opens
  useEffect(() => {
    if (showCouponInput && couponStatus !== "valid") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showCouponInput, couponStatus]);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: title,
    image,
    description:
      product.description ||
      `High-performance ${title} laptop with ${displaySpecs}`,
    brand: { "@type": "Brand", name: product.brand || "Lapzen" },
    offers: {
      url: `https://lapzen.com/products/${slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const handleValidateCoupon = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          order_amount: discountedPriceProduct,
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
        });
      } else {
        setCouponStatus("invalid");
        setCouponError(data.error || "Invalid coupon code.");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponStatus("invalid");
      setCouponError("Could not validate coupon. Try again.");
      setAppliedCoupon(null);
    }
  };

  const doAddToCart = (price: number) => {
    addItem({ id: product.id, name: title, price, image });
    setShowCouponInput(false);
    setCouponCode("");
    setCouponStatus("idle");
    setCouponError("");
    setAppliedCoupon(null);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCouponInput(true);
  };

  const handleSkipCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    doAddToCart(discountedPriceProduct);
  };

  const handleConfirmAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    doAddToCart(discountedPrice);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCouponInput(false);
    setCouponCode("");
    setCouponStatus("idle");
    setCouponError("");
    setAppliedCoupon(null);
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCouponStatus("idle");
    setCouponCode("");
    setCouponError("");
    setAppliedCoupon(null);
  };

  return (
    <div className="group block bg-white border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#00172E] relative flex flex-col">
      <JsonLd data={productSchema} />

      <Link href={`/products/${slug}`} className="block flex-1">
        {/* Image area */}
        <div className="relative aspect-[4/3] bg-white overflow-hidden p-1 sm:p-2 rounded-t-xl">
          <Image
            src={image}
            alt={title}
            fill
            className={`object-contain transition-all duration-500 p-1 sm:p-2 ${
              secondImage
                ? "group-hover:opacity-0"
                : "group-hover:scale-105"
            }`}
            unoptimized={image.startsWith("http")}
          />
          {secondImage && (
            <Image
              src={secondImage}
              alt={`${title} - Alternate View`}
              fill
              className="object-contain transition-all duration-500 p-1 sm:p-2 opacity-0 group-hover:opacity-100 group-hover:scale-105"
              unoptimized={secondImage.startsWith("http")}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Lightbox button */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              size="icon"
              variant="secondary"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md translate-y-[-10px] group-hover:translate-y-0"
            >
              <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Coupon label badge */}
          {catalogCoupon && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-md z-10 pointer-events-none">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              Coupon Applicable
            </div>
          )}

          {/* Discount badge */}
          {hasProductDiscount && (
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-md z-10 pointer-events-none">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              {product.discount_type === "percentage" ? `${product.discount_value}% OFF` : `Rs. ${product.discount_value} OFF`}
            </div>
          )}

          {/* Hover add button */}
          <Button
            onClick={handleAddToCartClick}
            size="sm"
            className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Info area */}
        <div className="p-2 sm:p-4 bg-gray-50">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            {product.category && (
              <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded">
                {product.category}
              </span>
            )}
            {product.brand && (
              <span className="text-[8px] sm:text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-1.5 sm:px-2 py-0.5 rounded">
                {product.brand}
              </span>
            )}
          </div>
          <h3 className="text-[13px] sm:text-base font-semibold text-navy mt-1 line-clamp-2 group-hover:text-accent transition-colors leading-tight sm:leading-normal">
            {title}
          </h3>
          {displaySpecs && (
            <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 line-clamp-1">
              {displaySpecs}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm sm:text-base font-bold text-navy">
                Rs. {discountedPriceProduct.toLocaleString()}
              </span>
              {hasProductDiscount && (
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCartClick}
              size="sm"
              variant="outline"
              className="lg:hidden h-7 w-7 p-0 sm:h-8 sm:w-8"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* ── Coupon panel — inline, not absolute ── */}
      {showCouponInput && (
        <div
          className="border-t border-border bg-white px-3 py-3 sm:px-4 sm:py-3"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {couponStatus !== "valid" ? (
            <>
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-navy flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-emerald-500" />
                  Have a coupon code?
                </span>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Input row */}
              <form
                onSubmit={handleValidateCoupon}
                className="flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={inputRef}
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
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={couponStatus === "loading" || !couponCode.trim()}
                  className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 shrink-0"
                  onClick={handleValidateCoupon}
                >
                  {couponStatus === "loading" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </form>

              {/* Error */}
              {couponStatus === "invalid" && (
                <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3 shrink-0" />
                  {couponError}
                </p>
              )}

              {/* Skip */}
              <button
                onClick={handleSkipCoupon}
                className="w-full mt-2 text-[10px] sm:text-xs text-muted-foreground hover:text-navy transition-colors py-1 text-center"
              >
                Skip — add without coupon
              </button>
            </>
          ) : (
            /* ── Coupon applied state ── */
            <>
              <div className="flex items-start gap-2 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs font-bold text-emerald-700">
                    Coupon &quot;{appliedCoupon!.code}&quot; applied!
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Rs. {appliedCoupon!.discount_amount.toLocaleString()} off →{" "}
                    <span className="font-bold text-navy">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-0.5 shrink-0"
                  title="Remove coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                onClick={handleConfirmAdd}
                size="sm"
                className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add to Cart — Rs. {discountedPrice.toLocaleString()}
              </Button>
            </>
          )}
        </div>
      )}

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={image}
        altText={title}
      />
    </div>
  );
}
