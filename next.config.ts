import type { NextConfig } from "next";
import path from "node:path";
const loaderPath = require.resolve("orchids-visual-edits/loader.js");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // ✅ Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    turbopack: {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [loaderPath],
        },
      },
    },
  },
};

export default nextConfig;
// Orchids restart: 1767091675682
