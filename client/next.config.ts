import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/portfolio/:path*",
        destination: "http://localhost:5000/api/portfolio/:path*",
      },
    ];
  },
};

export default nextConfig;
