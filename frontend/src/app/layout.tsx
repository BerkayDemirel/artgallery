import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Art Gallery',
  description: 'Explore the world of art through different periods',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Art Gallery</h1>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="p-4 border-t text-center">
          <p>© {new Date().getFullYear()} Art Gallery</p>
        </footer>
      </body>
    </html>
  );
} 