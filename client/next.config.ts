import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //  THIS LINE skips ESLint during build
  },
};

export default nextConfig;
