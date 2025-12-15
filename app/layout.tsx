// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import './globals.css'

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: 'v0 App',
//   description: 'Created with v0',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans antialiased`}>
//         {children}
//         <Analytics />
//       </body>
//     </html>
//   )
// }
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppProvider } from "@/lib/context/app-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "",
//   description: "",
//   icons: {
//     icon: [
//       { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
//       { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
//       { url: "/icon.svg", type: "image/svg+xml" },
//     ],
//     apple: "/apple-icon.png",
//   },
// }
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Rajyog Stationers | Office Stationery, Industrial & Housekeeping Supplies",
    template: "%s | Rajyog Stationers",
  },

  description:
    "Rajyog Stationers offers premium office stationery, housekeeping materials, safety items, account books, and industrial supplies. Trusted quality cleaning supplies, protective gear, ledgers, tools, and office essentials across India.",

  keywords: [
    "Rajyog Stationers",
    "office stationery",
    "housekeeping materials",
    "cleaning supplies",
    "safety items",
    "industrial supplies",
    "account books",
    "ledgers registers journals",
    "office essentials",
    "industrial tools",
    "stationery supplier India",
    "Aurangabad",
    "Stationers",
  ],

  authors: [{ name: "Rajyog Stationers" }],
  creator: "Rajyog Stationers",
  publisher: "Rajyog Stationers",

  metadataBase: new URL("https://rajyogstationers.com"),

  alternates: {
    canonical: "/",
  },

  /* ✅ Icons & Favicons */
  icons: {
    icon: [
      { url: "/favicon.ico" }, // shortcut icon
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  /* ✅ Web App / PWA */
  manifest: "/site.webmanifest",

  appleWebApp: {
    title: "Rajyog Stationers",
    capable: true,
    statusBarStyle: "default",
  },

  openGraph: {
    title: "Rajyog Stationers | Complete Office & Industrial Supply Store",
    description:
      "One-stop destination for office stationery, housekeeping materials, safety equipment, account books, and industrial tools. Quality supplies you can trust.",
    url: "https://rajyogstationers.com",
    siteName: "Rajyog Stationers",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rajyog Stationers - Office & Industrial Supplies",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Rajyog Stationers | Office & Industrial Supplies",
    description:
      "Quality office stationery, housekeeping materials, safety items, account books, and industrial supplies from Rajyog Stationers.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
