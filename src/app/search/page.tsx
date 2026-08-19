"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ShoppingBag, Frown } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { ProductCard } from "@/components/product-card";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const fetchResults = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
      setSearchQuery(initialQuery);
      
      import('@/lib/meta-client').then(({ trackMetaEvent }) => {
        trackMetaEvent('Search', {
          search_string: initialQuery,
        });
      });
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="flex-grow pt-12">
      <div className="container max-w-[1536px] mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-navy uppercase tracking-tighter mb-8">
            {hasSearched ? "Search Results" : "Search Our Store"}
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search for laptops, brands, or series..." 
              className="h-14 pl-12 text-lg rounded-xl border-navy/10 focus:border-navy"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-navy/90 transition-all">
              Search
            </button>
          </form>
        </div>
      </div>
      
      <div className="container max-w-[1536px] pb-20">
        <div className="flex items-center gap-2 mb-8 text-muted-foreground border-b border-slate-100 pb-4">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-widest">
            {isLoading ? "Searching..." : hasSearched ? `Found ${results.length} products` : "Showing all products"}
          </span>
        </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader size="md" className="mb-4" />
              <p className="text-navy/40 font-bold">Finding the best laptops for you...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
        ) : hasSearched ? (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="flex justify-center mb-4">
              <Frown className="w-16 h-16 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-navy mb-2">No results found</h3>
            <p className="text-slate-500">We couldn't find any products matching "{searchQuery}". Try a different keyword.</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400">Enter a keyword to start searching</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <Loader size="md" />
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
