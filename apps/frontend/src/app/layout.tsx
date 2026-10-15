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


/**
 * Development only: browser extensions such as Bitdefender stamp attributes like
 * `bis_skin_checked` onto every element before React hydrates, which shows up as a
 * hydration-mismatch error in the dev overlay. Strip them as soon as they appear.
 */
const EXTENSION_ATTR_GUARD = `(function () {
  var attrs = ["bis_skin_checked", "bis_register", "bis_use", "bis_size", "bis_id"];
  var selector = attrs.map(function (a) { return "[" + a + "]"; }).join(",");
  function clean(el) { for (var i = 0; i < attrs.length; i++) if (el.hasAttribute && el.hasAttribute(attrs[i])) el.removeAttribute(attrs[i]); }
  new MutationObserver(function (records) {
    records.forEach(function (r) {
      if (r.type === "attributes") { r.target.removeAttribute(r.attributeName); return; }
      r.addedNodes.forEach(function (n) { if (n.nodeType === 1) { clean(n); n.querySelectorAll(selector).forEach(clean); } });
    });
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: attrs });
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      {process.env.NODE_ENV === "development" && (
        <head>
          <script dangerouslySetInnerHTML={{ __html: EXTENSION_ATTR_GUARD }} />
        </head>
      )}
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
