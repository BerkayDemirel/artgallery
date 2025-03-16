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
    <Link href={`/periods/${period.id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
        {period.cardImageUrl ? (
          <div className="relative h-48 w-full">
            <Image
              src={period.cardImageUrl}
              alt={`${period.name} period`}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-gallery-offwhite h-48 w-full flex items-center justify-center">
            <span className="text-gallery-gray">No image available</span>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <CardTitle>{period.name}</CardTitle>
        </CardHeader>
        
        {period.description && (
          <CardContent>
            <CardDescription>{period.description}</CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
} 