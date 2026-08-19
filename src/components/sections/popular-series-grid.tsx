"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * PopularSeriesSection component clones the "Shop by Popular Series" section of Lapzen.
 * It features a grid of cards for popular laptop series with high-tech "glassmorphism" styling.
 * 
 * Design Details:
 * - Theme: Dark (Deep navy background #001B34)
 * - Container: Max-width 1440px
 * - Typography: Inter (Sans-serif), uppercase headings
 * - Cards: Rounded corners (20px), glassmorphism effect, hover lift animation
 * - Layout: Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)
 */

const PopularSeriesSection = () => {
    const series = [
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
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/xps-1767201494398.jpeg?width=800&height=800&resize=contain",
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
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/toshiba-2-1767201502533.jpeg?width=800&height=800&resize=contain",
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

  return (
    <section className="w-full overflow-hidden py-4 md:py-6">
      <div className="container max-w-[1536px]">
        {/* Section Heading */}
        <div className="mb-8 text-center">
          <h2>
            Shop by Popular Series
          </h2>
        </div>

        {/* Popular Series Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {series.map((item, index) => (
            <Link key={index} href={item.href} className="group cursor-pointer flex flex-col items-center">
              {/* Card Image Wrapper with Glassmorphism and Hover Effect */}
              <div className="relative w-full overflow-hidden rounded-[20px] glass-card aspect-[16/10] mb-[15px] md:mb-[20px] animate-hover-lift">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  priority={index < 4}
                />
                {/* Bottom shadow overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Card Content */}
              <div className="text-center w-full px-2">
                  <div className="inline-flex items-center justify-center gap-2 group">
                    <h3 className="text-[16px] md:text-[18px] font-medium uppercase tracking-[0.02em] text-foreground transition-colors duration-300 group-hover:text-foreground/70">
                      {item.title}
                    </h3>
                    <ArrowRight 
                      className="w-4 h-4 text-foreground transition-transform duration-300 group-hover:translate-x-1.5" 
                      strokeWidth={2.5}
                    />
                  </div>
                  
                    {/* Conditional subtext for specific series */}
                    {item.subtext && (
                      <p className="text-[13px] md:text-[14px] text-slate-500 font-normal leading-relaxed mt-1.5 max-w-[280px] mx-auto italic">
                        {item.subtext}
                      </p>
                    )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSeriesSection;
