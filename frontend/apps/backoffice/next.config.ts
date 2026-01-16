import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/admin",
  assetPrefix: "/admin",

  // Standalone output for minimal Docker builds
  output: "standalone",

  images: {
    remotePatterns: [
      // Local development with MinIO - CDN path
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/cdn/**",
      },
      // Local development - Images path
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/images/**",
      },
      // Production domain
      {
        protocol: "https",
        hostname: "mattheosioannoumotors.com",
        port: "",
        pathname: "/cdn/**",
      },
    ],
    // Always optimize images
    // formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Ensure static files are served correctly
  generateBuildId: async () => {
    // Return a stable build ID to prevent caching issues
    return "build";
  },
};

export default nextConfig;
