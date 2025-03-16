import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';
import { Period, Artwork } from '../types';

// Base paths for data
const DATA_DIR = path.resolve(__dirname, '../../data');
const PERIODS_DIR = path.join(DATA_DIR, 'periods');
const ARTWORKS_DIR = path.join(DATA_DIR, 'artworks');
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter.json');

// Ensure directories exist
fs.ensureDir(PERIODS_DIR);
fs.ensureDir(ARTWORKS_DIR);

// Initialize newsletter file if it doesn't exist
if (!fs.access(NEWSLETTER_FILE).then(() => false).catch(() => true)) {
  fs.writeFile(NEWSLETTER_FILE, JSON.stringify({ subscriptions: [] }));
}

class FileService<T> {
  constructor(private directory: string) {}

  async getAll(): Promise<T[]> {
    try {
      const files = await fs.readdir(this.directory);
      const items = await Promise.all(
        files
          .filter(file => file.endsWith('.md'))
          .map(async file => {
            const content = await fs.readFile(path.join(this.directory, file), 'utf-8');
            const { data } = matter(content);
            return data as T;
          })
      );
      return items;
    } catch (error) {
      console.error(`Error reading from ${this.directory}:`, error);
      return [];
    }
  }

  async getBySlug(slug: string): Promise<T | null> {
    try {
      const filePath = path.join(this.directory, `${slug}.md`);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);
      return data as T;
    } catch (error) {
      console.error(`Error reading file ${slug}.md:`, error);
      return null;
    }
  }

  async search(query: string): Promise<T[]> {
    const items = await this.getAll();
    const searchTerms = query.toLowerCase().split(' ');
    
    return items.filter(item => {
      const itemStr = JSON.stringify(item).toLowerCase();
      return searchTerms.every(term => itemStr.includes(term));
    });
  }
}

export const periodsService = new FileService<Period>(PERIODS_DIR);
export const artworksService = new FileService<Artwork>(ARTWORKS_DIR);

// Helper to read markdown file with frontmatter
export function readMarkdownFile(filePath: string) {
  const fileContent = fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const htmlContent = marked(content);
  
  return {
    ...data,
    content: htmlContent,
    rawContent: content
  };
}

// Newsletter Service
export const newsletterService = {
  // Get all subscriptions
  async getAllSubscriptions() {
    const data = await fs.readJSON(NEWSLETTER_FILE);
    return data.subscriptions;
  },
  
  // Add a new subscription
  async addSubscription(email: string) {
    const data = await fs.readJSON(NEWSLETTER_FILE);
    
    // Check if email already exists
    const exists = data.subscriptions.some((sub: any) => sub.email === email);
    if (exists) {
      return { success: false, error: 'Email already subscribed' };
    }
    
    // Add new subscription
    const newSubscription = {
      id: uuidv4(),
      email,
      created_at: new Date().toISOString()
    };
    
    data.subscriptions.push(newSubscription);
    await fs.writeJSON(NEWSLETTER_FILE, data, { spaces: 2 });
    
    return { success: true, data: newSubscription };
  }
};

// Helper function to get artworks by period
export async function getArtworksByPeriod(periodSlug: string): Promise<Artwork[]> {
  const allArtworks = await artworksService.getAll();
  return allArtworks.filter(artwork => artwork.period === periodSlug);
} 