"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PopupAd {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
}

const STORAGE_KEY = "lapzen_popup_dismissed";

export default function PopupAdOverlay() {
  const [ad, setAd] = useState<PopupAd | null>(null);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    async function fetchAndShowAd() {
      try {
        const res = await fetch("/api/popup-ad");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.id) {
          setAd(data);
          setVisible(true);
        }
      } catch {
        // silently fail
      }
    }

    // Wait for page to fully load, then show popup after 2.5 seconds
    const showPopupAfterLoad = () => {
      setTimeout(() => {
        fetchAndShowAd();
      }, 2500); // 2.5 second delay after page load
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      showPopupAfterLoad();
    } else {
      // Wait for page to load
      window.addEventListener("load", showPopupAfterLoad);
      return () => window.removeEventListener("load", showPopupAfterLoad);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  return (
    <AnimatePresence>
      {visible && ad && (
        <>
          {/* Backdrop with gradient */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88, y: 30, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto w-full max-w-md border border-white/80 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Glow effect background */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#002b5c] via-transparent to-[#ff0000] opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300 -z-10" />

              {/* Animated background accent - navy glow */}
              <motion.div
                animate={isHovering ? { opacity: 0.8 } : { opacity: 0.3 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#002b5c] to-transparent rounded-full blur-3xl opacity-30 pointer-events-none"
              />

              {/* Close button with enhanced styling */}
              <motion.button
                onClick={dismiss}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 p-2.5 bg-gradient-to-br from-[#ff0000] to-[#ff0000]/80 rounded-full text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Premium badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#ff0000] to-[#ff0000]/80 text-white rounded-full shadow-lg shadow-red-500/30 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider">EXCLUSIVE</span>
              </div>

              {/* Image with overlay and effect */}
              {ad.image_url && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  {ad.link_url ? (
                    <a href={ad.link_url} onClick={dismiss} className="block relative group">
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full object-cover max-h-72 group-hover:brightness-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ) : (
                    <>
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full object-cover max-h-72 hover:brightness-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </>
                  )}
                </motion.div>
              )}

              {/* Text content with enhanced layout */}
              <div className="relative z-5 p-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h2 className="text-3xl font-black bg-gradient-to-r from-[#002b5c] to-[#ff0000] bg-clip-text text-transparent leading-tight">
                    {ad.title}
                  </h2>
                </motion.div>

                {ad.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-slate-600 text-base leading-relaxed font-medium"
                  >
                    {ad.description}
                  </motion.p>
                )}

                {/* Enhanced action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex gap-3 pt-2"
                >
                  {ad.link_url && (
                    <motion.a
                      href={ad.link_url}
                      onClick={dismiss}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 relative group px-6 py-4 bg-gradient-to-r from-[#002b5c] to-[#002b5c]/90 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-navy/40 hover:shadow-2xl hover:shadow-navy/60 transition-all duration-300 overflow-hidden"
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative">Shop Now</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.a>
                  )}
                  <motion.button
                    onClick={dismiss}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center ${
                      ad.link_url
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 shadow-md"
                        : "flex-1 bg-gradient-to-r from-[#ff0000] to-[#ff0000]/90 text-white shadow-xl shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/60"
                    }`}
                  >
                    {ad.link_url ? "Dismiss" : "Close"}
                  </motion.button>
                </motion.div>
              </div>

              {/* Pulse animation on edges */}
              <motion.div
                animate={isHovering ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#002b5c]/20 via-transparent to-[#ff0000]/20 pointer-events-none"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
