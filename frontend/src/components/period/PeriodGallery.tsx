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

  const handleSelectArtwork = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setSelectedIndex(artworks.findIndex((a) => a.id === artwork.id));
  }, [artworks]);

  const handleCloseModal = useCallback(() => {
    setSelectedArtwork(null);
    setSelectedIndex(-1);
  }, []);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseModal();
    } else if (e.key === 'ArrowLeft') {
      handlePrevArtwork();
    } else if (e.key === 'ArrowRight') {
      handleNextArtwork();
    }
  }, [handleCloseModal, handlePrevArtwork, handleNextArtwork]);

  // If there's an error, show error message
  if (error) {
    return (
      <div className="my-16 p-6 bg-red-50 border border-red-200 rounded-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to load gallery</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // If loading, show loading state
  if (loading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-6">Masterpieces Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  // If no artworks, show empty state
  if (artworks.length === 0) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-6">Masterpieces Gallery</h2>
        <p className="text-gray-500">No artworks available for this period.</p>
      </div>
    );
  }

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-6">Masterpieces Gallery</h2>
      
      {/* Gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <button
            key={artwork.id}
            onClick={() => handleSelectArtwork(artwork)}
            className="block w-full aspect-square relative overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`View ${artwork.title} by ${artwork.artist}`}
          >
            <Image
              src={artwork.imageUrl}
              alt={`${artwork.title} by ${artwork.artist}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>
      
      {/* Modal */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-labelledby="artwork-title"
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-opacity"
              aria-label="Close modal"
            >
              <span className="text-xl">&times;</span>
            </button>
            
            {/* Navigation buttons */}
            {selectedIndex > 0 && (
              <button
                onClick={handlePrevArtwork}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-opacity"
                aria-label="Previous artwork"
              >
                &larr;
              </button>
            )}
            
            {selectedIndex < artworks.length - 1 && (
              <button
                onClick={handleNextArtwork}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-opacity"
                aria-label="Next artwork"
              >
                &rarr;
              </button>
            )}
            
            {/* Artwork image */}
            <div className="relative aspect-square md:aspect-[4/3] w-full">
              <Image
                src={selectedArtwork.imageUrl}
                alt={`${selectedArtwork.title} by ${selectedArtwork.artist}`}
                fill
                className="object-contain"
              />
            </div>
            
            {/* Artwork details */}
            <div className="p-6">
              <h3 id="artwork-title" className="text-2xl font-bold mb-1">{selectedArtwork.title}</h3>
              <p className="text-lg mb-4">{selectedArtwork.artist}, {selectedArtwork.year}</p>
              <p className="text-gray-700">{selectedArtwork.relevance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
