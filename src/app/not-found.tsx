import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Grid overlay */}
      <div className="grid-overlay absolute inset-0 opacity-10 pointer-events-none" />
      
        <div className="relative z-10 max-w-md w-full">
          <div className="relative mb-12 flex flex-col items-center">
            <h1 className="text-[120px] sm:text-[160px] font-black text-navy/10 leading-none select-none">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy -mt-6 sm:-mt-8">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed px-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="h-12 px-8 gap-2 w-full">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/catalog" className="w-full sm:w-auto">
            <Button variant="outline" className="h-12 px-8 gap-2 w-full">
              <Search className="w-4 h-4" />
              Browse Catalog
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-navy/5">
          <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
            LAPZEN
          </p>
          <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
            Premium Tech Store
          </p>
        </div>
      </div>
    </div>
  );
}

