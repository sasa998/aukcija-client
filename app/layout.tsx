import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aukcija",
  description: "Professional auction platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-screen flex flex-col font-[var(--font-inter)]">
        <Providers>
          <header>
            <Navbar />
            <HeroBanner />
          </header>
          <main className="w-full max-w-[1300px] mx-auto flex-1">
            {children}
          </main>
          <footer className="py-6 text-center text-xs text-[#666] space-x-3">
            <span>© 2026 aukcija</span>
            <Link
              href="/privatnost"
              className="hover:underline hover:text-[#0a66c2]"
            >
              Privatnost
            </Link>
            <Link
              href="/uslovi"
              className="hover:underline hover:text-[#0a66c2]"
            >
              Uslovi korišćenja
            </Link>
          </footer>
        </Providers>
        <Toaster position="top-right" richColors duration={5000} />
      </body>
    </html>
  );
}
