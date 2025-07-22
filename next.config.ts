import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlr.gg",
        pathname: "/img/vlr/**",
      },
      {
        protocol: "https",
        hostname: "www.vlr.gg",
        pathname: "/img/vlr/**",
      },
      {
        protocol: "https",
        hostname: "owcdn.net",
        pathname: "/img/**",
      },
    ],
    unoptimized: isProd,
  },

  reactStrictMode: true,
  assetPrefix: isProd ? "/vlr-notify" : "",
  basePath: isProd ? "/vlr-notify" : "",
  output: isProd ? "export" : undefined,
};

export default nextConfig;
