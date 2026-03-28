import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Codetail — Where Developers Sharpen Their Craft",
  description:
    "Real-world challenges, AI code reviews, and structured paths from Python to Django. The craft of writing beautiful code.",
  metadataBase: new URL("https://codetail.cc"),
  openGraph: {
    title: "Codetail — Where Developers Sharpen Their Craft",
    description: "Real-world challenges, AI code reviews, and structured paths from Python to Django. The craft of writing beautiful code.",
    url: "https://codetail.cc",
    siteName: "Codetail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codetail — Where Developers Sharpen Their Craft",
    description: "The craft of writing beautiful code. Real-world challenges, AI reviews, structured paths.",
  },
  icons: {
    icon: "/icon.svg",
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
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
