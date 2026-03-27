import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WEB_COMPUTE platform requires standalone output for Lambda deployment
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
