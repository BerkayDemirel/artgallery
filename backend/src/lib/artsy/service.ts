import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import { ArtsyClient } from './client';
import { EnhancedArtworkData } from '../../types/artsy';

export class ArtsyService {
  private client: ArtsyClient;
  private dataDir: string;
  private imagesDir: string;

  constructor() {
    this.client = new ArtsyClient();
    this.dataDir = path.resolve(process.cwd(), 'data', 'artworks');
    this.imagesDir = path.resolve(process.cwd(), 'public', 'static', 'images', 'artworks');

    // Ensure directories exist
    fs.ensureDirSync(this.dataDir);
    fs.ensureDirSync(this.imagesDir);
  }

  /**
   * Search for an artwork by artist and title
   */
  public async searchArtwork(artist: string, title: string): Promise<EnhancedArtworkData | null> {
    try {
      // Search for the artwork
      const searchQuery = `${title} ${artist}`;
      const searchResults = await this.client.searchArtworks(searchQuery);

      if (!searchResults._embedded.results.length) {
        console.log(`No results found for "${searchQuery}"`);
        return null;
      }

      // Get the top result
      const topResult = searchResults._embedded.results[0];

      // Get detailed artwork data
      const artwork = await this.client.getArtwork(topResult.id);

      // Generate a slug if it's missing
      const slug = artwork.slug || this.generateSlug(artwork.title || title, artist);

      // Get artist data
      let artistData = null;
      if (artwork._links.artists) {
        const artistUrl = artwork._links.artists.href;
        const artistId = artistUrl.split('/').pop();
        if (artistId) {
          artistData = await this.client.getArtist(artistId);
        }
      }

      // Get image URL
      let imageUrl = '';

      // Try to get image URL from thumbnail first (more reliable)
      if (topResult._links && topResult._links.thumbnail && topResult._links.thumbnail.href) {
        // Convert thumbnail URL to larger version
        imageUrl = topResult._links.thumbnail.href.replace('square.jpg', 'larger.jpg');
      } else if (artwork._links && artwork._links.thumbnail && artwork._links.thumbnail.href) {
        // Convert thumbnail URL to larger version
        imageUrl = artwork._links.thumbnail.href.replace('square.jpg', 'larger.jpg');
      } else {
        // Fallback to client method
        imageUrl = this.client.getImageUrl(artwork, 'larger');
      }

      let imagePath = '';

      // Download the image if URL is available
      if (imageUrl) {
        try {
          imagePath = await this.downloadImage(imageUrl, slug);
        } catch (error) {
          console.error('Error downloading image:', error);
          // Use a placeholder image if download fails
          imagePath = 'placeholder.jpg';
        }
      } else {
        // Use a placeholder image if no image URL
        imagePath = 'placeholder.jpg';
      }

      // Get permalink URL or use a default
      const sourceUrl = artwork._links.permalink?.href || `https://www.artsy.net/artwork/${slug}`;

      // Create enhanced artwork data
      const enhancedData: EnhancedArtworkData = {
        slug,
        title: artwork.title || title,
        artist: artistData?.name || artwork.cultural_maker || artist || 'Unknown Artist',
        year: this.extractYear(artwork.date),
        country: artistData?.nationality || 'Unknown',
        period: this.determinePeriod(artwork.date),
        imageUrl: `/static/images/artworks/${path.basename(imagePath)}`,
        relevance: artwork.blurb || artwork.additional_information || '',
        trivia: this.generateTrivia(artwork, artistData),
        medium: artwork.medium || '',
        materials: artwork.category || '',
        dimensions: artwork.dimensions || { in: '', cm: '' },
        description: artwork.additional_information || artwork.blurb || '',
        artistBio: artistData?.biography || '',
        source: 'Artsy',
        sourceUrl: sourceUrl,
        createdAt: new Date().toISOString()
      };

      // Add hardcoded metadata for well-known artworks if we don't have enough data
      this.enrichWithHardcodedData(enhancedData, title, artist);

      // Save the data
      await this.saveArtworkData(enhancedData);

      return enhancedData;
    } catch (error: unknown) {
      console.error('Error fetching artwork data:', error);
      return null;
    }
  }

  /**
   * Generate a slug from title and artist
   */
  private generateSlug(title: string, artist: string): string {
    if (!title || !artist) {
      console.warn('Missing title or artist for slug generation');
      // Fallback to a timestamp if both are missing
      if (!title && !artist) {
        return `artwork-${Date.now()}`;
      }
    }

    // Combine artist and title
    const combined = `${artist}-${title}`;

    // Convert to lowercase and replace spaces and special characters with hyphens
    return combined
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .trim();
  }

  /**
   * Download an image from a URL
   */
  private async downloadImage(url: string, slug: string): Promise<string> {
    if (!url) {
      throw new Error('Empty image URL');
    }

    try {
      // Try different image versions if the URL contains a version parameter
      let finalUrl = url;
      if (url.includes('{image_version}')) {
        finalUrl = url.replace('{image_version}', 'larger');
      }

      const response = await axios.get(finalUrl, {
        responseType: 'arraybuffer',
        timeout: 10000, // 10 second timeout
        maxRedirects: 5,
        headers: {
          'Accept': 'image/jpeg,image/png,image/gif,image/*'
        }
      });

      const contentType = response.headers['content-type'];

      // Check if we actually got an image
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Received non-image content type');
      }

      const extension = this.getImageExtension(contentType);
      const filename = `${slug}${extension}`;
      const filePath = path.join(this.imagesDir, filename);

      await fs.writeFile(filePath, response.data);

      return filename;
    } catch (error: unknown) {
      // Try thumbnail as fallback
      if (url.includes('larger')) {
        try {
          const thumbnailUrl = url.replace('larger', 'square');

          const response = await axios.get(thumbnailUrl, {
            responseType: 'arraybuffer',
            timeout: 10000
          });

          const contentType = response.headers['content-type'];
          if (contentType && contentType.startsWith('image/')) {
            const extension = this.getImageExtension(contentType);
            const filename = `${slug}${extension}`;
            const filePath = path.join(this.imagesDir, filename);

            await fs.writeFile(filePath, response.data);

            return filename;
          }
        } catch (fallbackError) {
          console.error('Error downloading thumbnail image:', fallbackError);
        }
      }

      throw error;
    }
  }

  /**
   * Get image extension from content type
   */
  private getImageExtension(contentType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp'
    };

    return map[contentType] || '.jpg';
  }

  /**
   * Extract year from date string
   */
  private extractYear(dateStr: string): number {
    if (!dateStr) return 0;

    // Try to extract a 4-digit year
    const yearMatch = dateStr.match(/\b(\d{4})\b/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }

    return 0;
  }

  /**
   * Determine art period based on year
   */
  private determinePeriod(dateStr: string): string {
    const year = this.extractYear(dateStr);

    if (year === 0) {
      return 'unknown';
    }

    if (year >= 1300 && year < 1600) return 'renaissance';
    if (year >= 1600 && year < 1750) return 'baroque';
    if (year >= 1750 && year < 1850) return 'neoclassicism';
    if (year >= 1850 && year < 1900) return 'impressionism';
    if (year >= 1900 && year < 1950) return 'modernism';
    if (year >= 1950) return 'contemporary';

    return 'unknown';
  }

  /**
   * Generate trivia facts about the artwork
   */
  private generateTrivia(artwork: any, artist: any): string[] {
    const trivia: string[] = [];

    if (artwork.additional_information) {
      trivia.push(artwork.additional_information);
    }

    if (artwork.exhibition_history) {
      trivia.push(`Exhibition history: ${artwork.exhibition_history}`);
    }

    if (artwork.provenance) {
      trivia.push(`Provenance: ${artwork.provenance}`);
    }

    if (artist?.biography) {
      trivia.push(`About the artist: ${artist.biography}`);
    }

    // Ensure we have at least one trivia item
    if (trivia.length === 0) {
      trivia.push(`This artwork was created by ${artwork.cultural_maker || 'the artist'} in ${artwork.date || 'an unknown date'}.`);
    }

    return trivia;
  }

  /**
   * Save artwork data to a file
   */
  private async saveArtworkData(data: EnhancedArtworkData): Promise<void> {
    const filePath = path.join(this.dataDir, `${data.slug}.md`);

    // Create markdown content with frontmatter
    const content = `---
${JSON.stringify(data, null, 2)}
---
`;

    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Saved artwork data to ${filePath}`);
  }

  /**
   * Enrich artwork data with hardcoded metadata for well-known artworks
   */
  private enrichWithHardcodedData(data: EnhancedArtworkData, title: string, artist: string): void {
    // Only add hardcoded data if we're missing important fields
    if (data.year === 0 || data.period === 'unknown' || !data.relevance) {
      const key = `${artist.toLowerCase()} ${title.toLowerCase()}`;

      // Add hardcoded data for well-known artworks
      const hardcodedData: Record<string, Partial<EnhancedArtworkData>> = {
        'leonardo da vinci mona lisa': {
          year: 1503,
          period: 'renaissance',
          country: 'Italy',
          relevance: 'The Mona Lisa is one of the most famous paintings in the world, known for its subject\'s enigmatic smile.',
          trivia: [
            'The Mona Lisa is believed to be a portrait of Lisa Gherardini, the wife of Francesco del Giocondo.',
            'It was painted between 1503 and 1506, although Leonardo may have continued working on it until 1517.',
            'The painting is known for its subtle modeling of forms and atmospheric illusionism.'
          ]
        },
        'vincent van gogh starry night': {
          year: 1889,
          period: 'post-impressionism',
          country: 'France',
          relevance: 'The Starry Night is one of Van Gogh\'s most famous works, painted during his stay at the asylum of Saint-Paul-de-Mausole.',
          trivia: [
            'Van Gogh painted The Starry Night during his 12-month stay at the asylum of Saint-Paul-de-Mausole near Saint-Rémy-de-Provence.',
            'The painting depicts the view from his asylum window at night, although it was painted from memory during the day.',
            'The swirling patterns in the sky reflect Van Gogh\'s emotional state and his unique artistic vision.'
          ]
        },
        'claude monet water lilies': {
          year: 1919,
          period: 'impressionism',
          country: 'France',
          relevance: 'Water Lilies is a series of approximately 250 oil paintings by French Impressionist Claude Monet, depicting his flower garden at his home in Giverny.',
          trivia: [
            'Monet painted the Water Lilies series during the last 30 years of his life.',
            'The paintings depict his flower garden at his home in Giverny, with a focus on the water lily pond.',
            'Monet\'s cataracts affected his vision in his later years, influencing the style of his later Water Lilies paintings.'
          ]
        },
        'edvard munch the scream': {
          year: 1893,
          period: 'expressionism',
          country: 'Norway',
          relevance: 'The Scream is one of the most iconic images of art, representing the universal anxiety of modern man.',
          trivia: [
            'The Scream exists in four versions: two paintings and two pastels.',
            'The landscape in the background is the Oslofjord, viewed from Ekeberg, Oslo.',
            'Munch was inspired by a walk during which he felt an "infinite scream passing through nature."'
          ]
        },
        'pablo picasso guernica': {
          year: 1937,
          period: 'cubism',
          country: 'Spain',
          relevance: 'Guernica is a powerful political statement, painted as an immediate reaction to the Nazi\'s bombing of the Basque town of Guernica during the Spanish Civil War.',
          trivia: [
            'Guernica was created in response to the bombing of Guernica, a Basque Country town in northern Spain, by Nazi Germany and Fascist Italy at the request of the Spanish Nationalists.',
            'The painting is done in a monochromatic palette of gray, black, and white.',
            'It has become a universal symbol of the horrors of war and the suffering it inflicts upon individuals, particularly innocent civilians.'
          ]
        }
      };

      // Check if we have hardcoded data for this artwork
      const match = Object.keys(hardcodedData).find(key =>
        key.includes(artist.toLowerCase()) && key.includes(title.toLowerCase())
      );

      if (match) {
        const hardcoded = hardcodedData[match];

        // Only override fields that are missing or have default values
        if (data.year === 0 && hardcoded.year) data.year = hardcoded.year;
        if (data.period === 'unknown' && hardcoded.period) data.period = hardcoded.period;
        if (data.country === 'Unknown' && hardcoded.country) data.country = hardcoded.country;
        if (!data.relevance && hardcoded.relevance) data.relevance = hardcoded.relevance;

        // Add trivia if we don't have any meaningful trivia
        if ((data.trivia.length === 0 ||
            (data.trivia.length === 1 && data.trivia[0].includes('unknown date'))) &&
            hardcoded.trivia) {
          data.trivia = hardcoded.trivia;
        }
      }
    }
  }
}
