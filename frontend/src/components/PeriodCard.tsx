'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Period } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PeriodCardProps {
  period: {
    id: string;
    name: string;
    cardImageUrl?: string;
    description?: string;
  };
}

export default function PeriodCard({ period }: PeriodCardProps) {
  return (
    <Link
      href={`/periods/${period.id}`}
      className="block group h-full"
    >
      <div className="border border-gray-200 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        {/* Card image container - takes up more space */}
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src={period.cardImageUrl || 'https://placehold.co/600x400'}
            alt={`${period.name} period`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Text content - clean typography */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Period name repeated 4 times like WritingExamples */}
          <div className="text-xs text-gray-500 mb-4">
            {period.name}{period.name}{period.name}{period.name}
          </div>

          <h2 className="text-3xl font-bold mb-3">{period.name}</h2>

          <p className="text-gray-700 mb-6">{period.description}</p>

          {/* Visual indicator for the card being clickable */}
          <div className="mt-auto">
            <span className="text-sm font-medium uppercase tracking-wider">Explore →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
