/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['gsap', 'lucide-react'],
  },
  ...(basePath
    ? { basePath, assetPrefix: basePath }
    : {}),
};

export default nextConfig;
