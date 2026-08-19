"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // Minimum visibility time

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex items-center justify-center">
        {/* Loader Ring */}
        <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full flex items-center justify-center">
          <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 backdrop-blur-md"></div>
        </div>
        
            {/* Logo in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-white">
                <Image
                  src="/logo.png"
                  alt="Lapzen Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
      </div>
    </div>
  );
}
