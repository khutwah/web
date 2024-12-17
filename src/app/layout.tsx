import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/Toast/Toaster'
import { TimezoneSetter } from '@/components/Timezone/Setter'
import { CacheBuster } from '@/components/Cache/Buster'

export const metadata: Metadata = {
  title: 'MTMH',
  description: 'Markaz Tahfizh Minhajul Haq'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        {process.env.NEXT_PUBLIC_APP_VERSION && <CacheBuster />}
        <TimezoneSetter />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
