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
    <div className="space-y-12">
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-4">Welcome to the Art Gallery</h2>
        <p className="text-lg">Explore the world of art through different periods.</p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Explore Art Periods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {periods.map((period) => (
            <PeriodCard key={period.id} period={period} />
          ))}
        </div>
      </section>
      
      <section className="py-8">
        <NewsletterForm />
      </section>
    </div>
  );
} 