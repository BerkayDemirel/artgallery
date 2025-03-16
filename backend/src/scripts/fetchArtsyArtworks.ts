import { ArtsyService } from '../lib/artsy/service';
import { RateLimiter } from '../lib/artsy/rate-limiter';

// Sample artwork queries (artist and title pairs)
const artworkQueries = [
  { artist: 'Leonardo da Vinci', title: 'Mona Lisa' },
  { artist: 'Vincent van Gogh', title: 'Starry Night' },
  { artist: 'Pablo Picasso', title: 'Guernica' },
  { artist: 'Claude Monet', title: 'Water Lilies' },
  { artist: 'Edvard Munch', title: 'The Scream' },
  { artist: 'Johannes Vermeer', title: 'Girl with a Pearl Earring' },
  { artist: 'Salvador Dali', title: 'The Persistence of Memory' },
  { artist: 'Michelangelo', title: 'Creation of Adam' },
  { artist: 'Rembrandt', title: 'The Night Watch' },
  { artist: 'Gustav Klimt', title: 'The Kiss' }
];

/**
 * Fetch artwork data from Artsy
 */
async function fetchArtworks() {
  console.log('Starting to fetch artwork data from Artsy...');

  const service = new ArtsyService();
  const rateLimiter = new RateLimiter(5, 1000); // 5 requests per second

  // Process each artwork query
  for (const query of artworkQueries) {
    // Wait for rate limiter to allow the request
    await rateLimiter.acquire();

    try {
      console.log(`Fetching data for "${query.title}" by ${query.artist}...`);
      const result = await service.searchArtwork(query.artist, query.title);

      if (result) {
        console.log(`Successfully fetched data for "${query.title}" by ${query.artist}`);
      } else {
        console.log(`No data found for "${query.title}" by ${query.artist}`);
      }
    } catch (error) {
      console.error(`Error fetching data for "${query.title}" by ${query.artist}:`, error);
    }
  }

  console.log('Finished fetching artwork data from Artsy.');
}

// Run the script
fetchArtworks().catch(error => {
  console.error('Script execution failed:', error);
  process.exit(1);
});
