// API client for making requests to the backend
import { Period, Artwork, NewsletterSubscription } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      // Get error message from the response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API functions for periods
export async function getPeriods(): Promise<Period[]> {
  return fetchAPI<Period[]>('/periods');
}

export async function getPeriod(id: string): Promise<Period> {
  return fetchAPI<Period>(`/periods/${id}`);
}

// API functions for artworks
export async function getArtworks(periodId?: string): Promise<Artwork[]> {
  const query = periodId ? `?period=${periodId}` : '';
  return fetchAPI<Artwork[]>(`/artworks${query}`);
}

export async function getArtwork(id: string): Promise<Artwork> {
  return fetchAPI<Artwork>(`/artworks/${id}`);
}

// API function for newsletter subscription
export async function subscribeToNewsletter(email: string): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
} 