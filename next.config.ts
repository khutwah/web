import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files.
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  generateBuildId() {
    return process.env.NEXT_PUBLIC_APP_VERSION || 'development'
  },
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=31536000, maxage=86400, stale-while-revalidate=59'
          }
        ]
      },
      {
        source: '/get-started',
        headers: [
          {
            key: 'Cache-Control',
            value: 'maxage=86400, stale-while-revalidate=59'
          }
        ]
      },
      {
        source: '/ustadz',
        headers: [
          {
            key: 'Cache-Control',
            value: 'maxage=86400, stale-while-revalidate=59'
          }
        ]
      },
      {
        source: '/santri',
        headers: [
          {
            key: 'Cache-Control',
            value: 'maxage=86400, stale-while-revalidate=59'
          }
        ]
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            // Make sure to set max-age=0 to prevent caching.
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ]
  },
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
