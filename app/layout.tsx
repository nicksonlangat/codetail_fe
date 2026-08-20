import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Codetail - Sharpen your craft with real problems and AI feedback like a senior dev",
    template: "%s | Codetail",
  },
  description:
    "Real Django and Python problems. AI feedback like a senior dev. Prepare for interviews and excel at your day job.",
  keywords: ["Django", "Python", "coding practice", "technical interview prep", "backend engineering", "AI code review"],
  openGraph: {
    title: "Codetail",
    description:
      "Real Django and Python problems. AI feedback like a senior dev. Prepare for interviews and excel at your day job.",
    siteName: "Codetail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codetail",
    description:
      "Real Django and Python problems. AI feedback like a senior dev. Prepare for interviews and excel at your day job.",
  },
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
      <body className="min-h-full flex flex-col">
        <Script
            src="https://app.usecandor.cc/widget.js"
  data-key="wid_76f22dba466919b80edb84b37fe8e5da"
          strategy="afterInteractive"
        />
        <QueryProvider>{children}</QueryProvider>
        <Toaster closeButton 
         position="bottom-right" />
      </body>
    </html>
  );
}
