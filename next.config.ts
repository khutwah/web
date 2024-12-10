import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files.
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
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
