import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5226",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.minhquy.dev",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;