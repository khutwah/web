import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files.
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  generateBuildId() {
    return process.env.NEXT_PUBLIC_APP_VERSION || 'development'
  },
  generateEtags: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
}

export default nextConfig
