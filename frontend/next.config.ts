import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The repo root contains a stray, empty package-lock.json next to frontend/.
  // Without this, Next.js picks the repo root as the workspace root and warns about
  // multiple lockfiles. Pin the root to this app (frontend/) instead.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;