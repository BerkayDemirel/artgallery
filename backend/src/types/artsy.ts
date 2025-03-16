export interface ArtsyToken {
  type: string;
  token: string;
  expires_at: string;
}

export interface ArtsyArtist {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  name: string;
  sortable_name: string;
  gender: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  hometown: string;
  location: string;
  nationality: string;
  image_versions: string[];
  _links: {
    self: { href: string };
    permalink: { href: string };
    thumbnail: { href: string };
    image: { href: string };
    artworks: { href: string };
  };
}

export interface ArtsyArtwork {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  title: string;
  category: string;
  medium: string;
  date: string;
  dimensions: {
    in: string;
    cm: string;
  };
  published: boolean;
  website: string;
  signature: string;
  series: string;
  provenance: string;
  literature: string;
  exhibition_history: string;
  collecting_institution: string;
  additional_information: string;
  image_rights: string;
  blurb: string;
  unique: boolean;
  cultural_maker: string;
  iconicity: number;
  can_inquire_about: boolean;
  can_acquire: boolean;
  can_share: boolean;
  sale_message: string | null;
  sold: boolean;
  image_versions: string[];
  images?: Array<{
    id: string;
    image_urls: {
      [key: string]: string;
    };
    original_height: number;
    original_width: number;
    is_default: boolean;
    aspect_ratio: number;
    versions: string[];
  }>;
  _links: {
    self: { href: string };
    permalink: { href: string };
    thumbnail: { href: string };
    image?: { href: string };
    partner?: { href: string };
    artists?: { href: string };
    similar_artworks?: { href: string };
  };
}

export interface ArtsySearchResult {
  total_count: number;
  _links: {
    self: { href: string };
    next: { href: string };
  };
  _embedded: {
    results: Array<{
      type: string;
      id: string;
      slug: string;
      title: string;
      _links: {
        self: { href: string };
        permalink: { href: string };
        thumbnail: { href: string };
        image: { href: string };
      };
    }>;
  };
}

export interface EnhancedArtworkData {
  slug: string;
  title: string;
  artist: string;
  year: number;
  country: string;
  period: string;
  imageUrl: string;
  relevance: string;
  trivia: string[];
  medium: string;
  materials: string;
  dimensions: {
    in: string;
    cm: string;
  };
  description: string;
  artistBio: string;
  source: string;
  sourceUrl: string;
  createdAt: string;
}
