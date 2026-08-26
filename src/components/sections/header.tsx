"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Facebook, Instagram, Twitter, ArrowRight, Cloud } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import { slugify } from "@/lib/slugify";
import { useRouter } from "next/navigation";



const AnnouncementBar = () => {
  return (
    <div className="bg-[#002b5c] overflow-hidden py-2 px-4 relative flex items-center h-[36px]">
      <div className="flex-1 overflow-hidden relative">
        <div className="marquee-content whitespace-nowrap flex">
          {[...Array(10)].map((_, i) =>
          <span key={i} className="text-white text-[12px] font-medium inline-block mx-8">
              Get Free Delivery across all Pakistan!
            </span>
          )}
        </div>
      </div>
      <Link
        href="/catalog"
        className="text-[#00172E] bg-white text-[12px] rounded-[10px] hover:text-white hover:bg-[#00172E] font-bold underline ml-4 hover:opacity-80 transition-opacity whitespace-nowrap z-10">

        Shop now!
      </Link>
    </div>);

};

import { SERIES_MAPPING, CATEGORIES } from "@/lib/constants";

const Header = () => {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [matchingSeries, setMatchingSeries] = useState<{slug: string, name: string}[]>([]);
  const [matchingCategories, setMatchingCategories] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setMatchingSeries([]);
        setMatchingCategories([]);
        return;
      }

      const normalizedSearch = searchQuery.toLowerCase();

      // Filter series locally from mapping
      const filteredSeries = Object.entries(SERIES_MAPPING)
        .filter(([slug, name]) => 
          name.toLowerCase().includes(normalizedSearch)
        )
        .map(([slug, name]) => ({ slug, name }))
        .slice(0, 3);
      setMatchingSeries(filteredSeries);

      // Filter categories locally
      const filteredCategories = CATEGORIES.filter(cat => 
        cat.toLowerCase().includes(normalizedSearch)
      ).slice(0, 3);
      setMatchingCategories(filteredCategories);

      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSuggestions(data.slice(0, 5));
        } else {
          console.error("API returned non-array data:", data);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 20);

        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        setLastScrollY(currentScrollY);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setIsMobileMenuOpen(false);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

      return (
          <div className={cn(
            "fixed top-0 z-50 w-full transition-all duration-500 transform",
            mounted && !visible ? "-translate-y-full" : "translate-y-0"
          )}>
            <div className={cn(mounted && scrolled ? "hidden" : "block")}>
              <AnnouncementBar />
            </div>
      
            <header className={cn(
              "transition-all duration-300 flex items-center border-b border-black/5",
              mounted && scrolled ? 
                "h-[65px] bg-white shadow-sm" : 
                "h-[80px] lg:h-[90px] bg-white"
            )}>


          <div className="container mx-auto px-5 lg:px-8 max-w-[1536px] flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-900"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu">

              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2 group transition-all hover:scale-105 active:scale-95">
                    <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
                        <Image
                          src="/logo.png"
                          alt="Lapzen Logo"
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain"
                          priority />
                    </div>
              <span className="text-2xl font-bold tracking-tighter text-navy">Lapzen</span>
            </Link>
          </div>

            <nav className="hidden lg:flex items-center gap-8 ml-8 flex-1">
              <Link href="/" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                Home
              </Link>
                <Link href="/catalog" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                  Catalog
                </Link>
              <Link href="/collections" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                Collections
              </Link>
<Link href="/contact-us" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                    Contact
                  </Link>
                  <Link href="/blog" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                    Blogs
                  </Link>
                  <Link href="/about" className="nav-link text-slate-900 text-[14px] font-semibold hover:text-blue-700 border-b-2 border-b-transparent hover:border-b-blue-700 transition-colors pb-1">
                    About
                  </Link>
              </nav>

            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden lg:flex items-center gap-3 border-r border-black/10 pr-6 mr-2">
                  <a
                    href="https://web.facebook.com/lap.lapzen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(0,43,92,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">

                    <Facebook size={16} fill="currentColor" strokeWidth={0} />
                  </a>
                  <a
                    href="https://www.instagram.com/lapzenstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">

                    <Instagram size={16} />
                  </a>
                  <a
                    href="https://x.com/lapzenstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(0,43,92,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">

                    <Twitter size={16} fill="currentColor" strokeWidth={0} />
                  </a>

              </div>


            <div className="flex items-center gap-4 lg:gap-5">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-900 hover:text-blue-700 transition-colors" 
                aria-label="Search"
              >
                <Search size={22} />
              </button>
                      <Link href="/cart" className="text-slate-900 hover:text-blue-700 transition-colors relative" aria-label="Shopping cart">
                      <ShoppingCart size={22} />
                      <span className={cn(
                        "absolute -top-2 -right-2 bg-[#ff0000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300",
                        (!mounted || itemCount === 0) && "hidden"
                      )}>
                        {itemCount}
                      </span>
                    </Link>

              </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white flex flex-col"
          >
            <div className="container mx-auto px-5 lg:px-8 max-w-[1200px]">
              <div className="flex items-center justify-between h-[80px] lg:h-[90px] border-b border-black/5">
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-4">
                  <Search size={24} className="text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for laptops, brands, or series..."
                    className="flex-1 bg-transparent border-none outline-none text-xl lg:text-2xl font-medium placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="hidden lg:block bg-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-navy/90 transition-all active:scale-95">
                    Search
                  </button>
                </form>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

                <div className="py-8 max-w-3xl mx-auto">
                    {isLoadingSuggestions ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader size="sm" />
                      </div>
                      ) : (suggestions.length > 0 || matchingSeries.length > 0 || matchingCategories.length > 0) ? (
                      <div className="space-y-8">
                        {(matchingSeries.length > 0 || matchingCategories.length > 0) && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Suggestions</h3>
                            <div className="flex flex-wrap gap-2">
                              {matchingSeries.map((series) => (
                                <Link
                                  key={series.slug}
                                  href={`/series/${series.slug}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white rounded-xl text-sm font-bold transition-all border border-blue-100 flex items-center gap-2 group"
                                >
                                  {series.name}
                                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                              ))}
                              {matchingCategories.map((category) => (
                                <Link
                                  key={category}
                                  href={`/catalog?category=${encodeURIComponent(category)}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="px-5 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white rounded-xl text-sm font-bold transition-all border border-emerald-100 flex items-center gap-2 group"
                                >
                                  {category}
                                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}


                      {suggestions.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Product Suggestions</h3>
                          </div>
                          <div className="grid gap-4">
                            {suggestions.map((product) => {
                              const slug = slugify(product.title || 'product');
                              return (
                              <Link
                                key={product.id}
                                href={`/products/${slug}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-slate-50/50 transition-all duration-300 group active:scale-[0.98]"
                              >
                                <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={product.image_urls?.[0] || "/placeholder.jpg"}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-navy group-hover:text-blue-700 transition-colors">{product.title}</h4>
                                  <p className="text-sm text-slate-500 line-clamp-1">{product.series}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-navy">Rs. {product.price?.toLocaleString()}</p>
                                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter flex items-center gap-1 justify-end">
                                    View Product <ArrowRight size={10} />
                                  </span>
                                </div>
                              </Link>
                            );
                            })}
                          </div>
                        </div>
                      )}

                      {searchQuery.trim().length >= 2 && (
                        <button 
                          onClick={() => handleSearch()}
                          className="w-full py-4 text-center text-navy font-bold hover:text-blue-700 transition-colors border-t border-slate-100 mt-4 group"
                        >
                          Show all results for "{searchQuery}" <ArrowRight size={16} className="inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  ) : searchQuery.trim().length >= 2 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">No products found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Popular Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Gaming", value: "Gaming" },
                            { label: "Business", value: "Business" },
                            { label: "Chromebooks", value: "ChromeBooks" },
                            { label: "Workstations", value: "Workstations" }
                          ].map((cat) => (
                            <Link
                              key={cat.value}
                              href={`/catalog?category=${encodeURIComponent(cat.value)}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-white rounded-full text-sm font-bold transition-all"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Popular Brands</h3>
                      <div className="flex flex-wrap gap-2">
                        {["HP", "Dell", "Lenovo", "Asus", "Apple"].map((brand) => (
                          <Link
                            key={brand}
                            href={`/brands/${brand.toLowerCase()}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-navy hover:text-white rounded-full text-sm font-bold transition-all"
                          >
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
            <div
            className="absolute inset-0 bg-white"
            onClick={() => setIsMobileMenuOpen(false)} />

              <div className="absolute top-0 left-0 w-full h-full bg-white text-[#00172E] flex flex-col transition-transform duration-500 ease-out">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-white p-1.5 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                          <Image
                            src="/logo.png"
                            alt="Lapzen Logo"
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                      <span className="text-2xl font-bold tracking-tight text-[#00172E]">Lapzen</span>
                    </Link>

                  <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#00172E] hover:opacity-70 transition-colors">

                    <X size={28} />
                  </button>
                </div>
                
                <nav className="flex flex-col py-8">
                  <Link
                  href="/"
                  className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>

                    Home
                  </Link>
                    <Link
                  href="/catalog"
                  className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>

                      Catalog
                    </Link>
                  <Link
                  href="/collections"
                  className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}>

                    Collections
                  </Link>
<Link
                    href="/contact-us"
                    className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>

                          Contact
                        </Link>
                        <Link
                      href="/blog"
                      className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}>

                            Blogs
                          </Link>
                        <Link
                      href="/about"
                      className="px-8 py-5 text-[#00172E] text-[18px] font-bold border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}>

                            About
                          </Link>
                      </nav>

                      <div className="mt-auto p-8 flex flex-col gap-6 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                          <a
                            href="https://web.facebook.com/lap.lapzen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-[#00172E] hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(0,43,92,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">
    
                            <Facebook size={20} fill="currentColor" strokeWidth={0} />
                          </a>
                          <a
                            href="https://www.instagram.com/lapzenstore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-[#00172E] hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">
    
                            <Instagram size={20} />
                          </a>
                          <a
                            href="https://x.com/lapzenstore"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-[#00172E] hover:bg-gradient-to-tr hover:from-[#002b5c] hover:to-[#ff0000] hover:text-white hover:shadow-[0_0_15px_rgba(0,43,92,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110">
    
                            <Twitter size={20} fill="currentColor" strokeWidth={0} />
                          </a>
                        </div>
                      </div>


              </div>
          </div>
      )}
    </div>);

};

export default Header;

