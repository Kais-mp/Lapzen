import React from 'react';

/**
 * BrandStory Section Component
 * 
 * Clones the Lapzen brand introduction section featuring a stylized title, 
 * founder description, and CTA button.
 * Adheres to the 'dark' theme requirement using the brand's navy palette.
 */
const BrandStory: React.FC = () => {
  return (
    <section 
      id="brand-story" 
      className="flex flex-col items-center text-center overflow-hidden py-4 md:py-6"
    >
      <div className="container flex flex-col items-center">
        {/* Stylized LAPZEN Title */}
        <h2 
          className="text-[80px] md:text-[120px] font-black italic tracking-tighter leading-none mb-6 select-none opacity-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ 
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            transform: 'skewX(-2deg) translate(-50%, -50%)',
            letterSpacing: '-0.04em',
            WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
            color: 'transparent'
          }}
        >
          LAPZEN
        </h2>

        <div className="relative z-10">
          <h2 className="mb-6 text-foreground">Our Story</h2>
          
          {/* Founder-based description */}
          <div className="max-w-[800px] mx-auto mb-8">
            <p className="text-[16px] md:text-[20px] leading-[1.8] font-medium text-foreground/70">
              Founded by <span className="font-bold text-foreground">Mirza Muhammad Asim</span>, 
              is Pakistan&rsquo;s trusted store for new &amp; pre-owned laptops. 
              We serve students, professionals &amp; businesses with affordable quality laptops, 
              30-day warranty, and after-sales support.
            </p>
          </div>

          {/* Shop Now! CTA Button */}
          <div className="flex justify-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold uppercase text-[14px] tracking-wider px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95"
            >
              Shop Now!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;