import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPeriod } from '@/lib/api/client';
import PeriodHeader from '@/components/period/PeriodHeader';
import PeriodIntroduction from '@/components/period/PeriodIntroduction';
import PeriodTimeline from '@/components/period/PeriodTimeline';
import PeriodFeatures from '@/components/period/PeriodFeatures';

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

// This is a placeholder for the actual data fetching
// In a real implementation, we would use Next.js data fetching methods
async function getPeriodData(id: string) {
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
    <div className="space-y-16">
      <PeriodHeader
        name={periodData.name}
        imageUrl={periodData.headerImageUrl}
      />

      <div className="container mx-auto px-4">
        <PeriodIntroduction introduction={periodData.introduction} />

        <Suspense fallback={<div className="h-40 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>}>
          <PeriodTimeline timelineData={periodData.timelineData} />
        </Suspense>

        <Suspense fallback={<div className="h-80 bg-gallery-offwhite animate-pulse rounded-md my-16"></div>}>
          <PeriodFeatures features={periodData.definingFeatures} />
        </Suspense>

        <PeriodGallery periodId={params.period} />

        <PeriodArtists artists={periodData.revolutionaryArtists} />

        <PeriodFacts facts={periodData.didYouKnow} />

        <div className="my-16">
          <PeriodNavigation currentPeriodId={params.period} />
        </div>
      </div>
    </div>
  );
}
