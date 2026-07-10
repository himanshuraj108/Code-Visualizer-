/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@xyflow/react'],
  },
};

export default nextConfig;
