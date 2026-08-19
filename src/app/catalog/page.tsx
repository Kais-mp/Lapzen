"use client";

import React, { useState, useEffect, Suspense } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/schema";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useWindowSize } from "@/hooks/use-window-size";

const HERO_IMAGES: Record<string, string> = {
  // Brands
  'hp': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/hp-1767119994306.jpeg?width=800&height=800&resize=contain',
  'dell': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/dell-1767119994307.jpeg?width=800&height=800&resize=contain',
  'apple': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/apple-1767119994307.jpeg?width=800&height=800&resize=contain',
  'lenovo': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/lenovo-1767119994306.jpeg?width=800&height=800&resize=contain',
  'acer': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/acer-1767119994307.jpeg?width=800&height=800&resize=contain',
  'toshiba': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/toshiba-1767119994306.jpeg?width=800&height=800&resize=contain',
  // Categories
  'gaming': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gaming-resized-1767120834252.webp?width=800&height=800&resize=contain',
  'chromebooks': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/chromebooks-1767120833869.webp?width=800&height=800&resize=contain',
  'workstations': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/workstations-1767120833870.webp?width=800&height=800&resize=contain',
  'business': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/business-1767120833871.webp?width=800&height=800&resize=contain',
  '2-in-1': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-in-1-1767120833874.webp?width=800&height=800&resize=contain',
  // Series
  'elitebook': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Hp-elitebook-1767121413659.webp?width=800&height=800&resize=contain',
  'macbook': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/apple-macbook-1767121413584.webp?width=800&height=800&resize=contain',
  'latitude': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/dell-latitude-1767121413633.webp?width=800&height=800&resize=contain',
  'thinkpad': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/lenovo-thinkpad-1767121413587.webp?width=800&height=800&resize=contain',
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const windowSize = useWindowSize();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate items per page based on screen width
  const getItemsPerPage = () => {
    const width = windowSize.width;
    if (!width) return 12; // Default fallback
    
    // Determine columns based on width and filter visibility
    let cols: number;
    
    if (showFilters) {
      // With filters: grid-cols-2 md:grid-cols-3 xl:grid-cols-4
      if (width < 1280) { // xl breakpoint
        if (width < 768) { // md breakpoint
          cols = 2;
        } else {
          cols = 3;
        }
      } else {
        cols = 4;
      }
    } else {
      // Without filters: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
      if (width < 768) { // md breakpoint
        cols = 2;
      } else if (width < 1024) { // lg breakpoint
        cols = 3;
      } else if (width < 1280) { // xl breakpoint
        cols = 4;
      } else if (width < 1536) { // 2xl breakpoint
        cols = 5;
      } else {
        cols = 6;
      }
    }
    
    // 4 rows of products
    return cols * 4;
  };

  const itemsPerPage = getItemsPerPage();

  // Draft state for filters
  const [draftMinPrice, setDraftMinPrice] = useState("");
  const [draftMaxPrice, setDraftMaxPrice] = useState("");
  const [draftRams, setDraftRams] = useState<string[]>([]);
  const [draftStorages, setDraftStorages] = useState<string[]>([]);

  const activeCategory = searchParams.get("category");
  const activeBrand = searchParams.get("brand");
  const activeSeries = searchParams.get("series");
  const activeMinPrice = searchParams.get("min_price");
  const activeMaxPrice = searchParams.get("max_price");
  const activeRams = searchParams.getAll("ram");
  const activeStorages = searchParams.getAll("storage");
  const activeFeatured = searchParams.get("featured");
  const activeNewArrival = searchParams.get("new_arrival");

  // Sync draft state with URL params and reset pagination
  useEffect(() => {
    setDraftMinPrice(activeMinPrice || "");
    setDraftMaxPrice(activeMaxPrice || "");
    setDraftRams(activeRams);
    setDraftStorages(activeStorages);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeMinPrice, activeMaxPrice, searchParams]); // searchParams dependency captures getAll changes

  const getHeroImage = () => {
    if (activeSeries) return HERO_IMAGES[activeSeries.toLowerCase()];
    if (activeCategory) return HERO_IMAGES[activeCategory.toLowerCase()];
    if (activeBrand) return HERO_IMAGES[activeBrand.toLowerCase()];
    return null;
  };

  const heroImage = getHeroImage();
  const heroTitle = activeSeries || activeCategory || activeBrand || "Catalog";

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      if (activeBrand) params.set("brand", activeBrand);
      if (activeSeries) params.set("series", activeSeries);
      if (activeFeatured) params.set("featured", activeFeatured);
      if (activeNewArrival) params.set("new_arrival", activeNewArrival);
      if (activeMinPrice) params.set("min_price", activeMinPrice);
      if (activeMaxPrice) params.set("max_price", activeMaxPrice);
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeBrand, activeSeries, activeFeatured, activeNewArrival, activeMinPrice, activeMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min_price");
    params.delete("max_price");
    params.delete("ram");
    params.delete("storage");

    if (draftMinPrice) params.set("min_price", draftMinPrice);
    if (draftMaxPrice) params.set("max_price", draftMaxPrice);
    draftRams.forEach(ram => params.append("ram", ram));
    draftStorages.forEach(storage => params.append("storage", storage));

    router.push(`/catalog?${params.toString()}`);
  };

  const clearFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      const values = params.getAll(key).filter(v => v !== value);
      params.delete(key);
      values.forEach(v => params.append(key, v));
    } else {
      params.delete(key);
    }
    router.push(`/catalog?${params.toString()}`);
  };

  const resetFilters = () => {
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftRams([]);
    setDraftStorages([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min_price");
    params.delete("max_price");
    params.delete("ram");
    params.delete("storage");
    router.push(`/catalog?${params.toString()}`);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRam = activeRams.length === 0 || activeRams.some(ram => 
      p.ram_size?.toLowerCase().includes(ram.toLowerCase()) || 
      p.specs?.ram?.toLowerCase().includes(ram.toLowerCase())
    );

    const matchesStorage = activeStorages.length === 0 || activeStorages.some(storage => 
      p.storage_size?.toLowerCase().includes(storage.toLowerCase()) ||
      p.specs?.storage?.toLowerCase().includes(storage.toLowerCase())
    );
    
    return matchesSearch && matchesRam && matchesStorage;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Laptop Catalog - Lapzen",
        "description": "Browse our full collection of premium laptops from HP, Apple, Dell, Lenovo, and more.",
        "url": "https://lapzen.com/catalog"
      }} />
      <Header />

      <main className="flex-grow pb-20 pt-24">
        {heroImage && (
          <div className="relative h-[300px] md:h-[400px] overflow-hidden mb-12">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/70" />
            <div className="absolute inset-0 flex items-center">
                <div className="container max-w-[1536px]">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Back to Home
                </Link>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tight">
                  {heroTitle} <span className="text-white/40">COLLECTION</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  Explore our premium selection of {heroTitle} laptops, curated for performance and reliability.
                </p>
              </div>
            </div>
          </div>
        )}

          <div className={cn("container max-w-[1536px]", !heroImage && "pt-24")}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              {!heroImage && (
                <h1 className="text-4xl md:text-5xl font-black text-navy mb-4 tracking-tight">
                  LAPTOP <span className="text-navy/40">CATALOG</span>
                </h1>
              )}
              <div className="flex flex-wrap gap-2">
                {activeCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-navy text-white text-xs font-bold">
                    {activeCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('category')} />
                  </span>
                )}
                {activeBrand && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                    {activeBrand}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('brand')} />
                  </span>
                )}
                  {activeSeries && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-white text-xs font-bold">
                      {activeSeries}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('series')} />
                    </span>
                  )}
                  {activeMinPrice && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
                      Min: {activeMinPrice}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('min_price')} />
                    </span>
                  )}
                  {activeMaxPrice && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
                      Max: {activeMaxPrice}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('max_price')} />
                    </span>
                  )}
                  {activeRams.map(ram => (
                    <span key={ram} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold">
                      RAM: {ram}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('ram', ram)} />
                    </span>
                  ))}
                  {activeStorages.map(storage => (
                    <span key={storage} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold">
                      Storage: {storage}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => clearFilter('storage', storage)} />
                    </span>
                  ))}
                </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search laptops..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-3 rounded-2xl border transition-all",
                  showFilters ? "bg-navy text-white border-navy" : "bg-white text-navy border-gray-100 hover:bg-gray-50"
                )}
              >
                <SlidersHorizontal className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {showFilters && (
              <aside className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-left duration-300">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Price Range</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Min</label>
                            <input 
                              type="number" 
                              placeholder="0"
                              className="w-full px-3 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-navy/5 text-sm"
                              value={draftMinPrice}
                              onChange={(e) => setDraftMinPrice(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Max</label>
                            <input 
                              type="number" 
                              placeholder="500000"
                              className="w-full px-3 py-2 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-navy/5 text-sm"
                              value={draftMaxPrice}
                              onChange={(e) => setDraftMaxPrice(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: '< 50k', min: '0', max: '50000' },
                            { label: '50k - 100k', min: '50000', max: '100000' },
                            { label: '100k - 200k', min: '100000', max: '200000' },
                            { label: '200k+', min: '200000', max: '' },
                          ].map((range) => (
                            <button
                              key={range.label}
                              onClick={() => {
                                if (draftMinPrice === range.min && draftMaxPrice === range.max) {
                                  setDraftMinPrice("");
                                  setDraftMaxPrice("");
                                } else {
                                  setDraftMinPrice(range.min);
                                  setDraftMaxPrice(range.max);
                                }
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                draftMinPrice === range.min && draftMaxPrice === range.max
                                  ? "bg-navy text-white border-navy"
                                  : "bg-gray-50 text-gray-600 border-gray-100 hover:border-navy/20"
                              )}
                            >
                              {range.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4">RAM Size</h3>
                    <div className="space-y-2">
                      {['4GB', '8GB', '16GB', '32GB', '64GB'].map((ram) => (
                        <label key={ram} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-gray-200 text-navy focus:ring-navy"
                            checked={draftRams.includes(ram)}
                            onChange={() => {
                              if (draftRams.includes(ram)) {
                                setDraftRams(draftRams.filter(r => r !== ram));
                              } else {
                                setDraftRams([...draftRams, ram]);
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-navy transition-colors">{ram}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4">Storage</h3>
                    <div className="space-y-2">
                      {['128GB', '256GB', '512GB', '1TB', '2TB'].map((storage) => (
                        <label key={storage} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-gray-200 text-navy focus:ring-navy"
                            checked={draftStorages.includes(storage)}
                            onChange={() => {
                              if (draftStorages.includes(storage)) {
                                setDraftStorages(draftStorages.filter(s => s !== storage));
                              } else {
                                setDraftStorages([...draftStorages, storage]);
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-navy transition-colors">{storage}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      onClick={applyFilters}
                      className="w-full py-3 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-navy/90 transition-all shadow-lg shadow-navy/10"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={resetFilters}
                      className="w-full py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </aside>
            )}

            <div className={cn(
                "grid gap-4 md:gap-6 transition-all duration-300",
                showFilters ? "lg:col-span-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "lg:col-span-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
            )}>
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                    <Loader size="sm" className="mb-4" />
                    <p className="font-medium">Updating catalog...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium">No laptops found matching your criteria.</p>
                </div>
              ) : (
                paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && filteredProducts.length > itemsPerPage && (
              <div className="flex items-center justify-end gap-3 mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-100 font-bold text-sm text-navy disabled:text-gray-300 disabled:border-gray-100 hover:enabled:bg-gray-50 transition-all"
                >
                  ← Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={cn(
                        "w-8 h-8 rounded-md font-bold text-xs transition-all",
                        currentPage === page
                          ? "bg-navy text-white"
                          : "bg-gray-50 text-navy border border-gray-100 hover:bg-gray-100"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-100 font-bold text-sm text-navy disabled:text-gray-300 disabled:border-gray-100 hover:enabled:bg-gray-50 transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader size="md" /></div>}>
      <CatalogContent />
    </Suspense>
  );
}


