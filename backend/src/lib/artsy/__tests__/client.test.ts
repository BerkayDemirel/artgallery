import axios from 'axios';
import { ArtsyClient } from '../client';
import { ArtsyToken, ArtsySearchResult, ArtsyArtwork, ArtsyArtist } from '../../../types/artsy';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock traverson
jest.mock('traverson', () => {
  const mockTraverson = {
    from: jest.fn().mockReturnThis(),
    jsonHal: jest.fn().mockReturnThis(),
    registerMediaType: jest.fn(),
  };
  return mockTraverson;
});

// Mock environment variables
process.env.ARTSY_API_CLIENT_ID = 'test-client-id';
process.env.ARTSY_API_CLIENT_SECRET = 'test-client-secret';

describe('ArtsyClient', () => {
  let client: ArtsyClient;

  beforeEach(() => {
    client = new ArtsyClient();
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    it('should fetch a token from the Artsy API', async () => {
      // Mock the token response
      const mockToken: ArtsyToken = {
        type: 'xapp_token',
        token: 'mock-token',
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockToken });

      // Call the private method using any type assertion
      const token = await (client as any).getToken();

      // Verify the token was fetched correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.artsy.net/api/tokens/xapp_token',
        {
          client_id: 'test-client-id',
          client_secret: 'test-client-secret'
        }
      );
      expect(token).toBe('mock-token');
    });

    it('should reuse an existing token if it is still valid', async () => {
      // Mock the token response
      const mockToken: ArtsyToken = {
        type: 'xapp_token',
        token: 'mock-token',
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockToken });

      // Call the private method twice
      await (client as any).getToken();
      await (client as any).getToken();

      // Verify the token was fetched only once
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('should fetch a new token if the existing token is expired', async () => {
      // Mock the first token response (expired)
      const expiredToken: ArtsyToken = {
        type: 'xapp_token',
        token: 'expired-token',
        expires_at: new Date(Date.now() - 1000).toISOString() // 1 second ago
      };

      // Mock the second token response
      const newToken: ArtsyToken = {
        type: 'xapp_token',
        token: 'new-token',
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      mockedAxios.post.mockResolvedValueOnce({ data: expiredToken });
      mockedAxios.post.mockResolvedValueOnce({ data: newToken });

      // Call the private method twice
      const token1 = await (client as any).getToken();
      const token2 = await (client as any).getToken();

      // Verify the token was fetched twice
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      expect(token1).toBe('expired-token');
      expect(token2).toBe('new-token');
    });
  });

  describe('searchArtworks', () => {
    it('should search for artworks by query', async () => {
      // Mock the token response
      const mockToken: ArtsyToken = {
        type: 'xapp_token',
        token: 'mock-token',
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };

      // Mock the search response
      const mockSearchResult: ArtsySearchResult = {
        total_count: 1,
        _links: {
          self: { href: 'https://api.artsy.net/api/search?q=mona+lisa' },
          next: { href: 'https://api.artsy.net/api/search?q=mona+lisa&cursor=next' }
        },
        _embedded: {
          results: [
            {
              type: 'artwork',
              id: 'artwork-id',
              slug: 'leonardo-da-vinci-mona-lisa',
              title: 'Mona Lisa',
              _links: {
                self: { href: 'https://api.artsy.net/api/artworks/artwork-id' },
                permalink: { href: 'https://www.artsy.net/artwork/leonardo-da-vinci-mona-lisa' },
                thumbnail: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_thumbnail.jpg' },
                image: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_{image_version}.jpg' }
              }
            }
          ]
        }
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockToken });
      mockedAxios.get.mockResolvedValueOnce({ data: mockSearchResult });

      // Call the method
      const result = await client.searchArtworks('mona lisa');

      // Verify the search was performed correctly
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.artsy.net/api/search',
        {
          params: {
            q: 'mona lisa',
            type: 'artwork',
            size: 10
          },
          headers: {
            'X-Xapp-Token': 'mock-token',
            'Accept': 'application/vnd.artsy-v2+json'
          }
        }
      );
      expect(result).toEqual(mockSearchResult);
    });
  });

  describe('getImageUrl', () => {
    it('should return the correct image URL', () => {
      // Create a mock artwork
      const mockArtwork = {
        _links: {
          image: {
            href: 'https://d32dm0rphc51dk.cloudfront.net/artwork_{image_version}.jpg'
          }
        }
      } as ArtsyArtwork;

      // Call the method
      const imageUrl = client.getImageUrl(mockArtwork, 'large');

      // Verify the URL was constructed correctly
      expect(imageUrl).toBe('https://d32dm0rphc51dk.cloudfront.net/artwork_large.jpg');
    });

    it('should return an empty string if the artwork has no image', () => {
      // Create a mock artwork without an image
      const mockArtwork = {
        _links: {}
      } as ArtsyArtwork;

      // Call the method
      const imageUrl = client.getImageUrl(mockArtwork);

      // Verify an empty string was returned
      expect(imageUrl).toBe('');
    });
  });
});
