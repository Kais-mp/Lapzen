import React from 'react';
import Image from 'next/image';

const ManSVG = () => (
  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-slate-400" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

const WomanSVG = () => (
  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-slate-400" fill="currentColor">
      <path d="M12 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zM12 11c-2.5 0-4.5-2-4.5-4.5S9.5 2 12 2s4.5 2 4.5 4.5S14.5 11 12 11z" opacity="0.1" />
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      <path d="M12 13c-2 0-3.5-1.5-3.5-3.5S10 6 12 6s3.5 1.5 3.5 3.5S14 13 12 13z" fill="currentColor" opacity="0.3" />
    </svg>
  </div>
);

const TeamGrid = () => {
  const teamMembers = [
    {
      name: "Mr. ASIM",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/WhatsApp_Image_2025-11-01_at_9.41.48_AM-1767031510531.webp?width=8000&height=8000&resize=contain",
      content: (
        <>
          <p className="mb-4">The Owner of <a href="/catalog" className="text-[#002b5c] hover:underline">LAPZEN</a></p>
          <p className="mb-4">A Tech Enthusiast</p>
          <p className="mb-4">Founder of LAPZEN</p>
          <p>
            <strong>Any Query,</strong><br />
            Feel Free to contact us at <a href="https://wa.me/+923090009022" className="text-[#002b5c] hover:underline">Whatsapp</a>
          </p>
        </>
      )
    },
    {
      name: "Mr. KASHIF",
      isSVG: true,
      svg: <ManSVG />,
      content: (
        <>
          <p className="mb-4">The Developer of the store.</p>
          <p>Maintaining the Live Store <a href="/catalog" className="text-[#002b5c] hover:underline">LAPZEN</a> for our valuable Customers.</p>
        </>
      )
    },
    {
      name: "Mrs. NIBA",
      isSVG: true,
      svg: <WomanSVG />,
      content: (
        <>
          <p className="mb-4">
            Co-Founder of <a href="/about" className="text-[#002b5c] hover:underline">LAPZEN</a><br />
            The Marketing Mastermind of Team <a href="/catalog" className="text-[#002b5c] hover:underline">LAPZEN</a>
          </p>
          <p className="mb-4">Digital Marketing Manager</p>
          <p>Social Media Marketer</p>
        </>
      )
    }
  ];

    return (
      <section className="relative z-10 rounded-t-[5rem] md:rounded-t-[8rem] -mt-20 overflow-hidden">
          {/* Background with gradient and blur effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/5 via-blue-900/10 to-slate-900/15 backdrop-blur-3xl pointer-events-none"></div>
          
          {/* Rich Text Intro Section */}
          <div className="relative pt-24 pb-12 px-5 bg-gradient-to-b from-white/95 to-white/90 rounded-t-[5rem] md:rounded-t-[8rem] backdrop-blur-md border-b border-white/30">
            <div className="max-w-[1200px] mx-auto text-center">
              <h2 className="text-[48px] md:text-[84px] font-black italic uppercase leading-[0.85] mb-8 text-navy tracking-tighter">
                TEAM LAPZEN
              </h2>
              <div className="text-[14px] md:text-base text-slate-400 font-bold tracking-[0.4em] uppercase">
                <p>Introducing the tech team</p>
              </div>
            </div>
          </div>

      {/* Team Grid Section with ultra glass effect */}
      <div className="relative pb-[100px] px-5 bg-white">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[60px]">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-member-card group flex flex-col rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:scale-105"
              >
                {/* Ultra glass background with multiple layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-white/10 rounded-[2.5rem] backdrop-blur-3xl border border-white/40 group-hover:border-white/70 group-hover:from-white/70 group-hover:via-white/50 group-hover:to-white/30 transition-all duration-500 pointer-events-none"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/0 via-blue-300/0 to-purple-400/0 group-hover:from-blue-400/20 group-hover:via-blue-300/30 group-hover:to-purple-400/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="relative w-full aspect-square overflow-hidden mb-6 rounded-[1.8rem] shadow-[0_12px_40px_0_rgba(0,43,92,0.12)] group-hover:shadow-[0_20px_60px_0_rgba(59,130,246,0.2)] transition-all duration-500 group-hover:-translate-y-3 ring-1.5 ring-white/60 group-hover:ring-white/80 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none">
                    {member.isSVG ? (
                      member.svg
                    ) : (
                      <Image
                        src={member.image!}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-115"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start w-full">
                    <div className="relative w-full">
                      <h3 className="text-[28px] md:text-[32px] font-black leading-tight text-navy tracking-tight group-hover:text-blue-700 transition-colors duration-300 pb-3">
                        {member.name}
                      </h3>
                      {/* Sliding underline that spans full name width */}
                      <div className="team-member-underline" style={{ width: 0 }}></div>
                    </div>
                    
                    <div className="mt-6 text-[15px] md:text-[17px] leading-[1.8] text-slate-600 font-medium group-hover:text-slate-700 transition-colors duration-300">
                      {member.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
