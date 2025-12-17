import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "slyiocxjixqkoqcbtslt.supabase.co",
        pathname: "/**", // Supabase Storage 모든 경로 허용
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 서버 액션 최대 바디 크기 10MB
    },
  },
};

export default nextConfig;
