import { generatePeriodDescription, generateArtworkDescriptions, generateSlug, validateGeneratedContent } from '../src/lib/openai';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    introduction: 'Test introduction',
                    timelineData: [{ year: 1500, event: 'Test event' }],
                    definingFeatures: [{ title: 'Test feature', description: 'Test description' }],
                    revolutionaryArtists: [{ name: 'Test Artist', bio: 'Test bio', notableWorks: ['Test work'] }],
                    didYouKnow: ['Test fact'],
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe('OpenAI Integration', () => {
  describe('generatePeriodDescription', () => {
    it('should generate a valid period description', async () => {
      const result = await generatePeriodDescription('Renaissance', ['Mona Lisa']);
      
      expect(result).toHaveProperty('introduction');
      expect(result).toHaveProperty('timelineData');
      expect(result).toHaveProperty('definingFeatures');
      expect(result).toHaveProperty('revolutionaryArtists');
      expect(result).toHaveProperty('didYouKnow');
    });
  });

  describe('generateArtworkDescriptions', () => {
    it('should generate artwork descriptions', async () => {
      const result = await generateArtworkDescriptions('Renaissance');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs', () => {
      expect(generateSlug('Mona Lisa')).toBe('mona-lisa');
      expect(generateSlug('The Last Supper!')).toBe('the-last-supper');
      expect(generateSlug('Birth of Venus (1486)')).toBe('birth-of-venus-1486');
    });
  });

  describe('validateGeneratedContent', () => {
    it('should validate content correctly', () => {
      const validContent = {
        title: 'Test',
        description: 'Test description',
        items: ['item1', 'item2'],
      };

      const invalidContent = {
        title: '',
        description: null,
        items: [],
      };

      expect(validateGeneratedContent(validContent, ['title', 'description', 'items'])).toBe(true);
      expect(validateGeneratedContent(invalidContent, ['title', 'description', 'items'])).toBe(false);
    });
  });
}); 