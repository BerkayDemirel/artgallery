import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ArtsyToken, ArtsyArtist, ArtsyArtwork, ArtsySearchResult } from '../../types/artsy';
import { RateLimiter } from './rate-limiter';

// Use require for modules without type definitions
// @ts-ignore
const traverson = require('traverson');
// @ts-ignore
const JsonHalAdapter = require('traverson-hal');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configure traverson with HAL adapter
traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);

// Create rate limiter (5 requests per second)
const rateLimiter = new RateLimiter(5, 1000);

export class ArtsyClient {
  private token: string | null = null;
  private tokenExpiresAt: Date | null = null;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiUrl: string = 'https://api.artsy.net/api';

  constructor() {
    const clientId = process.env.ARTSY_API_CLIENT_ID;
    const clientSecret = process.env.ARTSY_API_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Artsy API credentials not found in environment variables');
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Get a valid authentication token
   */
  private async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
      return this.token;
    }

    // Get a new token
    try {
      await rateLimiter.acquire();
      const response = await axios.post<ArtsyToken>(
        `${this.apiUrl}/tokens/xapp_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }
      );

      this.token = response.data.token;
      this.tokenExpiresAt = new Date(response.data.expires_at);

      return this.token;
    } catch (error: unknown) {
      console.error('Error getting Artsy API token:', error);
      throw new Error('Failed to authenticate with Artsy API');
    }
  }

  /**
   * Create a new traverson API instance with authentication
   */
  private async createApi() {
    const token = await this.getToken();
    return traverson
      .from(this.apiUrl)
      .jsonHal()
      .withRequestOptions({
        headers: {
          'X-Xapp-Token': token,
          'Accept': 'application/vnd.artsy-v2+json'
        }
      });
  }

  /**
   * Search for artworks by query
   */
  public async searchArtworks(query: string): Promise<ArtsySearchResult> {
    try {
      await rateLimiter.acquire();
      const token = await this.getToken();

      const response = await axios.get<ArtsySearchResult>(
        `${this.apiUrl}/search`,
        {
          params: {
            q: query,
            type: 'artwork',
            size: 10
          },
          headers: {
            'X-Xapp-Token': token,
            'Accept': 'application/vnd.artsy-v2+json'
          }
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.error('Error searching artworks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to search artworks: ${errorMessage}`);
    }
  }

  /**
   * Get artwork by ID or slug
   */
  public async getArtwork(id: string): Promise<ArtsyArtwork> {
    try {
      const api = await this.createApi();

      return new Promise<ArtsyArtwork>((resolve, reject) => {
        rateLimiter.acquire().then(() => {
          api.newRequest()
            .follow('artwork')
            .withTemplateParameters({ id })
            .getResource((error: any, artwork: any) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(artwork as ArtsyArtwork);
            });
        });
      });
    } catch (error: unknown) {
      console.error('Error getting artwork:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get artwork: ${errorMessage}`);
    }
  }

  /**
   * Get artist by ID or slug
   */
  public async getArtist(id: string): Promise<ArtsyArtist> {
    try {
      const api = await this.createApi();

      return new Promise<ArtsyArtist>((resolve, reject) => {
        rateLimiter.acquire().then(() => {
          api.newRequest()
            .follow('artist')
            .withTemplateParameters({ id })
            .getResource((error: any, artist: any) => {
              if (error) {
                reject(error);
                return;
              }
              resolve(artist as ArtsyArtist);
            });
        });
      });
    } catch (error: unknown) {
      console.error('Error getting artist:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get artist: ${errorMessage}`);
    }
  }

  /**
   * Get image URL from artwork
   */
  public getImageUrl(artwork: ArtsyArtwork, version: string = 'larger'): string {
    // First check if there's a direct image link
    if (artwork._links.image) {
      return artwork._links.image.href.replace('{image_version}', version);
    }

    // Check for images array
    if (artwork.images && artwork.images.length > 0) {
      // Get the first image
      const image = artwork.images[0];
      if (image.image_urls && image.image_urls[version]) {
        return image.image_urls[version];
      }
    }

    // Check for thumbnail as fallback
    if (artwork._links.thumbnail && artwork._links.thumbnail.href) {
      return artwork._links.thumbnail.href;
    }

    // If we still don't have an image, try to use the search result thumbnail
    if (artwork._links && artwork._links.self && artwork._links.self.href) {
      const artworkId = artwork._links.self.href.split('/').pop();
      if (artworkId) {
        return `https://d32dm0rphc51dk.cloudfront.net/${artworkId}/larger.jpg`;
      }
    }

    return '';
  }
}
