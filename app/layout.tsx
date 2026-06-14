import type { Metadata } from 'next'
import { Victor_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const victorMono = Victor_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-victor-mono',
})

export const metadata: Metadata = {
  title: 'Onkar Sathe',
  description: 'Full Stack Developer building practical software systems and digital experiences.',
  keywords: ['Onkar Sathe', 'full stack developer', 'software engineer', 'projects', 'blogs'],
  authors: [{ name: 'Onkar Sathe' }],
  creator: 'Onkar Sathe',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Onkar Sathe',
    title: 'Onkar Sathe',
    description: 'Full Stack Developer building practical software systems and digital experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onkar Sathe',
    description: 'Full Stack Developer building practical software systems and digital experiences.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={victorMono.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
