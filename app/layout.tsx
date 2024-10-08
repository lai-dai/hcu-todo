import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { DeviceDetectProvider } from '@/components/device-detect/server'
import { TailwindIndicator } from '@/components/tailwind-indicator'

import { Providers } from './providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: {
    default: 'Lai Dai',
    template: `%s - Lai Dai`,
  },
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen !bg-background font-sans antialiased`}
      >
        <div vaul-drawer-wrapper="">
          <DeviceDetectProvider>
            <Providers>{children}</Providers>
          </DeviceDetectProvider>
        </div>
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  )
}
