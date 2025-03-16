import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';

// Base paths for data
const PERIODS_DIR = path.join(__dirname, '../../data/periods');
const ARTWORKS_DIR = path.join(__dirname, '../../data/artworks');
const NEWSLETTER_FILE = path.join(__dirname, '../../data/newsletter.json');

// Ensure directories exist
fs.ensureDirSync(PERIODS_DIR);
fs.ensureDirSync(ARTWORKS_DIR);

// Initialize newsletter file if it doesn't exist
if (!fs.existsSync(NEWSLETTER_FILE)) {
  fs.writeJSONSync(NEWSLETTER_FILE, { subscriptions: [] });
}

// Helper to read markdown file with frontmatter
export function readMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const htmlContent = marked(content);
  
  return {
    ...data,
    content: htmlContent,
    rawContent: content
  };
}

// Periods Service
export const periodsService = {
  // Get all periods
  async getAllPeriods() {
    const periodFiles = await fs.readdir(PERIODS_DIR);
    
    return periodFiles
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(PERIODS_DIR, file);
        const { id, name, card_image_url, description } = readMarkdownFile(filePath);
        
        return {
          id,
          name,
          card_image_url,
          description
        };
      });
  },
  
  // Get a specific period by ID
  async getPeriodById(id: string) {
    const filePath = path.join(PERIODS_DIR, `${id}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return readMarkdownFile(filePath);
  }
};

// Artworks Service
export const artworksService = {
  // Get all artworks with optional period filter
  async getArtworks(periodId?: string) {
    const artworkFiles = await fs.readdir(ARTWORKS_DIR);
    
    const artworks = artworkFiles
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(ARTWORKS_DIR, file);
        return readMarkdownFile(filePath);
      });
    
    // Filter by period if provided
    if (periodId) {
      return artworks.filter(artwork => artwork.period === periodId);
    }
    
    return artworks;
  },
  
  // Get a specific artwork by ID
  async getArtworkById(id: string) {
    const filePath = path.join(ARTWORKS_DIR, `${id}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return readMarkdownFile(filePath);
  }
};

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