import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPeriod } from '@/lib/api/client';
import PeriodHeader from '@/components/period/PeriodHeader';
import PeriodIntroduction from '@/components/period/PeriodIntroduction';
import PeriodTimeline from '@/components/period/PeriodTimeline';
import PeriodFeatures from '@/components/period/PeriodFeatures';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically import heavier components
const PeriodGallery = dynamic(() => import('@/components/period/PeriodGallery'), {
  loading: () => <div className="h-80 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>,
  ssr: true,
});

const PeriodArtists = dynamic(() => import('@/components/period/PeriodArtists'), {
  loading: () => <div className="h-80 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>,
  ssr: true,
});

const PeriodFacts = dynamic(() => import('@/components/period/PeriodFacts'), {
  loading: () => <div className="h-40 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>,
  ssr: true,
});

const PeriodNavigation = dynamic(() => import('@/components/period/PeriodNavigation'), {
  loading: () => <div className="h-16 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>,
  ssr: true,
});

// Define types for the period data
interface Feature {
  title: string;
  description: string;
}

interface PeriodData {
  id: string;
  name: string;
  headerImageUrl?: string;
  introduction?: string;
  definingFeatures?: Feature[];
  didYouKnow?: string[];
}

// This is a placeholder for the actual data fetching
// In a real implementation, we would use Next.js data fetching methods
async function getPeriodData(id: string): Promise<PeriodData | null> {
  try {
    // This would be replaced with actual API call in production
    return await getPeriod(id);
  } catch (error) {
    return null;
  }
}

export default async function PeriodPage({ params }: { params: { period: string } }) {
  const periodData = await getPeriodData(params.period);

  if (!periodData) {
    notFound();
  }

  return (
    <main className="min-h-screen relative">
      {/* X button to return to home */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Return to home"
        >
          <span className="text-2xl">&times;</span>
        </Link>
      </div>

      {/* Period header */}
      <header className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={periodData.headerImageUrl || 'https://placehold.co/1200x800?text=' + periodData.name}
            alt={periodData.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">{periodData.name}</h1>
          <p className="text-xl max-w-3xl mx-auto">{periodData.introduction?.substring(0, 120)}...</p>
        </div>
      </header>

      {/* Article content with clean typography */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="prose prose-lg mx-auto">
          <h2>About {periodData.name}</h2>
          <p>{periodData.introduction}</p>

          {periodData.definingFeatures && periodData.definingFeatures.length > 0 && (
            <>
              <h2>Defining Features</h2>
              <ul>
                {periodData.definingFeatures.map((feature: Feature, index: number) => (
                  <li key={index}>{feature.title}: {feature.description}</li>
                ))}
              </ul>
            </>
          )}

          {periodData.didYouKnow && periodData.didYouKnow.length > 0 && (
            <>
              <h2>Did You Know?</h2>
              <ul>
                {periodData.didYouKnow.map((fact: string, index: number) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
