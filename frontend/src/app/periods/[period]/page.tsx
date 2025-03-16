'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Simple period data (in a real app, this would come from an API)
const periodData = {
  renaissance: {
    name: 'Renaissance',
    description: 'The Renaissance was a period of European cultural, artistic, political, and scientific "rebirth" after the Middle Ages.',
    years: '14th to 17th century',
    keyArtists: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli'],
    color: 'bg-blue-100',
  },
  baroque: {
    name: 'Baroque',
    description: 'The Baroque style used exaggerated motion and clear, easily interpreted detail to produce drama, tension, exuberance, and grandeur.',
    years: '17th to 18th century',
    keyArtists: ['Caravaggio', 'Rembrandt', 'Rubens', 'Bernini'],
    color: 'bg-amber-100',
  },
  rococo: {
    name: 'Rococo',
    description: 'Rococo is characterized by lightness, elegance, and an exuberant use of curving natural forms in ornamentation.',
    years: '18th century',
    keyArtists: ['Watteau', 'Fragonard', 'Boucher', 'Tiepolo'],
    color: 'bg-pink-100',
  },
  neoclassicism: {
    name: 'Neoclassicism',
    description: 'Neoclassicism was a revival of the classical style but with a new emphasis on austerity and heroism.',
    years: '18th to 19th century',
    keyArtists: ['Jacques-Louis David', 'Jean-Auguste-Dominique Ingres', 'Antonio Canova'],
    color: 'bg-gray-100',
  },
  romanticism: {
    name: 'Romanticism',
    description: 'Romanticism emphasized emotion, individualism, and the glorification of nature and the past.',
    years: '18th to 19th century',
    keyArtists: ['Eugène Delacroix', 'J.M.W. Turner', 'Caspar David Friedrich'],
    color: 'bg-green-100',
  },
  impressionism: {
    name: 'Impressionism',
    description: 'Impressionism captured the transient effects of light and color, often painting outdoors and with visible brushstrokes.',
    years: '19th century',
    keyArtists: ['Claude Monet', 'Pierre-Auguste Renoir', 'Edgar Degas', 'Mary Cassatt'],
    color: 'bg-purple-100',
  },
};

// This is the main page component
export default function PeriodPage({ params }: { params: { period: string } }) {
  // Get period data or use a default if not found
  const period = periodData[params.period as keyof typeof periodData] || {
    name: 'Unknown Period',
    description: 'Information about this art period is not available.',
    years: 'Unknown',
    keyArtists: [],
    color: 'bg-gray-100',
  };

  // Add a simple state to test React interactivity
  const [showAllArtists, setShowAllArtists] = useState(false);
  const displayedArtists = showAllArtists ? period.keyArtists : period.keyArtists.slice(0, 2);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-block mb-8 text-blue-600 hover:text-blue-800"
        >
          ← Back to all periods
        </Link>
        
        {/* Period header */}
        <div className={`${period.color} p-8 rounded-lg mb-8`}>
          <h1 className="text-4xl font-bold mb-2">{period.name}</h1>
          <p className="text-gray-700 text-lg">{period.years}</p>
        </div>
        
        {/* React test */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="mb-2">React Test: Click the button to toggle content</p>
          <button 
            onClick={() => setShowAllArtists(!showAllArtists)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAllArtists ? 'Show Fewer Artists' : 'Show All Artists'}
          </button>
          {showAllArtists && (
            <p className="mt-2 text-green-600 font-semibold">✓ JavaScript and React are working on this page!</p>
          )}
        </div>
        
        {/* Period content */}
        <div className="prose max-w-none">
          <h2>About {period.name}</h2>
          <p>{period.description}</p>
          
          <h2>Key Artists</h2>
          <ul>
            {displayedArtists.map((artist, index) => (
              <li key={index}>{artist}</li>
            ))}
          </ul>
          
          {period.keyArtists.length > 2 && !showAllArtists && (
            <p className="text-gray-500 italic">
              ...and {period.keyArtists.length - 2} more artists
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
