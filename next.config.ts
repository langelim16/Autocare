import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O app é o public/autocare.html; Next.js serve apenas as rotas /api/*.
  async rewrites() {
    return [{ source: "/", destination: "/autocare.html" }];
  },
};

export default nextConfig;
