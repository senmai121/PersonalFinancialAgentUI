import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Personal Financial Agent',
  description: 'ผู้ช่วยวางแผนการเงินส่วนบุคคลด้วย AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="font-sans min-h-screen bg-slate-950">
        {children}
      </body>
    </html>
  )
}
