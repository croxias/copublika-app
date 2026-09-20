import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { I18nProvider } from "@/components/ui/I18nProvider";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoPublika — Digital Research Engine & Exclusive Community",
  description:
    "CoPublika adalah platform SaaS komunitas akademik eksklusif untuk kolaborasi riset, kurasi batch, dan publikasi berkualitas tinggi.",
  keywords: [
    "CoPublika",
    "research community",
    "Scopus",
    "publikasi akademik",
    "kolaborasi riset",
  ],
  openGraph: {
    title: "CoPublika — Digital Research Engine",
    description:
      "Eliminasi isolasi akademik dan akselerasi publikasi berkualitas tinggi bersama komunitas riset terkurasi.",
    type: "website",
    locale: "id_ID",
    siteName: "CoPublika",
  },
  icons: {
    icon: "/favicon-black.png",
    shortcut: "/favicon-black.png",
    apple: "/favicon-black.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>
            <SupabaseAuthProvider>
              {children}
            </SupabaseAuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
