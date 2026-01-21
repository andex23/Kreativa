import type { Metadata } from "next";
import { Courier_Prime, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const courierPrime = Courier_Prime({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kreativa | Nigerian Creative Directory",
  description: "Discover Nigerian creative talent across photography, design, art, fashion, and more. Connect with photographers, designers, artists, and content creators.",
  keywords: "Nigerian creatives, photographers Lagos, graphic designers Nigeria, fashion designers Abuja, content creators, creative directory",
  openGraph: {
    title: "Kreativa | Nigerian Creative Directory",
    description: "Discover Nigerian creative talent across photography, design, art, fashion, and more.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreativa | Nigerian Creative Directory",
    description: "Discover Nigerian creative talent across photography, design, art, fashion, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${courierPrime.variable} ${inter.variable}`}
        style={{
          fontFamily: 'var(--font-body)',
        }}
      >
        <Navigation />
        <main
          style={{
            paddingTop: '72px', // Account for fixed nav
            minHeight: '100vh',
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer className="site-footer">
          {/* Decorative gradient overlay */}
          <div className="footer-gradient-overlay" />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="footer-content">
              {/* Brand Section */}
              <div className="footer-brand">
                <p className="footer-brand-name">
                  Kreativa
                </p>
                <p className="footer-brand-tagline">
                  Connecting Nigerian creatives with the world.
                </p>
              </div>

              {/* Legal Links */}
              <div className="footer-links">
                <a href="/terms" className="footer-link">
                  Terms
                </a>
                <a href="/privacy" className="footer-link">
                  Privacy
                </a>
                <a href="mailto:hello@kreativa.ng" className="footer-link">
                  Contact
                </a>
              </div>

              {/* Copyright */}
              <p className="footer-copyright">
                © 2026 Kreativa. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
