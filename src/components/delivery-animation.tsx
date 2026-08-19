"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Package } from "lucide-react";

interface ButtonDeliveryAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
  type: "buyNow" | "addToCart";
}

export function ButtonDeliveryAnimation({ isOpen, onComplete, type }: ButtonDeliveryAnimationProps) {
  const [step, setStep] = useState<"loading" | "loaded" | "away">("loading");

  useEffect(() => {
    if (isOpen) {
      setStep("loading");
      
      // Sequence:
      // 1. Loading parcel (0.5s)
      // 2. Loaded (wait 0.5s)
      // 3. Drive away (if buyNow, 1s)
      
      const timer1 = setTimeout(() => {
        setStep("loaded");
      }, 800);

      let timer2: NodeJS.Timeout;
      if (type === "buyNow") {
        timer2 = setTimeout(() => {
          setStep("away");
        }, 1500);
      }

      const timer3 = setTimeout(() => {
        onComplete();
      }, type === "buyNow" ? 2500 : 1500);

      return () => {
        clearTimeout(timer1);
        if (timer2) clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen, type, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-inherit rounded-[inherit]">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Road line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-2 left-4 right-4 h-[1px] bg-current opacity-20" 
        />
        
        {/* Truck Container */}
        <motion.div
          initial={{ x: -100 }}
          animate={{ 
            x: step === "away" ? 200 : 0,
            transition: { type: "spring", damping: 20, stiffness: 100 }
          }}
          className="relative flex items-center justify-center"
        >
          {/* Parcel */}
          <AnimatePresence>
            {step === "loading" && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: -12, opacity: 1 }}
                exit={{ y: -12, opacity: 1 }}
                className="absolute z-10"
              >
                <Package className="w-4 h-4 text-orange-500" />
              </motion.div>
            )}
            {step !== "loading" && (
              <motion.div
                initial={{ y: -12 }}
                animate={{ y: -12 }}
                className="absolute z-10"
              >
                <Package className="w-4 h-4 text-orange-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Truck Body */}
          <div className="relative bg-navy p-1.5 rounded-md shadow-sm">
            <Truck className="w-5 h-5 text-white" />
            {/* Wheels */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
              className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-navy border-[1px] border-white rounded-full" 
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
              className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-navy border-[1px] border-white rounded-full" 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Deprecated: Old full-screen animation
export function DeliveryAnimation({ isOpen, onClose, type }: any) {
  return null; // Will be removed after updating ProductDetails
}
