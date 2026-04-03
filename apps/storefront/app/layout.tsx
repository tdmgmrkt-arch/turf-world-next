import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
    "Skip the middleman. Get professional-grade artificial grass with transparent pricing, fast nationwide shipping, and a 16-Year Warranty. PFAS-free guaranteed.",
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
  metadataBase: new URL("https://www.turf-world.com"),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Turf World",
    url: "https://www.turf-world.com",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2S4EBTCEEC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2S4EBTCEEC');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
