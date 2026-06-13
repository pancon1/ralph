import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native-binary packages must resolve from node_modules at runtime, not be bundled.
  serverExternalPackages: ["ffmpeg-static", "fluent-ffmpeg", "youtube-dl-exec"],
};

export default nextConfig;
