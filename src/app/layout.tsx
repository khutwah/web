import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/Toast/Toaster'

export const metadata: Metadata = {
  title: 'Khutwah Web',
  description: 'Khutwah Web'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        {children}

        <Toaster />
      </body>
    </html>
  )
}
