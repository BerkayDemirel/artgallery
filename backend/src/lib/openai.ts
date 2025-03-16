import OpenAI from 'openai';
import { Period, Artwork } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Retry configuration for API calls
 */
const RETRY_OPTIONS = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
};

/**
 * Implements exponential backoff for retrying failed API calls
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retryCount >= RETRY_OPTIONS.maxRetries) {
      throw error;
    }

    const delay = Math.min(
      RETRY_OPTIONS.initialDelay * Math.pow(2, retryCount),
      RETRY_OPTIONS.maxDelay
    );

    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retryCount + 1);
  }
}

/**
 * Generate a description for an art period
 */
export async function generatePeriodDescription(
  periodName: string,
  existingArtworks: string[]
): Promise<Partial<Period>> {
  const prompt = `Generate a comprehensive description of the ${periodName} art period. Include:
1. A brief introduction (2-3 sentences)
2. 3-4 timeline events with years
3. 3 defining features of the period
4. 3 revolutionary artists from this period (include a brief bio and 2-3 notable works for each)
5. 3 interesting facts about the period

Format the response as a JSON object with the following structure:
{
  "introduction": "string",
  "timelineData": [{"year": number, "event": "string"}],
  "definingFeatures": [{"title": "string", "description": "string"}],
  "revolutionaryArtists": [{"name": "string", "bio": "string", "notableWorks": ["string"]}],
  "didYouKnow": ["string"]
}

Make sure to:
- Be historically accurate
- Focus on the most significant aspects
- Keep descriptions concise but informative
- Reference these existing artworks if relevant: ${existingArtworks.join(', ')}`;

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert art historian. Respond with a JSON object only, no markdown formatting or explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
  );

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  // Clean up the content by removing any markdown formatting
  const cleanContent = content
    .replace(/^```json\s*/, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleanContent);
  } catch (error) {
    throw new AIGenerationError('Failed to parse period description', { content: cleanContent });
  }
}

/**
 * Generate artwork descriptions for a period
 */
export async function generateArtworkDescriptions(
  periodName: string,
  count: number = 5
): Promise<Partial<Artwork>[]> {
  const prompt = `Generate ${count} historically accurate artwork descriptions from the ${periodName} period. For each artwork:
1. Include the title, artist, year, and country of origin
2. Provide a brief description of its relevance to the period
3. Include 3 interesting trivia facts about the artwork

Format the response as a JSON array of objects with the following structure:
[{
  "title": "string",
  "artist": "string",
  "year": number,
  "country": "string",
  "relevance": "string",
  "trivia": ["string"]
}]

Make sure to:
- Use real, historically significant artworks
- Be accurate with dates and attributions
- Include diverse artists and art forms
- Keep descriptions engaging but factual`;

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert art curator. Respond with a JSON array only, no markdown formatting or explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
  );

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  // Clean up the content by removing any markdown formatting
  const cleanContent = content
    .replace(/^```json\s*/, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(cleanContent);
  } catch (error) {
    throw new AIGenerationError('Failed to parse artwork descriptions', { content: cleanContent });
  }
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Process and validate AI-generated content
 */
export function validateGeneratedContent<T>(
  content: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every(field => {
    const value = content[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Error class for AI-related operations
 */
export class AIGenerationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'AIGenerationError';
  }
} 