import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Yeh line build ke waqt saare TS errors ko ignore kar degi
  },
};

export default nextConfig;