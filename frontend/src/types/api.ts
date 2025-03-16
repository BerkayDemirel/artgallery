// Period types
export interface Period {
  id: string;
  name: string;
  cardImageUrl: string;
  headerImageUrl: string;
  introduction: string;
  timelineData: TimelineItem[];
  definingFeatures: DefiningFeature[];
  revolutionaryArtists: Artist[];
  didYouKnow: string[];
  createdAt: string;
}

export interface TimelineItem {
  year: number;
  event: string;
}

export interface DefiningFeature {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Artist {
  name: string;
  bio: string;
  imageUrl: string;
  notableWorks: string[];
}

// Artwork types
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  periodId: string;
  imageUrl: string;
  relevance: string;
  trivia: string[];
  createdAt: string;
}

// Newsletter type
export interface NewsletterSubscription {
  email: string;
} 