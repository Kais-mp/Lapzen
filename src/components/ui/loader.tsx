import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "md:w-48 md:h-48 h-32 w-32",
    lg: "md:w-64 md:h-64 h-48 w-48",
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Spinning Border Component */}
      <div
        className="absolute inset-0 p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 rounded-full"
      >
        <div
          className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 backdrop-blur-md"
        />
      </div>
      
      {/* Central Logo (Static) */}
      <div className="relative z-10 w-[60%] h-[60%] rounded-full overflow-hidden bg-white">
        <Image
          src="/logo.png"
          alt="Lapzen Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader />
    </div>
  );
}
