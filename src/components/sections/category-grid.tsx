import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * CategoryGrid Component
 * Clones the "Shop by Categories" section with a 3-column grid of visual category cards.
 * Adheres strictly to the 'dark' theme as requested.
 */
const CategoryGrid = () => {
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
        title: "Ultra Light",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop",
        href: "/catalog?category=Ultra%20Light",
      },
    ];

  return (
    <section className="px-6 py-4 md:py-6">
      <div className="container max-w-[1536px]">
        {/* Section Heading */}
        <h2 className="text-center mb-8">
          Shop by Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
          {categories.map((category, index) => (
              <Link 
                key={index} 
                href={category.href}
                className="group flex flex-col items-center animate-hover-lift"
              >
                {/* Card Media Wrapper */}
                <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden border border-black/5 bg-card">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 3}
                  />
                  {/* Subtle Glass Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
                </div>

                {/* Card Label */}
                <h3 className="text-[18px] font-medium uppercase text-center mt-[16px] flex items-center gap-[8px] transition-colors text-foreground group-hover:text-foreground/70">
                  {category.title}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </h3>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
