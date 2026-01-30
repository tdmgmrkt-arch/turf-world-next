import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Turf World | Premium Artificial Grass Direct to You",
    template: "%s | Turf World",
  },
  description:
    "Skip the middleman. Get professional-grade artificial grass with transparent pricing, free shipping, and a 15-year warranty. PFAS-free guaranteed.",
  keywords: [
    "artificial grass",
    "artificial turf",
    "fake grass",
    "pet turf",
    "putting green",
    "synthetic lawn",
    "PFAS free turf",
    "fire rated turf",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Turf World",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
