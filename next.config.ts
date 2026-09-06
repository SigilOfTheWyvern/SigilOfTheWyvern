import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/uploads/**" }, { pathname: "/logo.png" }],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
