import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mdias/types", "@mdias/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.mapbox.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
};

export default nextConfig;
