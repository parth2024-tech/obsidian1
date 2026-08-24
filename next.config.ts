import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@codemirror/view",
      "@codemirror/state",
    ],
  },
  webpack: (config) => {
    // Enable Web Workers
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: { loader: "worker-loader" },
    });
    return config;
  },
};

export default nextConfig;
