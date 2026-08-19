"use client";

import { useSnowfall } from "@/context/snowfall-context";
import { Snowflake, Cloud } from "lucide-react";

export function SnowfallToggle() {
  const { isEnabled, toggleSnowfall } = useSnowfall();

  return (
    <button
      onClick={toggleSnowfall}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
        isEnabled
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {isEnabled ? (
        <>
          <Snowflake className="w-4 h-4" />
        </>
      ) : (
        <>
          <Cloud className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

