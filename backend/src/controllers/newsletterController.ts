import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { ApiResponse, NewsletterSubscription } from '../types';

const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter.json');

/**
 * Initialize newsletter file if it doesn't exist
 */
async function initNewsletterFile(): Promise<void> {
  try {
    await fs.access(NEWSLETTER_FILE);
  } catch {
    await fs.writeFile(NEWSLETTER_FILE, JSON.stringify({ subscriptions: [] }));
  }
}

/**
 * Read newsletter subscriptions from file
 */
async function readSubscriptions(): Promise<NewsletterSubscription[]> {
  const content = await fs.readFile(NEWSLETTER_FILE, 'utf-8');
  return JSON.parse(content).subscriptions;
}

/**
 * Write newsletter subscriptions to file
 */
async function writeSubscriptions(subscriptions: NewsletterSubscription[]): Promise<void> {
  await fs.writeFile(
    NEWSLETTER_FILE,
    JSON.stringify({ subscriptions }, null, 2)
  );
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Subscribe to newsletter
 */
export async function subscribe(
  req: Request<{}, {}, { email: string }>,
  res: Response<ApiResponse<{ message: string }>>
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email is required',
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
      return;
    }

    await initNewsletterFile();
    const subscriptions = await readSubscriptions();

    // Check for duplicate email
    if (subscriptions.some(sub => sub.email === email)) {
      res.status(400).json({
        success: false,
        error: 'Email is already subscribed',
      });
      return;
    }

    // Add new subscription
    const newSubscription: NewsletterSubscription = {
      email,
      createdAt: new Date().toISOString(),
    };

    subscriptions.push(newSubscription);
    await writeSubscriptions(subscriptions);

    res.status(201).json({
      success: true,
      data: {
        message: 'Successfully subscribed to newsletter',
      },
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter',
    });
  }
} 