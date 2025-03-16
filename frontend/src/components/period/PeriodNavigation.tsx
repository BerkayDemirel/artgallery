'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPeriods } from '@/lib/api/client';
import { Period } from '@/types/api';

interface PeriodNavigationProps {
  currentPeriodId: string;
}

export default function PeriodNavigation({ currentPeriodId }: PeriodNavigationProps) {
  const [prevPeriod, setPrevPeriod] = useState<Period | null>(null);
  const [nextPeriod, setNextPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeriods() {
      try {
        setLoading(true);
        const periods = await getPeriods();

        // Find the index of the current period
        const currentIndex = periods.findIndex((p) => p.id === currentPeriodId);

        if (currentIndex > 0) {
          setPrevPeriod(periods[currentIndex - 1]);
        }

        if (currentIndex < periods.length - 1) {
          setNextPeriod(periods[currentIndex + 1]);
        }
      } catch (error) {
        console.error('Failed to load period navigation:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPeriods();
  }, [currentPeriodId]);

  if (loading) {
    return (
      <div className="flex justify-between items-center py-4">
        <div className="w-32 h-10 bg-gallery-offwhite animate-pulse rounded-md"></div>
        <div className="w-32 h-10 bg-gallery-offwhite animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-4 border-t border-b border-gallery-offwhite">
      {prevPeriod ? (
        <Link
          href={`/periods/${prevPeriod.id}`}
          className="flex items-center group"
        >
          <span className="text-gallery-accent mr-2 transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span>
            <span className="text-sm text-gallery-gray block">Previous</span>
            <span className="font-medium">{prevPeriod.name}</span>
          </span>
        </Link>
      ) : (
        <div></div>
      )}

      {nextPeriod ? (
        <Link
          href={`/periods/${nextPeriod.id}`}
          className="flex items-center group text-right"
        >
          <span>
            <span className="text-sm text-gallery-gray block">Next</span>
            <span className="font-medium">{nextPeriod.name}</span>
          </span>
          <span className="text-gallery-accent ml-2 transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
}
