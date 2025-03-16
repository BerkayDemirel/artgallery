import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import { ArtsyService } from '../service';
import { ArtsyClient } from '../client';
import { ArtsySearchResult, ArtsyArtwork, ArtsyArtist } from '../../../types/artsy';

// Mock fs-extra
jest.mock('fs-extra');
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock ArtsyClient
jest.mock('../client');
const MockedArtsyClient = ArtsyClient as jest.MockedClass<typeof ArtsyClient>;

describe('ArtsyService', () => {
  let service: ArtsyService;
  let mockClient: jest.Mocked<ArtsyClient>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock client
    mockClient = {
      searchArtworks: jest.fn(),
      getArtwork: jest.fn(),
      getArtist: jest.fn(),
      getImageUrl: jest.fn()
    } as unknown as jest.Mocked<ArtsyClient>;

    // Mock the ArtsyClient constructor
    MockedArtsyClient.mockImplementation(() => mockClient);

    // Mock fs-extra methods
    mockedFs.ensureDirSync.mockImplementation(() => {});
    mockedFs.writeFile.mockImplementation(() => Promise.resolve());

    // Create service instance
    service = new ArtsyService();
  });

  describe('searchArtwork', () => {
    it('should fetch and process artwork data', async () => {
      // Mock search results
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

      // Mock artwork data
      const mockArtwork: Partial<ArtsyArtwork> = {
        id: 'artwork-id',
        slug: 'leonardo-da-vinci-mona-lisa',
        title: 'Mona Lisa',
        date: '1503-1506',
        medium: 'Oil on poplar panel',
        category: 'Painting',
        dimensions: {
          in: '30 × 21 in',
          cm: '77 × 53 cm'
        },
        blurb: 'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.',
        additional_information: 'The Mona Lisa is one of the most valuable paintings in the world.',
        _links: {
          self: { href: 'https://api.artsy.net/api/artworks/artwork-id' },
          permalink: { href: 'https://www.artsy.net/artwork/leonardo-da-vinci-mona-lisa' },
          thumbnail: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_thumbnail.jpg' },
          image: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_{image_version}.jpg' },
          artists: { href: 'https://api.artsy.net/api/artists/artist-id' },
          partner: { href: 'https://api.artsy.net/api/partners/partner-id' },
          similar_artworks: { href: 'https://api.artsy.net/api/artworks?similar_to=artwork-id' }
        }
      };

      // Mock artist data
      const mockArtist: Partial<ArtsyArtist> = {
        id: 'artist-id',
        name: 'Leonardo da Vinci',
        biography: 'Leonardo da Vinci was an Italian polymath of the Renaissance.',
        nationality: 'Italian',
        birthday: '1452',
        deathday: '1519'
      };

      // Mock client methods
      mockClient.searchArtworks.mockResolvedValue(mockSearchResult);
      mockClient.getArtwork.mockResolvedValue(mockArtwork as ArtsyArtwork);
      mockClient.getArtist.mockResolvedValue(mockArtist as ArtsyArtist);
      mockClient.getImageUrl.mockReturnValue('https://d32dm0rphc51dk.cloudfront.net/mona-lisa_larger.jpg');

      // Mock axios get for image download
      mockedAxios.get.mockResolvedValue({
        data: Buffer.from('mock-image-data'),
        headers: {
          'content-type': 'image/jpeg'
        }
      });

      // Call the method
      const result = await service.searchArtwork('Leonardo da Vinci', 'Mona Lisa');

      // Verify the search was performed correctly
      expect(mockClient.searchArtworks).toHaveBeenCalledWith('Mona Lisa Leonardo da Vinci');
      expect(mockClient.getArtwork).toHaveBeenCalledWith('artwork-id');
      expect(mockClient.getArtist).toHaveBeenCalledWith('artist-id');
      expect(mockClient.getImageUrl).toHaveBeenCalledWith(mockArtwork as ArtsyArtwork, 'larger');

      // Verify the image was downloaded
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_larger.jpg',
        { responseType: 'arraybuffer' }
      );

      // Verify the data was saved
      expect(mockedFs.writeFile).toHaveBeenCalledTimes(2); // Once for the image, once for the data

      // Verify the result
      expect(result).toMatchObject({
        slug: 'leonardo-da-vinci-mona-lisa',
        title: 'Mona Lisa',
        artist: 'Leonardo da Vinci',
        year: 1503,
        country: 'Italian',
        period: 'renaissance',
        medium: 'Oil on poplar panel',
        materials: 'Painting',
        dimensions: {
          in: '30 × 21 in',
          cm: '77 × 53 cm'
        },
        description: 'The Mona Lisa is one of the most valuable paintings in the world.',
        artistBio: 'Leonardo da Vinci was an Italian polymath of the Renaissance.',
        source: 'Artsy',
        sourceUrl: 'https://www.artsy.net/artwork/leonardo-da-vinci-mona-lisa'
      });
    });

    it('should handle missing permalink URL', async () => {
      // Mock search results
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
                thumbnail: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_thumbnail.jpg' },
                image: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_{image_version}.jpg' }
              }
            }
          ]
        }
      };

      // Mock artwork data without permalink
      const mockArtwork: Partial<ArtsyArtwork> = {
        id: 'artwork-id',
        slug: 'leonardo-da-vinci-mona-lisa',
        title: 'Mona Lisa',
        date: '1503-1506',
        _links: {
          self: { href: 'https://api.artsy.net/api/artworks/artwork-id' },
          thumbnail: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_thumbnail.jpg' },
          image: { href: 'https://d32dm0rphc51dk.cloudfront.net/mona-lisa_{image_version}.jpg' },
          artists: { href: 'https://api.artsy.net/api/artists/artist-id' },
          partner: { href: 'https://api.artsy.net/api/partners/partner-id' },
          similar_artworks: { href: 'https://api.artsy.net/api/artworks?similar_to=artwork-id' }
        }
      };

      // Mock client methods
      mockClient.searchArtworks.mockResolvedValue(mockSearchResult);
      mockClient.getArtwork.mockResolvedValue(mockArtwork as ArtsyArtwork);
      mockClient.getImageUrl.mockReturnValue('https://d32dm0rphc51dk.cloudfront.net/mona-lisa_larger.jpg');

      // Mock axios get for image download
      mockedAxios.get.mockResolvedValue({
        data: Buffer.from('mock-image-data'),
        headers: {
          'content-type': 'image/jpeg'
        }
      });

      // Call the method
      const result = await service.searchArtwork('Leonardo da Vinci', 'Mona Lisa');

      // Verify the result has the default sourceUrl
      expect(result).not.toBeNull();
      expect(result?.sourceUrl).toBe('https://www.artsy.net/artwork/leonardo-da-vinci-mona-lisa');
    });

    it('should return null if no search results are found', async () => {
      // Mock empty search results
      const mockEmptySearchResult: ArtsySearchResult = {
        total_count: 0,
        _links: {
          self: { href: 'https://api.artsy.net/api/search?q=nonexistent+artwork' },
          next: { href: 'https://api.artsy.net/api/search?q=nonexistent+artwork&cursor=next' }
        },
        _embedded: {
          results: []
        }
      };

      // Mock client methods
      mockClient.searchArtworks.mockResolvedValue(mockEmptySearchResult);

      // Call the method
      const result = await service.searchArtwork('Unknown Artist', 'Nonexistent Artwork');

      // Verify the search was performed correctly
      expect(mockClient.searchArtworks).toHaveBeenCalledWith('Nonexistent Artwork Unknown Artist');

      // Verify no further calls were made
      expect(mockClient.getArtwork).not.toHaveBeenCalled();
      expect(mockClient.getArtist).not.toHaveBeenCalled();
      expect(mockClient.getImageUrl).not.toHaveBeenCalled();
      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(mockedFs.writeFile).not.toHaveBeenCalled();

      // Verify the result is null
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      // Mock client methods to throw an error
      mockClient.searchArtworks.mockRejectedValue(new Error('API error'));

      // Call the method
      const result = await service.searchArtwork('Leonardo da Vinci', 'Mona Lisa');

      // Verify the search was attempted
      expect(mockClient.searchArtworks).toHaveBeenCalledWith('Mona Lisa Leonardo da Vinci');

      // Verify no further calls were made
      expect(mockClient.getArtwork).not.toHaveBeenCalled();
      expect(mockClient.getArtist).not.toHaveBeenCalled();
      expect(mockClient.getImageUrl).not.toHaveBeenCalled();
      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(mockedFs.writeFile).not.toHaveBeenCalled();

      // Verify the result is null
      expect(result).toBeNull();
    });
  });

  describe('extractYear', () => {
    it('should extract the year from a date string', () => {
      // Call the private method using any type assertion
      const year = (service as any).extractYear('1503-1506');

      // Verify the year was extracted correctly
      expect(year).toBe(1503);
    });

    it('should return 0 if no year is found', () => {
      // Call the private method using any type assertion
      const year = (service as any).extractYear('Early 16th century');

      // Verify 0 was returned
      expect(year).toBe(0);
    });

    it('should return 0 if the date string is empty', () => {
      // Call the private method using any type assertion
      const year = (service as any).extractYear('');

      // Verify 0 was returned
      expect(year).toBe(0);
    });
  });

  describe('determinePeriod', () => {
    it('should determine the period based on the year', () => {
      // Test various periods
      expect((service as any).determinePeriod('1503')).toBe('renaissance');
      expect((service as any).determinePeriod('1650')).toBe('baroque');
      expect((service as any).determinePeriod('1800')).toBe('neoclassicism');
      expect((service as any).determinePeriod('1875')).toBe('impressionism');
      expect((service as any).determinePeriod('1925')).toBe('modernism');
      expect((service as any).determinePeriod('2000')).toBe('contemporary');
      expect((service as any).determinePeriod('unknown')).toBe('unknown');
    });
  });
});
