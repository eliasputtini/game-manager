import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.thegamesdb.net",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
