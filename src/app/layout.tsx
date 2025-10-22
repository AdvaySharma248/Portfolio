import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advay Sharma - Portfolio",
  description: "Personal portfolio of Advay Sharma, a B.Tech Computer Science student passionate about backend development, gaming, and coding.",
  keywords: ["Advay Sharma", "Portfolio", "Computer Science", "Backend Development", "React", "Three.js", "Next.js"],
  authors: [{ name: "Advay Sharma" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Advay Sharma - Portfolio",
    description: "Personal portfolio showcasing projects and skills in computer science and backend development",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advay Sharma - Portfolio",
    description: "Personal portfolio showcasing projects and skills in computer science and backend development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
