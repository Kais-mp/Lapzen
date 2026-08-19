import React from 'react';

const AboutIntro: React.FC = () => {
  return (
    <section 
      id="shopify-section-template--19902179049696__rich-text" 
      className="bg-white py-[40px] md:py-[60px] lg:py-[80px]"
    >
      <div className="isolate">
        <div className="rich-text content-container color-scheme-1 gradient rich-text--full-width content-container--full-width">
          <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-20">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <h2 
                className="text-[48px] md:text-[64px] font-bold uppercase italic leading-[1.1] tracking-[-0.02em] text-[#000000] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <em><strong>LAPZEN</strong></em>
              </h2>
              <div 
                className="rich-text__text animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-out fill-mode-both"
              >
                <p 
                  className="text-[16px] leading-[1.6] text-[#000000]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Introducing the tech team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;