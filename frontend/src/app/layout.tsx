import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Art Gallery | Explore Art Through the Ages',
  description: 'Explore the world of art through different periods, from Renaissance to Modern Art.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-serif font-bold text-gallery-dark hover:text-gallery-accent transition-colors"
              aria-label="Art Gallery Home"
            >
              Art Gallery
            </Link>
            <nav aria-label="Main Navigation">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/"
                    className="text-gallery-dark hover:text-gallery-accent transition-colors"
                    aria-label="Home Page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/periods/renaissance"
                    className="text-gallery-dark hover:text-gallery-accent transition-colors"
                    aria-label="Renaissance Period"
                  >
                    Renaissance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/periods/baroque"
                    className="text-gallery-dark hover:text-gallery-accent transition-colors"
                    aria-label="Baroque Period"
                  >
                    Baroque
                  </Link>
                </li>
                <li>
                  <Link
                    href="/periods/rococo"
                    className="text-gallery-dark hover:text-gallery-accent transition-colors"
                    aria-label="Rococo Period"
                  >
                    Rococo
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main-content">{children}</main>

        <footer className="bg-gallery-dark text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-serif font-bold mb-4">Art Gallery</h3>
                <p className="text-gallery-gray">
                  Explore the world of art through different periods, from Renaissance to Modern Art.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <nav aria-label="Footer Navigation">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        className="text-gallery-gray hover:text-white transition-colors"
                        aria-label="Home Page"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/periods/renaissance"
                        className="text-gallery-gray hover:text-white transition-colors"
                        aria-label="Renaissance Period"
                      >
                        Renaissance
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/periods/baroque"
                        className="text-gallery-gray hover:text-white transition-colors"
                        aria-label="Baroque Period"
                      >
                        Baroque
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/periods/rococo"
                        className="text-gallery-gray hover:text-white transition-colors"
                        aria-label="Rococo Period"
                      >
                        Rococo
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <address className="text-gallery-gray not-italic">
                  Email: <a href="mailto:info@artgallery.com" className="hover:text-white transition-colors">info@artgallery.com</a><br />
                  Phone: <a href="tel:+11234567890" className="hover:text-white transition-colors">+1 (123) 456-7890</a>
                </address>
              </div>
            </div>

            <div className="border-t border-gallery-gray mt-8 pt-8 text-center text-gallery-gray">
              <p>© {new Date().getFullYear()} Art Gallery. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-gallery-dark"
        >
          Skip to content
        </a>

        {/* Analytics */}
        <UmamiAnalytics />
      </body>
    </html>
  );
}
