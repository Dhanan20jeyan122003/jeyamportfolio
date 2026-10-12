import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import StructuredData from "@/components/StructuredData";
import { getSiteUrl } from "@/lib/siteUrl";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500", "700"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono", weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfbf7' },
    { media: '(prefers-color-scheme: dark)', color: '#120d1c' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dhananjeyan M | AI-Powered Portfolio & Software Engineer",
    template: "%s | Dhananjeyan M",
  },
  description:
    "Official portfolio of Dhananjeyan M — Junior Software Engineer & AI Engineer with expertise in Java, React.js, Spring Boot, and Generative AI (LLMs, Ollama, RAG). Interactive showcase with custom Studio Orb AI assistant.",
  keywords: [
    "Dhananjeyan M",
    "Dhananjeyan",
    "Dhanan jeyan",
    "Dhanan20jeyan122003",
    "Dhananjeyan Portfolio",
    "jeyamportfolio",
    "AI Engineer Portfolio",
    "Software Developer Portfolio",
    "Junior Software Engineer",
    "WBC Software Lab",
    "Generative AI Developer",
    "Full Stack Developer India",
    "React Developer",
    "Spring Boot Developer",
    "RAG AI Assistant",
    "Studio Orb",
    "Electronics and Communication Engineering graduate",
    "Tamil Nadu developer"
  ],
  authors: [{ name: "Dhananjeyan M", url: "https://github.com/Dhanan20jeyan122003" }],
  creator: "Dhananjeyan M",
  publisher: "Dhananjeyan M",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Dhananjeyan M | AI-Powered Portfolio & Software Engineer",
    description:
      "Explore the interactive portfolio of Dhananjeyan M featuring Studio Orb RAG AI assistant, full-stack projects, and machine learning models.",
    url: siteUrl,
    siteName: "Dhananjeyan M Portfolio",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
        alt: "Dhananjeyan M - Software Developer and AI Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhananjeyan M | AI-Powered Portfolio",
    description:
      "Official portfolio of Dhananjeyan M — Junior Software Engineer & AI Engineer with interactive Studio Orb assistant.",
    images: ["/profile.png"],
    creator: "@Dhanan20jeyan122003",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/profile.png' },
      { url: '/profile.png', sizes: '192x192', type: 'image/png' },
      { url: '/profile.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/profile.png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable} ${inter.variable}`}>
        <div className="grain"></div>
        <Cursor />
        <div className="bg-blobs">
          <span className="b1"></span>
          <span className="b2"></span>
          <span className="b3"></span>
        </div>
        {children}
      </body>
    </html>
  );
}
