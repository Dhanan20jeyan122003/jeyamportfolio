import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["500", "700"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono", weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Dhananjeyan M | AI-Powered Portfolio",
  description: "Full-stack engineer specializing in fast, animated, AI-powered web products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
