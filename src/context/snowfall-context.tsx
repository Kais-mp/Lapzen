"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SnowfallContextType = {
  isEnabled: boolean;
  toggleSnowfall: () => void;
};

const SnowfallContext = createContext<SnowfallContextType | undefined>(undefined);

export function SnowfallProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("snowfall_enabled");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }
  }, []);

  const toggleSnowfall = () => {
    setIsEnabled((prev) => {
      const newState = !prev;
      localStorage.setItem("snowfall_enabled", String(newState));
      return newState;
    });
  };

  return (
    <SnowfallContext.Provider value={{ isEnabled, toggleSnowfall }}>
      {children}
    </SnowfallContext.Provider>
  );
}

export function useSnowfall() {
  const context = useContext(SnowfallContext);
  if (context === undefined) {
    throw new Error("useSnowfall must be used within a SnowfallProvider");
  }
  return context;
}
