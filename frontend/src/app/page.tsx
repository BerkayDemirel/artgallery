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
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x1080?text=Art+Gallery+Hero"
            alt="Art Gallery Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Explore the World of Art
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Journey through time and discover the beauty of different art periods
          </p>
          <a
            href="#periods"
            className="inline-block bg-gallery-accent hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            Start Exploring
          </a>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-gallery-offwhite">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Welcome to Our Art Gallery</h2>
            <p className="text-lg text-gallery-dark mb-8">
              Our curated collection takes you on a journey through the most influential periods in art history.
              Explore the characteristics, masterpieces, and revolutionary artists that defined each era.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gallery-accent mb-2">3</div>
                <div className="text-sm text-gallery-gray">Art Periods</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gallery-accent mb-2">30+</div>
                <div className="text-sm text-gallery-gray">Masterpieces</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gallery-accent mb-2">15+</div>
                <div className="text-sm text-gallery-gray">Artists</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Periods Section */}
      <section id="periods" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">Explore Art Periods</h2>
          <p className="text-lg text-gallery-dark mb-12 text-center max-w-3xl mx-auto">
            Dive into the unique characteristics, masterpieces, and revolutionary artists of each period.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {periods.map((period) => (
              <PeriodCard key={period.id} period={period} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gallery-offwhite">
        <div className="container mx-auto px-4 max-w-4xl">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
