"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductsSectionProps {
  title?: string;
  description?: string;
  type?: 'featured' | 'new_arrival';
  brand?: string;
  category?: string;
  series?: string;
  viewAllLink?: string;
  initialProducts?: any[];
  showViewAll?: boolean;
  limit?: number;
}

export function ProductsSection({ 
  title = "Featured Laptops", 
  description = "Discover our best-selling premium laptops", 
  type = "featured",
  brand,
  category,
  series,
  viewAllLink = "/catalog",
  initialProducts,
  showViewAll = true,
  limit
}: ProductsSectionProps) {
  const [products, setProducts] = useState<any[]>(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (initialProducts) return;
    
    async function fetchProducts() {
      try {
        let queryParam = type === 'featured' ? 'featured=true' : 'new_arrival=true';
        if (brand) {
          queryParam = `brand=${encodeURIComponent(brand)}`;
        } else if (category) {
          queryParam = `category=${encodeURIComponent(category)}`;
        } else if (series) {
          queryParam = `series=${encodeURIComponent(series)}`;
        }
        const res = await fetch(`/api/products?${queryParam}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        // Use custom limit if provided, otherwise default to 8 (or all for series)
        const finalLimit = limit || (series ? undefined : 8);
        setProducts(finalLimit ? data.slice(0, finalLimit) : data);
      } catch (error) {
        console.error(`Error fetching ${type} products:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [type, brand, series, limit]);

  const titleWords = title.split(' ');

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="container px-4 mx-auto max-w-[1536px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black text-primary mb-4 tracking-tight">
                {titleWords.map((word, i) => (
                  <span key={i} className={i === 1 ? "opacity-40" : ""}>{word} </span>
                ))}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
            </div>
            {showViewAll && (
              <Link 
                href={viewAllLink}
                className="hidden md:flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-accent hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <span>View All {brand || (type === 'featured' ? 'Featured' : 'New Arrivals')}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary/10" />
            <p className="text-primary/40 font-bold animate-pulse">Loading {type === 'featured' ? 'featured' : 'new'} products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-muted rounded-[40px] border-2 border-dashed border-border">
            <p className="text-muted-foreground font-medium italic">No {type === 'featured' ? 'featured' : 'new arrival'} products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

          {showViewAll && (
            <div className="mt-12 flex flex-col items-center">
              <Link 
                href={viewAllLink}
                className="flex md:hidden items-center justify-center gap-2 w-full bg-primary text-white px-8 py-5 rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                <span>View All {brand || (type === 'featured' ? 'Featured' : 'New Arrivals')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}
