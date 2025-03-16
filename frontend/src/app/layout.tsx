import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CuratorCat | Explore Art Movements',
  description: 'Discover and learn about different art movements throughout history.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        {children}
        
        <footer className="py-6 border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} CuratorCat. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
