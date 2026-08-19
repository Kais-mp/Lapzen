"use client";

import dynamic from "next/dynamic";
import { useSnowfall } from "@/context/snowfall-context";

const Snowfall = dynamic(() => import("react-snowfall"), {
  ssr: false,
});

export default function SnowfallEffect() {
  const { isEnabled } = useSnowfall();

  if (!isEnabled) return null;

  return (
    <Snowfall
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    />
  );
}
