export interface Period {
  slug: string;
  name: string;
  cardImageUrl: string;
  headerImageUrl: string;
  introduction: string;
  timelineData: TimelineItem[];
  definingFeatures: Feature[];
  revolutionaryArtists: Artist[];
  didYouKnow: string[];
  content?: string;
  createdAt: string;
}

export interface TimelineItem {
  year: number;
  event: string;
}

export interface Feature {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Artist {
  name: string;
  bio: string;
  imageUrl: string;
  notableWorks: string[];
}

export interface Artwork {
  slug: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  period: string;
  imageUrl: string;
  relevance: string;
  trivia: string[];
  content?: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 