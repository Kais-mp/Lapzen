import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import MetaPixel from "@/components/meta-pixel";
import Script from "next/script";
import { CartProvider } from "@/context/cart-context";

import { CartSidebar } from "@/components/cart-sidebar";
import { JsonLd } from "@/components/schema";
import { PageLoader } from "@/components/ui/page-loader";
import { Suspense } from "react";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lapzen.shop"),
  title: "Lapzen - Premium Laptops",
  description:
    "Your destination for premium laptops. Shop top brands like Apple, Dell, HP, and Asus at competitive prices.",
  openGraph: {
    title: "Lapzen - Premium Laptops",
    description:
      "Your destination for premium laptops. Shop top brands like Apple, Dell, HP, and Asus at competitive prices.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Lapzen - Premium Laptops",
      },
    ],
    type: "website",
    siteName: "Lapzen",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "Lapzen - Premium Laptops",
    description:
      "Your destination for premium laptops. Shop top brands like Apple, Dell, HP, and Asus at competitive prices.",
    images: ["/logo.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lapzen",
  url: "https://lapzen.shop",
  logo: "https://lapzen.shop/logo.png",
  sameAs: [
    "https://facebook.com/lap.lapzen",
    "https://instagram.com/lapzen.store",
    "https://twitter.com/lapzenstore",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-309-0009022",
    contactType: "customer service",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lapzen",
  url: "https://lapzen.shop",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lapzen.shop/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://ovxxmjqwacgtupatlbhm.supabase.co" />
          <link rel="dns-prefetch" href="https://ajax.googleapis.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          {/* Google Tag (GTM) */}
          <Script
          src="https://www.googletagmanager.com/gtag/js?id=GT-MK952CKJ"
          strategy="lazyOnload"
        />
        <Script id="google-tag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GT-MK952CKJ');
          `}
        </Script>
      </head>

      <body className={`${inter.className} antialiased`}>
        <Suspense fallback={null}>
          <PageLoader />
        </Suspense>

        <MetaPixel />
        <ErrorReporter />

        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />


<CartProvider>
             

                {children}
                <Chatbot />
                <Analytics />

              <CartSidebar />
          </CartProvider>

        <VisualEditsMessenger />
      </body>
    </html>
  );
}
