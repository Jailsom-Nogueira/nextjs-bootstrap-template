import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/theme-provider";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";
import { metadataBase, SITE_NAME } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: siteConfig.description,
  applicationName: SITE_NAME,
  formatDetection: { telephone: false, email: false, address: false },
};

/** Viewport + theme-color (Next 16 separates these from `metadata`). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Root layout.
 *
 * ThemeProvider lives here (not in `[locale]/layout.tsx`) so the next-themes
 * inline hydration script renders adjacent to `<html>` instead of inside a
 * deep tree. That layout placement is what Next 16's stricter dev hydration
 * check expects, and it eliminates the "Encountered a script tag while
 * rendering a React component" warning.
 *
 * i18n + analytics providers stay in `[locale]/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
