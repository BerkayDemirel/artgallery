import React from 'react';
import { Metadata } from 'next';
import { getPeriod } from '@/lib/api/client';

// Generate metadata for each period page
export async function generateMetadata({ params }: { params: { period: string } }): Promise<Metadata> {
  try {
    const periodData = await getPeriod(params.period);

    return {
      title: `${periodData.name} Period | Art Gallery`,
      description: periodData.introduction.substring(0, 160) + '...',
      openGraph: {
        title: `${periodData.name} Period | Art Gallery`,
        description: periodData.introduction.substring(0, 160) + '...',
        images: [
          {
            url: periodData.headerImageUrl,
            width: 1200,
            height: 630,
            alt: `${periodData.name} period artwork`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${periodData.name} Period | Art Gallery`,
        description: periodData.introduction.substring(0, 160) + '...',
        images: [periodData.headerImageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Art Period | Art Gallery',
      description: 'Explore this fascinating period in art history.',
    };
  }
}

export default function PeriodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
