import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white text-gray-900 antialiased`}>
        <main id="main-content">{children}</main>

        <footer className="py-8 mt-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Art Gallery. All rights reserved.</p>
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
