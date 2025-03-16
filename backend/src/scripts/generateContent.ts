import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { generatePeriodDescription, generateArtworkDescriptions, generateSlug, validateGeneratedContent } from '../lib/openai';
import { Period, Artwork } from '../types';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const PERIODS = [
  'Renaissance',
  'Baroque',
  'Rococo',
  'Neoclassicism',
  'Romanticism',
  'Impressionism'
];
const DATA_DIR = path.resolve(__dirname, '../../data');
const PERIODS_DIR = path.join(DATA_DIR, 'periods');
const ARTWORKS_DIR = path.join(DATA_DIR, 'artworks');

/**
 * Ensure data directories exist
 */
async function ensureDirectories() {
  await fs.mkdir(PERIODS_DIR, { recursive: true });
  await fs.mkdir(ARTWORKS_DIR, { recursive: true });
}

/**
 * Generate content for a single period
 */
async function generatePeriodContent(periodName: string) {
  console.log(`\nGenerating content for ${periodName} period...`);
  
  // Generate artworks first
  console.log('Generating artwork descriptions...');
  const artworks = await generateArtworkDescriptions(periodName);
  
  // Validate artwork data
  const validArtworks = artworks.filter(artwork =>
    validateGeneratedContent(artwork, ['title', 'artist', 'year', 'relevance', 'trivia'])
  );

  // Save artworks
  for (const artwork of validArtworks) {
    const slug = generateSlug(artwork.title!);
    const fullArtwork: Artwork = {
      slug,
      ...artwork as Omit<Artwork, 'slug'>,
      period: generateSlug(periodName),
      imageUrl: `/static/images/artworks/${slug}.jpg`,
      createdAt: new Date().toISOString(),
    };

    const artworkPath = path.join(ARTWORKS_DIR, `${slug}.md`);
    await fs.writeFile(
      artworkPath,
      `---\n${JSON.stringify(fullArtwork, null, 2)}\n---\n`
    );
    console.log(`Saved artwork: ${artwork.title}`);
  }

  // Generate period description using the artwork titles as context
  console.log('Generating period description...');
  const artworkTitles = validArtworks.map(a => a.title!);
  const periodData = await generatePeriodDescription(periodName, artworkTitles);

  // Validate period data
  if (!validateGeneratedContent(periodData, ['introduction', 'timelineData', 'definingFeatures', 'revolutionaryArtists', 'didYouKnow'])) {
    throw new Error(`Invalid period data generated for ${periodName}`);
  }

  // Save period
  const slug = generateSlug(periodName);
  const fullPeriod: Period = {
    slug,
    name: periodName,
    ...periodData as Omit<Period, 'slug' | 'name' | 'cardImageUrl' | 'headerImageUrl' | 'createdAt'>,
    cardImageUrl: `/static/images/periods/${slug}-card.jpg`,
    headerImageUrl: `/static/images/periods/${slug}-header.jpg`,
    createdAt: new Date().toISOString(),
  };

  const periodPath = path.join(PERIODS_DIR, `${slug}.md`);
  await fs.writeFile(
    periodPath,
    `---\n${JSON.stringify(fullPeriod, null, 2)}\n---\n`
  );
  console.log(`Saved period: ${periodName}`);
}

/**
 * Main function to generate all content
 */
async function main() {
  try {
    await ensureDirectories();

    for (const period of PERIODS) {
      await generatePeriodContent(period);
    }

    console.log('\nContent generation completed successfully!');
  } catch (error) {
    console.error('Error generating content:', error);
    process.exit(1);
  }
}

// Run the script
main(); 