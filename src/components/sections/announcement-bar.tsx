import React from 'react';

const AnnouncementBar: React.FC = () => {
  const announcementText = "Get Free Delivery across all Pakistan!";
  
  // Create a sufficient number of repetitions to ensure the bar is always full
  // before the marquee animation resets.
  const repetitions = 12;

  return (
    <div 
      className="bg-[#002b5c] text-white h-[40px] flex items-center justify-between overflow-hidden relative z-[100] border-b border-white/5"
      role="region"
      aria-label="Announcement"
    >
      <div className="flex-1 overflow-hidden h-full flex items-center relative">
        <div className="marquee-content h-full flex items-center">
          {/* First set of scrolling text */}
          <div className="flex items-center flex-nowrap shrink-0">
            {Array.from({ length: repetitions }).map((_, i) => (
              <span 
                key={`set1-${i}`} 
                className="px-6 text-[13px] font-medium tracking-wide whitespace-nowrap"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {announcementText}
              </span>
            ))}
          </div>
          
          {/* Duplicate set for seamless looping (required for the -50% translateX animation) */}
          <div className="flex items-center flex-nowrap shrink-0">
            {Array.from({ length: repetitions }).map((_, i) => (
              <span 
                key={`set2-${i}`} 
                className="px-6 text-[13px] font-medium tracking-wide whitespace-nowrap"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {announcementText}
              </span>
            ))}
          </div>
        </div>
        
        {/* Subtle gradient to mask text as it slides behind the fixed CTA */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#002b5c] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Fixed CTA Link Section */}
      <div className="bg-[#002b5c] h-full flex items-center pl-2 pr-6 relative z-20">
        <a 
          href="#" 
          className="text-[13px] font-bold underline underline-offset-4 decoration-1 hover:text-white/80 transition-colors whitespace-nowrap"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Shop now!
        </a>
      </div>
    </div>
  );
};

export default AnnouncementBar;