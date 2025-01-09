import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/Toast/Toaster'
import { TimezoneSetter } from '@/components/Timezone/Setter'
import { Refresher } from '@/components/Page/Refresher'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_TITLE || 'Minhajul Haq'}`,
  description: `${process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Minhajul Haq - Pendidikan Islam dan Bahasa Arab'}`
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Refresher />
        <TimezoneSetter />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
