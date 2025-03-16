import { Period, Artwork } from '@/types/api';

// The backend is running on port 3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock data for fallback when API is not available
const mockPeriods: Period[] = [
  {
    slug: 'renaissance',
    name: 'Renaissance',
    cardImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    headerImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    introduction: 'The Renaissance was a period of European cultural, artistic, political, and scientific "rebirth" after the Middle Ages.',
    timelineData: [
      { year: 1400, event: 'Early Renaissance begins in Florence' },
      { year: 1495, event: 'Leonardo da Vinci paints The Last Supper' },
      { year: 1508, event: 'Michelangelo begins painting the Sistine Chapel ceiling' },
      { year: 1600, event: 'Late Renaissance period ends' }
    ],
    definingFeatures: [
      {
        title: 'Perspective',
        description: 'Renaissance artists developed linear perspective, creating the illusion of three-dimensional space.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Humanism',
        description: 'A focus on human potential and achievements, rather than religious themes alone.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ],
    revolutionaryArtists: [
      {
        name: 'Leonardo da Vinci',
        bio: 'Italian polymath whose areas of interest included invention, painting, sculpting, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, writing, history, and cartography.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        notableWorks: ['Mona Lisa', 'The Last Supper', 'Vitruvian Man']
      },
      {
        name: 'Michelangelo',
        bio: 'Italian sculptor, painter, architect and poet who exerted an unparalleled influence on the development of Western art.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        notableWorks: ['David', 'Sistine Chapel ceiling', 'Pietà']
      }
    ],
    didYouKnow: [
      'The term "Renaissance" was first used by French historian Jules Michelet in 1855.',
      'The printing press was invented during the Renaissance, which helped spread ideas quickly.',
      'Many Renaissance artists dissected human bodies to better understand anatomy.'
    ],
    createdAt: new Date().toISOString()
  },
  {
    slug: 'baroque',
    name: 'Baroque',
    cardImageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    headerImageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    introduction: 'The Baroque style used exaggerated motion and clear, easily interpreted detail to produce drama, tension, exuberance, and grandeur.',
    timelineData: [
      { year: 1600, event: 'Early Baroque period begins' },
      { year: 1625, event: 'Baroque style becomes dominant in Italy' },
      { year: 1700, event: 'Late Baroque period' },
      { year: 1750, event: 'End of the Baroque era' }
    ],
    definingFeatures: [
      {
        title: 'Dramatic Light',
        description: 'Baroque artists used strong contrasts between light and dark to create dramatic effects.',
        imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Movement and Energy',
        description: 'Baroque art is characterized by a sense of movement, energy, and tension.',
        imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ],
    revolutionaryArtists: [
      {
        name: 'Caravaggio',
        bio: 'Italian painter known for his realistic observation of the human state, both physical and emotional, with a dramatic use of lighting.',
        imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        notableWorks: ['The Calling of St Matthew', 'Judith Beheading Holofernes', 'Bacchus']
      },
      {
        name: 'Rembrandt',
        bio: 'Dutch draughtsman, painter, and printmaker. An innovative and prolific master in three media, he is generally considered one of the greatest visual artists in the history of art.',
        imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        notableWorks: ['The Night Watch', 'The Anatomy Lesson of Dr. Nicolaes Tulp', 'Self-portraits']
      }
    ],
    didYouKnow: [
      'The word "baroque" comes from the Portuguese word "barroco," meaning "irregularly shaped pearl."',
      'The Catholic Church encouraged the Baroque style as a response to the Protestant Reformation.',
      'Baroque architecture often features domes, which were symbols of the heavens.'
    ],
    createdAt: new Date().toISOString()
  }
];

const mockArtworks: Record<string, Artwork[]> = {
  renaissance: [
    {
      slug: 'mona-lisa',
      title: 'Mona Lisa',
      artist: 'Leonardo da Vinci',
      year: 1503,
      country: 'Italy',
      period: 'renaissance',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      relevance: 'The Mona Lisa is one of the most famous paintings in the world, known for its subject\'s enigmatic smile and Leonardo\'s innovative techniques.',
      trivia: [
        'The Mona Lisa is believed to be a portrait of Lisa Gherardini, the wife of Francesco del Giocondo.',
        'Leonardo used a technique called sfumato, which involves blending colors without distinct lines.',
        'The painting is housed in the Louvre Museum in Paris.'
      ],
      createdAt: new Date().toISOString()
    },
    {
      slug: 'the-last-supper',
      title: 'The Last Supper',
      artist: 'Leonardo da Vinci',
      year: 1498,
      country: 'Italy',
      period: 'renaissance',
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      relevance: 'The Last Supper depicts the reaction of Jesus\' disciples when he announces that one of them will betray him. It is one of the most studied and reproduced religious paintings.',
      trivia: [
        'The painting is located in the refectory of the Convent of Santa Maria delle Grazie in Milan, Italy.',
        'Leonardo experimented with new techniques that unfortunately led to the painting\'s quick deterioration.',
        'The painting has undergone numerous restorations over the centuries.'
      ],
      createdAt: new Date().toISOString()
    }
  ],
  baroque: [
    {
      slug: 'the-night-watch',
      title: 'The Night Watch',
      artist: 'Rembrandt',
      year: 1642,
      country: 'Netherlands',
      period: 'baroque',
      imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      relevance: 'The Night Watch is Rembrandt\'s most famous painting, known for its dramatic use of light and shadow and its complex composition.',
      trivia: [
        'The painting\'s official title is "Militia Company of District II under the Command of Captain Frans Banninck Cocq."',
        'It was cut down on all four sides when it was moved to Amsterdam Town Hall in 1715.',
        'The painting features a group portrait of a militia company, which was a common type of commission in the Dutch Golden Age.'
      ],
      createdAt: new Date().toISOString()
    },
    {
      slug: 'the-calling-of-st-matthew',
      title: 'The Calling of St Matthew',
      artist: 'Caravaggio',
      year: 1600,
      country: 'Italy',
      period: 'baroque',
      imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      relevance: 'The Calling of St Matthew is one of Caravaggio\'s most famous works, known for its dramatic use of light and shadow (chiaroscuro) and its realistic depiction of the biblical scene.',
      trivia: [
        'The painting is located in the Contarelli Chapel in the church of San Luigi dei Francesi in Rome.',
        'There is debate about which figure in the painting is actually Matthew.',
        'Caravaggio\'s use of light in this painting influenced generations of artists.'
      ],
      createdAt: new Date().toISOString()
    }
  ]
};

/**
 * Fetches all art periods from the API
 */
export async function getAllPeriods(): Promise<Period[]> {
  try {
    const response = await fetch(`${API_URL}/periods`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch periods from API: ${response.status}. Using mock data instead.`);
      return mockPeriods;
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching periods:', error);
    console.warn('Using mock data instead.');
    return mockPeriods;
  }
}

/**
 * Fetches a specific art period by slug
 */
export async function getPeriodBySlug(slug: string): Promise<Period | null> {
  try {
    const response = await fetch(`${API_URL}/periods/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Period '${slug}' not found in API. Checking mock data.`);
        const mockPeriod = mockPeriods.find(p => p.slug === slug);
        return mockPeriod || null;
      }
      throw new Error(`Failed to fetch period: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching period ${slug}:`, error);
    console.warn('Checking mock data instead.');
    const mockPeriod = mockPeriods.find(p => p.slug === slug);
    return mockPeriod || null;
  }
}

/**
 * Fetches artworks for a specific period
 */
export async function getArtworksByPeriod(periodSlug: string): Promise<Artwork[]> {
  try {
    const response = await fetch(`${API_URL}/artworks/period/${periodSlug}`);
    
    if (!response.ok) {
      console.warn(`Failed to fetch artworks for period '${periodSlug}' from API: ${response.status}. Using mock data instead.`);
      return mockArtworks[periodSlug] || [];
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`Error fetching artworks for period ${periodSlug}:`, error);
    console.warn('Using mock data instead.');
    return mockArtworks[periodSlug] || [];
  }
} 