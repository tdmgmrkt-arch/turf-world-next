import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
  // Medusa backend URL for server-side fetching
  env: {
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
};

export default nextConfig;
