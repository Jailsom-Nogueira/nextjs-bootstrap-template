import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Bootstrap Template",
  description: "Next.js 16 + Supabase + PostHog + Resend template.",
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
    <html className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
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
