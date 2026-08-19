"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ProductCard } from "@/components/product-card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  series: string;
  type: string;
  new_arrival: boolean;
  featured: boolean;
  specs: any;
  image_urls: string[];
  created_at: string;
}

const brandInfo: Record<string, { name: string; description: string; image: string }> = {
  hp: {
    name: "HP",
    description: "Discover powerful HP laptops engineered for performance, reliability, and innovation. From business professionals to creative enthusiasts.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/hp-1767119994306.jpeg?width=8000&height=8000&resize=contain"
  },
  dell: {
    name: "Dell",
    description: "Experience cutting-edge Dell laptops designed for work and play. Premium build quality meets exceptional performance.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/dell-1767119994307.jpeg?width=8000&height=8000&resize=contain"
  },
  apple: {
    name: "Apple",
    description: "Explore the world of Apple MacBooks - where sleek design meets unparalleled performance and the renowned Apple ecosystem.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/apple-1767119994307.jpeg?width=8000&height=8000&resize=contain"
  },
  lenovo: {
    name: "Lenovo",
    description: "Browse Lenovo laptops built for versatility and durability. From ThinkPad to Legion, find your perfect match.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/lenovo-1767119994306.jpeg?width=8000&height=8000&resize=contain"
  },
  acer: {
    name: "Acer",
    description: "Discover Acer laptops that balance performance and value. Ideal for students and daily productivity.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/acer-1767119994307.jpeg?width=8000&height=8000&resize=contain"
  },
    toshiba: {
    name: "Toshiba",
    description: "Reliable and durable laptops for business and everyday use.",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/toshiba-2-1767201502533.jpeg?width=8000&height=8000&resize=contain"
  },
  asus: {
    name: "ASUS",
    description: "Discover ASUS laptops featuring cutting-edge technology. From ROG gaming powerhouses to ZenBook ultrabooks.",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80"
  },
  msi: {
    name: "MSI",
    description: "Unleash your gaming potential with MSI laptops. Premium gaming machines built for ultimate performance.",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80"
  }
};

export default function BrandPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

    const brand = (slug && brandInfo[slug.toLowerCase()]) || {
      name: (slug && slug.length > 0) ? (slug?.charAt(0) ?? "").toUpperCase() + slug.slice(1) : "Brand",
      description: slug ? `Explore our collection of ${slug} laptops.` : "Explore our collection of premium laptops.",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80"
    };

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?brand=${brand.name}`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchProducts();
    }
  }, [slug, brand.name]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
        <main className="flex-grow pt-32">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-slate-50">
            <div className="absolute inset-0 flex items-center justify-end pr-0 md:pr-20 opacity-20 md:opacity-100">
              <div className="relative w-full h-full md:w-[600px] md:h-[400px]">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-5 lg:px-8 max-w-[1536px] relative z-10">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-navy/60 hover:text-navy mb-6 transition-colors font-medium"
                >
                  <ArrowLeft size={18} />
                  Back to Home
                </Link>
                <div className="inline-block px-4 py-1.5 bg-navy/5 rounded-full text-navy font-bold text-sm mb-6 tracking-wider uppercase">
                  Premium Collection
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-navy mb-6 tracking-tight">
                  {brand.name} <span className="text-navy/20">Laptops</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-medium">
                  {brand.description}
                </p>
              </div>
            </div>
          </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-5 lg:px-8 max-w-[1536px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-navy">
                {isLoading ? "Loading..." : `${products.length} Products Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-navy" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">No Products Available</h3>
                <p className="text-slate-500 mb-6">
                  We don&apos;t have any {brand.name} laptops in stock at the moment.
                </p>
                <Link 
                  href="/catalog"
                  className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-navy/90 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
