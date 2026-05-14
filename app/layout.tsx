import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { GooeyToaster } from '@/components/ui/goey-toaster'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Sardar IT HRMS | Human Resource Management System',
  description:
    'Human Resource Management System for Sardar IT employee management, attendance, leave, payroll and HR operations.',
  generator: 'Sardar IT',

  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/fav.jpg',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],

    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} bg-background dark:bg-slate-950`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background dark:bg-slate-950 text-foreground dark:text-white">
        <AuthProvider>
          {children}
          {/* Gooey Toast Notifications */}
          <GooeyToaster
            position="top-right"
            theme="light"
            showProgress={true}
            spring={true}
            bounce={0.4}
            gap={14}
            offset="24px"
            closeOnEscape={true}
            swipeToDismiss={true}
          />
        </AuthProvider>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}