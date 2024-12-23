import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/Toast/Toaster'
import { TimezoneSetter } from '@/components/Timezone/Setter'
import { CacheBuster } from '@/components/Cache/Buster'

const cacheBuster = process.env.NEXT_PUBLIC_CACHE_BUSTER || new Date().valueOf()

export const metadata: Metadata = {
  title: `MTMH (version: ${process.env.NEXT_PUBLIC_APP_VERSION || new Date().valueOf()})`,
  description: `Markaz Tahfizh Minhajul Haq (sha: ${cacheBuster})`,
  verification: {
    other: {
      khutwah: cacheBuster,
      timestamp: new Date().valueOf()
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        {process.env.NEXT_PUBLIC_CACHE_BUSTER && <CacheBuster />}
        <TimezoneSetter />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
