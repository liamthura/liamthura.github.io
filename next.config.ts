import type { NextConfig } from "next";

// Static export is only for the GitHub Pages build (PAGES_BUILD=1 in the
// deploy workflow). Local builds stay dynamic so /admin and /api keep working.
const isPagesBuild = process.env.PAGES_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isPagesBuild ? { output: "export" as const } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "filedn.com",
      },
    ],
    // next/image optimization needs a server; Pages serves static files only.
    ...(isPagesBuild ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
