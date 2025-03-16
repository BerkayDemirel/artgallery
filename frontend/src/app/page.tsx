'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Cormorant } from 'next/font/google';
import { getAllPeriods } from '@/lib/api';
import { Period } from '@/types/api';

const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export default function Home() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPeriods() {
      try {
        setLoading(true);
        const data = await getAllPeriods();
        setPeriods(data);
      } catch (err) {
        console.error('Error loading periods:', err);
        setError('Failed to load art periods. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadPeriods();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-[#FAF3E0]">
      <div className="max-w-6xl mx-auto">
        {/* Header without card wrapper */}
        <div className="text-center mb-16">
          <div className={`text-6xl font-extrabold flex items-center justify-center gap-4 ${cormorant.variable} text-[#3D3D3D] mb-4`}>
            Curator <span className="text-6xl">Cat 🐱</span>
          </div>
          <p className="text-lg text-[#3D3D3D]">
            Explore the world's art movements with your feline guide
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-[#3D3D3D]">Loading art periods...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-[#3D3D3D] mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#E07A5F] text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid of period cards using shadcn Card */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periods.map((period) => (
              <Link 
                key={period.slug}
                href={`/periods/${period.slug}`}
                className="block transition-all hover:scale-105"
              >
                <Card className="h-full border-none shadow hover:shadow-md transition-all overflow-hidden bg-[#FFF8E7]">
                  <div className="relative h-48 w-full">
                    <Image
                      src={period.cardImageUrl}
                      alt={period.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{period.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-[#3D3D3D]">{period.introduction.substring(0, 120)}...</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
