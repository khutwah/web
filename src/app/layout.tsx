import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/Toast/Toaster'
import { TimezoneSetter } from '@/components/Timezone/Setter'

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
        <TimezoneSetter />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
