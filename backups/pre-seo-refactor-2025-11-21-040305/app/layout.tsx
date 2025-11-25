import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono, Caveat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _caveat = Caveat({ subsets: ["latin"], weight: ["700"] })

export const metadata: Metadata = {
  title: "Katie Booktok - Fantasy Book Reviews & Romance Novel Recommendations",
  description: "Your guide to fantasy, dragons, and swoon-worthy romance. Katie's honest book reviews of the latest fantasy novels, dark romance, spicy reads, and BookTok favorites. Discover your next book obsession!",
  keywords: [
    "fantasy books",
    "book reviews",
    "booktok",
    "fantasy romance",
    "dark romance",
    "spicy romance books",
    "fantasy book recommendations",
    "book blogger",
    "goodreads",
    "dragon books",
    "romantasy",
    "enemies to lovers",
    "book recommendations",
    "reading list",
    "fantasy novels",
    "book club",
    "new adult fantasy"
  ],
  authors: [{ name: "Katie Booktok" }],
  creator: "Katie Booktok",
  publisher: "Katie Booktok",
  generator: "v0.app",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://katiebooktok.com',
    siteName: 'Katie Booktok',
    title: 'Katie Booktok - Fantasy Book Reviews & Romance Novel Recommendations',
    description: 'Your guide to fantasy, dragons, and swoon-worthy romance. Katie\'s honest book reviews of the latest fantasy novels, dark romance, and BookTok favorites.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Katie Booktok - Fantasy Book Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katie Booktok - Fantasy Book Reviews',
    description: 'Your guide to fantasy, dragons, and swoon-worthy romance',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: 'https://katiebooktok.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
