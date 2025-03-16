'use client';

import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import Image from 'next/image';
import { getArtworks } from '@/lib/api/client';
import { Artwork } from '@/types/api';

interface PeriodGalleryProps {
  periodId: string;
}

export default function PeriodGallery({ periodId }: PeriodGalleryProps) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const data = await getArtworks(periodId);
        setArtworks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load artworks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [periodId]);

  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setSelectedIndex(artworks.findIndex((a: Artwork) => a.id === artwork.id));
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
    setSelectedIndex(-1);
  };

  const handlePrevArtwork = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedArtwork(artworks[selectedIndex - 1]);
    }
  }, [artworks, selectedIndex]);

  const handleNextArtwork = useCallback(() => {
    if (selectedIndex < artworks.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedArtwork(artworks[selectedIndex + 1]);
    }
  }, [artworks, selectedIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtwork) return;

      switch (e.key) {
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          handlePrevArtwork();
          break;
        case 'ArrowRight':
          handleNextArtwork();
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown as any);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [selectedArtwork, handlePrevArtwork, handleNextArtwork]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Masterpieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gallery-offwhite animate-pulse rounded-md"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Masterpieces</h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Masterpieces</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {artworks.map((artwork: Artwork, index: number) => (
            <div
              key={artwork.id}
              className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleSelectArtwork(artwork)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectArtwork(artwork);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${artwork.title} by ${artwork.artist}`}
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Artwork detail modal */}
        {selectedArtwork && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="artwork-title"
          >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 id="artwork-title" className="text-xl font-bold">{selectedArtwork.title}</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gallery-dark hover:text-black"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="relative h-[50vh] w-full mb-4">
                  <Image
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gallery-gray">Artist</p>
                    <p className="font-medium">{selectedArtwork.artist}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gallery-gray">Year</p>
                    <p className="font-medium">{selectedArtwork.year}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gallery-gray">Country</p>
                    <p className="font-medium">{selectedArtwork.country}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gallery-gray">Relevance</p>
                    <p>{selectedArtwork.relevance}</p>
                  </div>

                  {selectedArtwork.trivia && selectedArtwork.trivia.length > 0 && (
                    <div>
                      <p className="text-sm text-gallery-gray">Trivia</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedArtwork.trivia.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevArtwork}
                    disabled={selectedIndex <= 0}
                    className={`px-4 py-2 rounded ${
                      selectedIndex <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gallery-accent text-white hover:bg-opacity-90'
                    }`}
                    aria-label="Previous artwork"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={handleNextArtwork}
                    disabled={selectedIndex >= artworks.length - 1}
                    className={`px-4 py-2 rounded ${
                      selectedIndex >= artworks.length - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gallery-accent text-white hover:bg-opacity-90'
                    }`}
                    aria-label="Next artwork"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
