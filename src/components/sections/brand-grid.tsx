import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

interface BrandCardProps {
  name: string;
  image: string;
  href: string;
  description?: string;
}

const brands: BrandCardProps[] = [
  {
    name: 'HP',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/hp-1767119994306.jpeg?width=8000&height=8000&resize=contain',
    href: '/brands/hp'
  },
  {
    name: 'DELL',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/dell-1767119994307.jpeg?width=8000&height=8000&resize=contain',
    href: '/brands/dell'
  },
  {
    name: 'APPLE',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/apple-1767119994307.jpeg?width=8000&height=8000&resize=contain',
    href: '/brands/apple'
  },
  {
    name: 'LENOVO',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/lenovo-1767119994306.jpeg?width=8000&height=8000&resize=contain',
    href: '/brands/lenovo'
  },
  {
    name: 'ACER',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/acer-1767119994307.jpeg?width=8000&height=8000&resize=contain',
    href: '/brands/acer'
  },
    {
      name: 'TOSHIBA',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/toshiba-2-1767201502533.jpeg?width=8000&height=8000&resize=contain',
      href: '/brands/toshiba'
    }
];

const BrandCard = ({ name, image, href }: BrandCardProps) => {
  return (
      <div className="group flex flex-col items-center">
        <Link 
          href={href} 
          className="relative w-full aspect-[16/9] overflow-hidden rounded-[20px] border border-black/5 glass-card transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
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
          className="mt-4 flex items-center gap-2 text-foreground font-medium tracking-wider uppercase text-lg group-hover:text-foreground/70 transition-colors"
        >
          {name}
          <MoveRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
  );
};

export default function BrandGrid() {
  return (
    <section className="px-6 sm:px-10 py-4 md:py-6">
      <div className="container">
        <h2 className="mb-8">
          Explore Laptops By Top Brands
        </h2>
        
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
    </section>
  );
}

