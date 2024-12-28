import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], // Optimize for specific breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Smaller sizes for thumbnails
    formats: ['image/webp'], // Prefer WebP format
  },
}

export default nextConfig