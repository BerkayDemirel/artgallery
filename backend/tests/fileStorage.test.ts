import fs from 'fs/promises';
import path from 'path';
import {
  readMarkdownFile,
  writeMarkdownFile,
  getAllPeriods,
  getPeriodBySlug,
} from '../src/lib/fileStorage';
import { Period } from '../src/types';

jest.mock('fs/promises');

describe('File Storage Utility', () => {
  const mockPeriod: Period = {
    slug: 'renaissance',
    name: 'Renaissance',
    cardImageUrl: '/images/renaissance-card.jpg',
    headerImageUrl: '/images/renaissance-header.jpg',
    introduction: 'The Renaissance was a period of cultural rebirth...',
    timelineData: [
      { year: 1400, event: 'Early Renaissance begins' },
    ],
    definingFeatures: [
      {
        title: 'Perspective',
        description: 'Development of linear perspective in painting',
      },
    ],
    revolutionaryArtists: [
      {
        name: 'Leonardo da Vinci',
        bio: 'Italian polymath of the Renaissance',
        imageUrl: '/images/leonardo.jpg',
        notableWorks: ['Mona Lisa', 'The Last Supper'],
      },
    ],
    didYouKnow: ['The term Renaissance means "rebirth" in French'],
    createdAt: '2024-03-16T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('readMarkdownFile', () => {
    it('should read and parse a markdown file with frontmatter', async () => {
      const mockContent = `---
name: Renaissance
---
The Renaissance was a period of cultural rebirth...`;

      (fs.readFile as jest.Mock).mockResolvedValue(mockContent);

      const result = await readMarkdownFile<Period>('test.md');
      expect(result).toHaveProperty('name', 'Renaissance');
      expect(result).toHaveProperty('content', 'The Renaissance was a period of cultural rebirth...');
    });
  });

  describe('writeMarkdownFile', () => {
    it('should write data to a markdown file with frontmatter', async () => {
      await writeMarkdownFile('test.md', {
        name: 'Renaissance',
        content: 'The Renaissance was a period of cultural rebirth...',
      });

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = (fs.writeFile as jest.Mock).mock.calls[0];
      expect(writeCall[0]).toBe('test.md');
      expect(writeCall[1]).toContain('name: Renaissance');
      expect(writeCall[1]).toContain('The Renaissance was a period of cultural rebirth...');
    });
  });

  describe('getAllPeriods', () => {
    it('should return all periods from the periods directory', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue(['renaissance.md']);
      (fs.readFile as jest.Mock).mockResolvedValue(`---
name: Renaissance
---
Content`);

      const periods = await getAllPeriods();
      expect(periods).toHaveLength(1);
      expect(periods[0]).toHaveProperty('name', 'Renaissance');
    });
  });

  describe('getPeriodBySlug', () => {
    it('should return a specific period by slug', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(`---
name: Renaissance
---
Content`);

      const period = await getPeriodBySlug('renaissance');
      expect(period).toHaveProperty('name', 'Renaissance');
    });

    it('should return null for non-existent period', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue({ code: 'ENOENT' });

      const period = await getPeriodBySlug('nonexistent');
      expect(period).toBeNull();
    });
  });
}); 