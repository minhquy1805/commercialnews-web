import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  devIndicators: false,

  images: {
    dangerouslyAllowLocalIP: !isProduction,
    remotePatterns: [
      ...(!isProduction
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "5226",
              pathname: "/uploads/**",
            },
          ]
        : []),
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