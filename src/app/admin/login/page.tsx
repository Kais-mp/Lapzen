"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Force a full page reload to the admin dashboard
        // This ensures the middleware picks up the new cookie
        window.location.href = "/admin";
      } else {
        setError(data.error || "Invalid password");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-navy/10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-navy/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-navy/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-navy/5 border border-slate-100 mb-6 group transition-all hover:scale-105">
            <Image 
              src="/logo.png" 
              alt="Lapzen" 
              width={64} 
              height={64} 
              className="w-14 h-14 object-contain" 
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-navy" />
            <h1 className="text-3xl font-bold tracking-tight text-navy">Admin Portal</h1>
          </div>
          <p className="text-slate-500 font-medium">Restricted area. Please authenticate.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-navy/5 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-navy transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-navy/5 focus:border-navy transition-all placeholder:text-slate-400 text-navy font-medium text-lg"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-[#ffff] py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#00172E]/90 active:scale-[0.98] transition-all disabled:opacity-70 shadow-lg shadow-navy/20 group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 text-[#ffff] transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="h-[1px] w-8 bg-slate-200" />
            <span className="text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</span>
            <div className="h-[1px] w-8 bg-slate-200" />
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-sm font-bold text-navy hover:text-navy/70 transition-colors flex items-center gap-2"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
