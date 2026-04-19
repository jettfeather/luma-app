import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luma — AI Life Coaching with Real Analytics",
  description: "Luma helps you and your coach track goals, build habits, and measure growth — with AI-powered insights delivered through Telegram and a beautiful dashboard.",
  keywords: ["life coach", "habit tracker", "goal tracking", "AI coach", "accountability", "personal growth"],
  openGraph: {
    title: "Luma — AI Life Coaching with Real Analytics",
    description: "Track goals, build habits, and measure growth with your AI coach.",
    type: "website",
    url: "https://lumacoach.com",
    siteName: "Luma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luma — AI Life Coaching with Real Analytics",
    description: "Track goals, build habits, and measure growth with your AI coach.",
  },
  metadataBase: new URL("https://lumacoach.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
