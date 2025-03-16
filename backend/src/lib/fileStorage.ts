import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Period, Artwork } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PERIODS_DIR = path.join(DATA_DIR, 'periods');
const ARTWORKS_DIR = path.join(DATA_DIR, 'artworks');

/**
 * Reads and parses a markdown file with frontmatter
 */
export async function readMarkdownFile<T>(filePath: string): Promise<T> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    ...data,
    content,
  } as T;
}

/**
 * Writes data to a markdown file with frontmatter
 */
export async function writeMarkdownFile<T extends { content?: string }>(
  filePath: string,
  data: T
): Promise<void> {
  const { content, ...frontmatter } = data;
  const fileContent = matter.stringify(content || '', frontmatter);
  await fs.writeFile(filePath, fileContent, 'utf-8');
}

/**
 * Lists all markdown files in a directory
 */
async function listMarkdownFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  return files.filter(file => file.endsWith('.md'));
}

/**
 * Gets all periods from the file system
 */
export async function getAllPeriods(): Promise<Period[]> {
  const files = await listMarkdownFiles(PERIODS_DIR);
  const periods = await Promise.all(
    files.map(async file => {
      const filePath = path.join(PERIODS_DIR, file);
      return readMarkdownFile<Period>(filePath);
    })
  );
  return periods;
}

/**
 * Gets a specific period by its slug
 */
export async function getPeriodBySlug(slug: string): Promise<Period | null> {
  const filePath = path.join(PERIODS_DIR, `${slug}.md`);
  try {
    return await readMarkdownFile<Period>(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Gets all artworks from the file system
 */
export async function getAllArtworks(): Promise<Artwork[]> {
  const files = await listMarkdownFiles(ARTWORKS_DIR);
  const artworks = await Promise.all(
    files.map(async file => {
      const filePath = path.join(ARTWORKS_DIR, file);
      return readMarkdownFile<Artwork>(filePath);
    })
  );
  return artworks;
}

/**
 * Gets artworks for a specific period
 */
export async function getArtworksByPeriod(periodSlug: string): Promise<Artwork[]> {
  const allArtworks = await getAllArtworks();
  return allArtworks.filter(artwork => artwork.period === periodSlug);
}

/**
 * Gets a specific artwork by its slug
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const filePath = path.join(ARTWORKS_DIR, `${slug}.md`);
  try {
    return await readMarkdownFile<Artwork>(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Creates or updates a period
 */
export async function savePeriod(slug: string, period: Period): Promise<void> {
  const filePath = path.join(PERIODS_DIR, `${slug}.md`);
  await writeMarkdownFile(filePath, period);
}

/**
 * Creates or updates an artwork
 */
export async function saveArtwork(slug: string, artwork: Artwork): Promise<void> {
  const filePath = path.join(ARTWORKS_DIR, `${slug}.md`);
  await writeMarkdownFile(filePath, artwork);
} 