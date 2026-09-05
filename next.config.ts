import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/uploads/**" }, { pathname: "/logo.png" }],
  },
};

export default nextConfig;
