// Period types
export interface Period {
  id: string;
  name: string;
  card_image_url: string;
  header_image_url: string;
  introduction: string;
  timeline_data: TimelineItem[];
  defining_features: DefiningFeature[];
  revolutionary_artists: Artist[];
  did_you_know: string[];
  created_at: string;
}

export interface TimelineItem {
  year: number;
  event: string;
}

export interface DefiningFeature {
  title: string;
  description: string;
  image_url: string;
}

export interface Artist {
  name: string;
  bio: string;
  image_url: string;
  notable_works: string[];
}

// Artwork types
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  period: string;
  image_url: string;
  relevance: string;
  trivia: string[];
  created_at: string;
}

// Newsletter type
export interface NewsletterSubscription {
  id: string;
  email: string;
  created_at: string;
} 