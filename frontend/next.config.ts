import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

// Image domain config extended in production
type ImageDomainConfig = { protocol: string; hostname: string };
