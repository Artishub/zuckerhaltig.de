import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  // The old design drafts lived under /de/test; they were never indexed, so they simply go home.
  async redirects() {
    return [
      { source: "/de/test", destination: "/de", permanent: true },
      { source: "/de/test/:path*", destination: "/de", permanent: true },
    ];
  },
};

export default nextConfig;
