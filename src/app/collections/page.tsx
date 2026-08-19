"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, ArrowRight, LayoutGrid, Laptop2, Landmark } from "lucide-react";

// Brands definition synced with homepage
const brands = [
  {
    name: 'HP',
    image: 'https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=800&q=80',
    href: '/catalog?brand=HP'
  },
  {
    name: 'DELL',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    href: '/catalog?brand=Dell'
  },
  {
    name: 'APPLE',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    href: '/catalog?brand=Apple'
  },
  {
    name: 'LENOVO',
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80',
    href: '/catalog?brand=Lenovo'
  },
  {
    name: 'ASUS',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    href: '/catalog?brand=Asus'
  },
  {
    name: 'ACER',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    href: '/catalog?brand=Acer'
  }
];

// Categories definition synced with homepage
const categories = [
  {
    title: "Gaming",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/gaming-resized-1767120834252.webp?width=800&height=800&resize=contain",
    href: "/catalog?category=Gaming",
  },
    {
      title: "ChromeBooks",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/chromebooks-1767120833869.webp?width=800&height=800&resize=contain",
      href: "/catalog?category=ChromeBooks",
    },
  {
    title: "Workstations",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/workstations-1767120833870.webp?width=800&height=800&resize=contain",
    href: "/catalog?search=Workstation",
  },
  {
    title: "Business",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/business-1767120833871.webp?width=800&height=800&resize=contain",
    href: "/catalog?category=Business",
  },
  {
    title: "2-in-1",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/2-in-1-1767120833874.webp?width=800&height=800&resize=contain",
    href: "/catalog?category=2-in-1",
  },
  {
    title: "All Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    href: "/catalog",
  },
];

// Series definition synced with homepage
const seriesList = [
  {
    title: "HP EliteBooks",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Hp-elitebook-1767121413659.webp?width=800&height=800&resize=contain",
    href: "/series/hp-elitebook",
    subtext: "Elite performance. Built for professionals. Secure & reliable."
  },
  {
    title: "Apple MacBook",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    href: "/series/apple-macbook",
    subtext: "Creativity meets performance. Premium in every detail."
  },
  {
    title: "Dell Latitude",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/dell-latitude-1767121413633.webp?width=800&height=800&resize=contain",
    href: "/series/dell-latitude",
    subtext: "Latitude series. Best in Performance, Cheaper in Price"
  },
  {
    title: "Lenovo ThinkPad",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/lenovo-thinkpad-1767121413587.webp?width=800&height=800&resize=contain",
    href: "/series/lenovo-thinkpad",
    subtext: "Strong, reliable, and performance-driven."
  },
  {
    title: "Dell XPS",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    href: "/series/dell-xps",
    subtext: "Boundary-pushing design. The ultimate premium laptop."
  },
    {
      title: "HP Omen",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/omen-1767178081801.jpeg?width=800&height=800&resize=contain",
      href: "/series/hp-omen",
      subtext: "Gaming unleashed. High-performance gaming gear."
    },
    {
      title: "Lenovo Legion",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/legion-1767204792776.jpeg?width=800&height=800&resize=contain",
      href: "/series/lenovo-legion",
      subtext: "Stylish outside, savage inside. Pure gaming power."
    },
    {
      title: "Dell Precision",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/precision-1767178081799.jpeg?width=800&height=800&resize=contain",
      href: "/series/dell-precision",
      subtext: "Professional workstations. Performance without limits."
    },
      {
        title: "HP ZBook",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/zbook-1767201940243.jpeg?width=800&height=800&resize=contain",
        href: "/series/hp-zbook",
        subtext: "Power to create. The ultimate mobile workstation."
      },
        {
          title: "Lenovo Thinkbook",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/thinkbook-1767202143202.jpeg?width=800&height=800&resize=contain",
          href: "/series/lenovo-thinkbook",
          subtext: "Modern standby. Built for small business agility."
        },
        {
          title: "Lenovo Yoga",
          image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/37a0c0cf-0b35-45c9-84ca-b967aca3e2b6/Yoga-7-2-in-1-14IML9-1771779865267.webp?width=800&height=800&resize=contain",
          href: "/series/lenovo-yoga",
          subtext: "Bend the rules. 2-in-1 versatility meets premium style."
        },
    {
      title: "Toshiba",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
      href: "/series/toshiba",
      subtext: "Leading innovation. Reliable technology for every user."
    },
    {
      title: "Asus",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/asus-1767204792775.jpeg?width=800&height=800&resize=contain",
      href: "/series/asus",
      subtext: "In search of incredible. Performance meets art."
    }
  ];

export default function CollectionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-5 lg:px-8 max-w-[1200px]">
          {/* Header Section */}
          <div className="mb-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#002b5c] mb-4 tracking-tight">
              Our <span className="text-red-600">Collections</span>
            </h1>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Explore our premium range of laptops curated for every gamer, business leader, and ChromeBook user.
              </p>
          </div>

          {/* Brands Section */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#002b5c]/5 text-[#002b5c] flex items-center justify-center">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#002b5c] m-0 uppercase tracking-wide">Top Brands</h2>
                  <p className="text-sm text-slate-400 m-0">Leading global manufacturers</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {brands.map((brand) => (
                <BrandCard 
                  key={brand.name}
                  name={brand.name}
                  image={brand.image}
                  href={brand.href}
                />
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-[#002b5c]/5 text-[#002b5c] flex items-center justify-center">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#002b5c] m-0 uppercase tracking-wide">Shop by Categories</h2>
                <p className="text-sm text-slate-400 m-0">Find the perfect laptop for your needs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.title}
                  title={category.title}
                  image={category.image}
                  href={category.href}
                />
              ))}
            </div>
          </div>

          {/* Series Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-[#002b5c]/5 text-[#002b5c] flex items-center justify-center">
                <Laptop2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#002b5c] m-0 uppercase tracking-wide">Shop by Popular Series</h2>
                <p className="text-sm text-slate-400 m-0">The most sought-after laptop lineups</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {seriesList.map((item) => (
                <SeriesCard 
                  key={item.title}
                  title={item.title}
                  image={item.image}
                  href={item.href}
                  subtext={item.subtext}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BrandCard({ name, image, href }: { name: string; image: string; href: string }) {
  return (
    <div className="group flex flex-col items-center">
      <Link 
        href={href} 
        className="relative w-full aspect-[16/9] overflow-hidden rounded-[20px] border border-black/5 bg-slate-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      >
        <Image
          src={image}
          alt={`${name} Laptop Collection`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      <Link 
        href={href} 
        className="mt-4 flex items-center gap-2 text-[#002b5c] font-medium tracking-wider uppercase text-lg group-hover:text-red-600 transition-colors"
      >
        {name}
        <MoveRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function CategoryCard({ title, image, href }: { title: string; image: string; href: string }) {
  return (
    <Link 
      href={href}
      className="group flex flex-col items-center"
    >
      <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden border border-black/5 bg-[#f8fafc]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
      </div>
      <h3 className="text-[18px] font-medium uppercase text-center mt-[16px] flex items-center gap-[8px] transition-colors text-[#002b5c] group-hover:text-red-600">
        {title}
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </h3>
    </Link>
  );
}

function SeriesCard({ title, image, href, subtext }: { title: string; image: string; href: string; subtext?: string }) {
  return (
    <Link href={href} className="group cursor-pointer flex flex-col items-center text-center">
      <div className="relative w-full overflow-hidden rounded-[20px] border border-black/5 bg-[#f8fafc] aspect-[16/10] mb-4 transition-all duration-300 group-hover:-translate-y-2">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
      </div>
      <div className="inline-flex items-center justify-center gap-2 group">
        <h3 className="text-[16px] md:text-[18px] font-medium uppercase tracking-tight text-[#002b5c] transition-colors duration-300 group-hover:text-red-600">
          {title}
        </h3>
        <ArrowRight 
          className="w-4 h-4 text-[#002b5c] transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-red-600" 
          strokeWidth={2.5}
        />
      </div>
        {subtext && (
          <p className="text-[13px] md:text-[14px] text-slate-500 font-normal leading-relaxed mt-1.5 max-w-[280px] mx-auto italic">
            {subtext}
          </p>
        )}
    </Link>
  );
}
