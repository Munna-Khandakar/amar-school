import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  reactStrictMode: true,
  // Disable experimental features that might cause issues
  experimental: {
    turbo: undefined, // Explicitly disable Turbopack
  },
};

export default nextConfig;
