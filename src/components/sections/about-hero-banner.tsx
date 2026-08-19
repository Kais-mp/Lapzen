"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * AboutHeroBanner Component
 * 
 * Clones the hero banner section from the Lapzen About page.
 * Features:
 * - Full-width layout with the brand logo image centered on a white background.
 * - Zoom-in animation effect on the brand image.
 * - Fade-in and slide-up animation for the entire section on load.
 * - Responsive height values matching the 'banner--small' configuration.
 * - Logo rotates clockwise based on scroll position.
 */
const AboutHeroBanner = () => {
  const [isAnimate, setIsAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate rotation based on scroll position (360 degrees per 1000px of scroll)
      const scrollY = window.scrollY;
      const newRotation = (scrollY % 360); // Continuous rotation
      setRotation(newRotation);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="about-hero" 
      className="sticky top-0 w-full h-[80vh] md:h-screen overflow-hidden bg-white flex flex-col items-center justify-center -z-10"
    >
      {/* Particle background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && [...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-navy/5 rounded-full"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      <div 
        className={`
          relative 
          w-full 
          max-w-[400px] 
          md:max-w-[600px]
          aspect-square
          flex
          items-center
          justify-center
          transition-all 
          duration-[1500ms] 
          ease-out 
          ${isAnimate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}
      >
        {mounted && (
          <div style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }}>
            <Image
              src="/logo.png"
              alt="Lapzen Brand"
              width={300}
              height={300}
              className="w-[280px] h-[280px] object-contain select-none pointer-events-none"
              priority
            />
          </div>
        )}
        
        {/* Decorative circular element matching reference */}
        <div className="absolute inset-0 rounded-full border border-navy/[0.03] animate-[spin_100s_linear_infinite]" />
        <div className="absolute inset-[10%] rounded-full border border-dashed border-navy/[0.05] animate-[spin_150s_linear_infinite_reverse]" />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  );
};

export default AboutHeroBanner;
