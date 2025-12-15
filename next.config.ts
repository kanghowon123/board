import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["slyiocxjixqkoqcbtslt.supabase.co"], // Supabase 프로젝트 도메인
  },
};

export default nextConfig;
