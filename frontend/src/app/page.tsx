'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Simple art period data with image URLs of famous paintings
const periods = [
  {
    id: 'renaissance',
    name: 'Renaissance',
    description: 'European cultural rebirth after the Middle Ages',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Botticelli - The Birth of Venus',
  },
  {
    id: 'baroque',
    name: 'Baroque',
    description: 'Dramatic, ornate and grandeur in art and architecture',
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Rembrandt - The Night Watch',
  },
  {
    id: 'rococo',
    name: 'Rococo',
    description: 'Light, elegant and ornamental style',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Fragonard - The Swing',
  },
  {
    id: 'neoclassicism',
    name: 'Neoclassicism',
    description: 'Revival of classical antiquity styles',
    imageUrl: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Jacques-Louis David - Oath of the Horatii',
  },
  {
    id: 'romanticism',
    name: 'Romanticism',
    description: 'Emphasis on emotion, individualism and nature',
    imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Caspar David Friedrich - Wanderer above the Sea of Fog',
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    description: 'Capturing light and movement in everyday scenes',
    imageUrl: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    artist: 'Claude Monet - Impression, Sunrise',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header with shadcn Card */}
        <Card className="mb-12 border-none shadow-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  🎨 🐱
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold flex items-center justify-center gap-2">
              CuratorCat <span className="text-3xl">🐱</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Explore the world's art movements with your feline guide
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Section title with separator */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Art Movements</h2>
          <Separator className="bg-gray-300" />
        </div>

        {/* Grid of period cards using shadcn Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {periods.map((period) => (
            <Link 
              key={period.id}
              href={`/periods/${period.id}`}
              className="block transition-all hover:scale-105"
            >
              <Card className="h-full border-none shadow hover:shadow-md transition-all overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={period.imageUrl}
                    alt={`${period.name} - ${period.artist}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{period.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{period.description}</p>
                  <p className="text-xs text-gray-500 mt-2 italic">{period.artist}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">Click to explore</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
