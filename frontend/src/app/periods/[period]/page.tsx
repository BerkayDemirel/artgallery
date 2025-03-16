'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { getPeriodBySlug, getArtworksByPeriod } from '@/lib/api';
import { Period, Artwork } from '@/types/api';

// This is the main page component
export default function PeriodPage({ params }: { params: { period: string } }) {
  const [period, setPeriod] = useState<Period | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch period data
        const periodData = await getPeriodBySlug(params.period);
        if (!periodData) {
          setError(`Period '${params.period}' not found`);
          return;
        }
        setPeriod(periodData);

        // Fetch artworks for this period
        const artworksData = await getArtworksByPeriod(params.period);
        setArtworks(artworksData);
      } catch (err) {
        console.error('Error loading period data:', err);
        setError('Failed to load period data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.period]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-[#FAF3E0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#3D3D3D]">Loading...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !period) {
    return (
      <main className="min-h-screen p-8 bg-[#FAF3E0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#3D3D3D] mb-4">{error || 'Period not found'}</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#E07A5F] text-white hover:bg-opacity-90 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-[#FAF3E0]">
      <div className="max-w-6xl mx-auto relative">
        {/* X button to go back */}
        <div className="absolute top-0 right-0">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E07A5F] text-white hover:bg-opacity-90 transition-all"
            aria-label="Close and return to home"
          >
            <X size={24} />
          </Link>
        </div>
        
        {/* Period header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl font-bold mb-2 font-serif text-[#3D3D3D]">{period.name}</h1>
          {period.timelineData && period.timelineData.length > 0 && (
            <p className="text-xl text-[#3D3D3D]">
              {Math.min(...period.timelineData.map(item => item.year))} - 
              {Math.max(...period.timelineData.map(item => item.year))}
            </p>
          )}
        </div>
        
        {/* Period introduction */}
        <div className="mb-16 max-w-3xl mx-auto">
          <p className="text-lg text-[#3D3D3D] leading-relaxed">{period.introduction}</p>
        </div>
        
        {/* Alternating artwork and text sections */}
        <div className="space-y-24">
          {artworks.map((artwork, index) => (
            <div 
              key={artwork.slug} 
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Artwork image */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={artwork.imageUrl}
                    alt={`${artwork.title} by ${artwork.artist}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              
              {/* Artwork text */}
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold mb-2 text-[#3D3D3D]">{artwork.title}</h2>
                <p className="text-sm text-[#3D3D3D] mb-4">
                  {artwork.artist}, {artwork.year}
                </p>
                <p className="text-[#3D3D3D] leading-relaxed">{artwork.relevance}</p>
                
                {/* Artwork trivia */}
                {artwork.trivia && artwork.trivia.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-[#3D3D3D]">Interesting Facts</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {artwork.trivia.map((fact, i) => (
                        <li key={i} className="text-[#3D3D3D]">{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Features section */}
        {period.definingFeatures && period.definingFeatures.length > 0 && (
          <div className="mt-24 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-[#3D3D3D] text-center">Defining Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {period.definingFeatures.map((feature, index) => (
                <div key={index} className="bg-[#FFF8E7] p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-3 text-[#3D3D3D]">{feature.title}</h3>
                  <p className="text-[#3D3D3D]">{feature.description}</p>
                  {feature.imageUrl && (
                    <div className="mt-4 relative h-48 w-full overflow-hidden rounded-md">
                      <Image
                        src={feature.imageUrl}
                        alt={feature.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Key artists section */}
        {period.revolutionaryArtists && period.revolutionaryArtists.length > 0 && (
          <div className="mt-24 mb-16">
            <h2 className="text-2xl font-bold mb-8 text-[#3D3D3D] text-center">Revolutionary Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {period.revolutionaryArtists.map((artist, index) => (
                <div key={index} className="bg-[#FFF8E7] rounded-lg overflow-hidden shadow-sm">
                  {artist.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={artist.imageUrl}
                        alt={artist.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-[#3D3D3D]">{artist.name}</h3>
                    <p className="text-sm text-[#3D3D3D] mb-3">{artist.bio}</p>
                    {artist.notableWorks && artist.notableWorks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1 text-[#3D3D3D]">Notable Works:</h4>
                        <ul className="list-disc pl-5 text-sm">
                          {artist.notableWorks.map((work, i) => (
                            <li key={i} className="text-[#3D3D3D]">{work}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Did You Know section */}
        {period.didYouKnow && period.didYouKnow.length > 0 && (
          <div className="mt-24 mb-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-[#3D3D3D] text-center">Did You Know?</h2>
            <div className="bg-[#FFF8E7] p-6 rounded-lg shadow-sm">
              <ul className="space-y-4">
                {period.didYouKnow.map((fact, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#E07A5F] mr-2 text-xl">•</span>
                    <p className="text-[#3D3D3D]">{fact}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
