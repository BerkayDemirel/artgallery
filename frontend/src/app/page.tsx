import Image from 'next/image';
import PeriodCard from '@/components/PeriodCard';
import NewsletterForm from '@/components/NewsletterForm';

// Placeholder data until API is connected
const periods = [
  {
    id: 'renaissance',
    name: 'Renaissance',
    description: 'A period of European cultural, artistic, political, and scientific "rebirth" after the Middle Ages.',
    cardImageUrl: 'https://placehold.co/600x400?text=Renaissance',
  },
  {
    id: 'baroque',
    name: 'Baroque',
    description: 'Known for grandeur, drama, and deep colors, emphasizing movement and emotional intensity.',
    cardImageUrl: 'https://placehold.co/600x400?text=Baroque',
  },
  {
    id: 'rococo',
    name: 'Rococo',
    description: 'Characterized by lightness, elegance, and an exuberant use of curving natural forms in ornamentation.',
    cardImageUrl: 'https://placehold.co/600x400?text=Rococo',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero section with minimal header */}
      <header className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-2">Art Gallery</h1>
        <p className="text-xl text-gray-600">Explore the world's greatest art periods</p>
      </header>

      {/* Full-width card container */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {periods.map((period) => (
            <PeriodCard
              key={period.id}
              period={period}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
