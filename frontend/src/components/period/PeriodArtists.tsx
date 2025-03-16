import Image from 'next/image';
import { Artist } from '@/types/api';

interface PeriodArtistsProps {
  artists: Artist[];
}

export default function PeriodArtists({ artists }: PeriodArtistsProps) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Revolutionary Artists</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={artist.imageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                <p className="text-gallery-dark mb-4">{artist.bio}</p>

                {artist.notableWorks && artist.notableWorks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gallery-gray mb-2">Notable Works</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {artist.notableWorks.map((work, idx) => (
                        <li key={idx} className="text-sm">{work}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
