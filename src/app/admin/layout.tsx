"use client";

import React from "react";
import Header from "@/components/sections/header";
import Image from "next/image";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ExternalLink, Menu, X, Settings, BookOpen, UserPlus, MessageSquare, Megaphone, Tag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Skip layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Inventory", href: "/admin/inventory", icon: Package },
        { label: "Sales Orders", href: "/admin/orders", icon: ShoppingCart },
        { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
        { label: "Users", href: "/admin/users", icon: Users },
      { label: "Invite Users", href: "/admin/invite-users", icon: UserPlus },
       { label: "Blog Posts", href: "/admin/blog-posts", icon: BookOpen },
       { label: "Popup Ads", href: "/admin/popup-ads", icon: Megaphone },
       { label: "Coupons", href: "/admin/coupons", icon: Tag },
       { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Header />
      
      <div className="flex flex-1 container pt-[160px] pb-12 gap-8 px-4 lg:px-8 max-w-[1400px] mx-auto flex-col lg:flex-row">
          {/* Sidebar Desktop */}
          <aside className="w-72 hidden lg:flex flex-col gap-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-8 sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="flex items-center gap-3 px-2">
              <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
                <Image src="/logo.png" alt="Lapzen" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter text-navy leading-none">Lapzen</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Panel</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                      isActive 
                        ? "bg-navy text-[#00172E] shadow-lg shadow-navy/10" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#00172E]" : "text-slate-400 group-hover:text-navy"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

<div className="h-[1px] bg-slate-100 mx-2" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2">
                </div>
              
              <Link
                href="/"
                className="flex items-center gap-3 p-4 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-navy transition-all font-bold text-sm group"
              >
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-navy" />
                View Store
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group w-full text-left"
              >
                <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-50" />
                Logout Session
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Lapzen" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="font-bold text-navy">Admin Portal</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-50 rounded-xl text-navy"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-4 rounded-xl font-bold ${
                      isActive ? "bg-navy text-white" : "text-slate-600 bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="h-[1px] bg-slate-100 my-2" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2">
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 rounded-xl font-bold text-red-500 bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <main className="flex-1 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}






