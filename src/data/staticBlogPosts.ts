export type StaticBlogPost = {
  id: number;
  slug?: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  link: string;
  featured: boolean;
};

/** Curated external articles — shown instantly while API posts load */
export const STATIC_BLOG_POSTS: StaticBlogPost[] = [
  {
    id: 10,
    slug: 'ghana-tomato-productivity-fix',
    title: 'From 8 to 20 Tonnes: Can Ghana Finally Fix Its Tomato Crisis?',
    excerpt:
      "Explore how government-backed research from WACCI and Agrilync's finance-first innovation are unlocking massive productivity gains for smallholder farmers.",
    author: 'Agrilync Nexus Team',
    date: '2026-03-26',
    readTime: '8 min read',
    category: 'Agribusiness',
    tags: ['Policy', 'Innovation', 'Tomato Crisis', 'WACCI'],
    image: '/lovable-uploads/image copy 15.png',
    link: 'https://agri-insider-series.beehiiv.com/p/from-8-to-20-tonnes-can-ghana-finally-fix-its-tomato-crisis',
    featured: true,
  },
  {
    id: 9,
    slug: 'smart-greenhouse-tomato-crisis',
    title: 'How Smart Greenhouse Technology Can Solve Ghana’s Tomato Crisis',
    excerpt:
      "Discover how smart greenhouse technology is revolutionizing Ghana's agriculture and solving the tomato crisis by 2026. A practical guide to year-round production.",
    author: 'Agrilync Nexus Team',
    date: '2026-03-26',
    readTime: '7 min read',
    category: 'Technology',
    tags: ['Smart Greenhouse', 'Tomato Crisis', 'Ag-Tech'],
    image: '/lovable-uploads/image copy 14.png',
    link: 'https://agri-insider-series.beehiiv.com/p/how-smart-greenhouse-technology-can-solve-ghana-s-tomato-crisis',
    featured: true,
  },
  {
    id: 8,
    slug: 'mushroom-farming',
    title: "A Beginner's Guide to Mushroom Farming: From Planning to Profit",
    excerpt:
      'Learn the essentials of mushroom farming, from initial planning and setup to harvesting and selling for profit. A comprehensive guide for aspiring Ghanaian agropreneurs.',
    author: 'Agrilync Nexus Team',
    date: '2026-01-16',
    readTime: '6 min read',
    category: 'Agribusiness',
    tags: ['Mushroom Farming', 'Agropreneur', 'Guided Farming'],
    image: '/lovable-uploads/mushroom-farming.jpg',
    link: 'https://agri-insider-series.beehiiv.com/p/a-beginner-s-guide-to-mushroom-farming-from-planning-to-profit-post',
    featured: true,
  },
  {
    id: 1,
    title: 'Ghana Faces Agricultural Crisis as Maize Imports Surge',
    excerpt:
      "Ghana's agricultural sector confronts a critical challenge as projected maize imports could rise by 67 percent for the 2025/26 season, potentially reaching 300,000 tonnes and threatening the livelihoods of thousands of local farmers.",
    author: 'News Ghana',
    date: '2024-12-19',
    readTime: '4 min read',
    category: 'Agribusiness',
    tags: ['Maize Crisis', 'Food Security', 'Imports'],
    image: '/lovable-uploads/Screenshot 2025-12-19 195104.png',
    link: 'https://www.newsghana.com.gh/ghana-faces-agricultural-crisis-as-maize-imports-surge/',
    featured: true,
  },
  {
    id: 2,
    title: '5 Challenges Ghanaian Farmers Face Without Smart Tools',
    excerpt:
      'Discover how Agrilync Nexus is helping to solve agricultural challenges with AI and finance access. Learn about the key obstacles facing Ghanaian farmers and how technology is providing solutions.',
    author: 'Agrilync Nexus Team',
    date: '2024-06-25',
    readTime: '5 min read',
    category: 'Agribusiness',
    tags: ['Smart Farming', 'Technology', 'Ghana'],
    image: '/lovable-uploads/889a4eaa-0299-4896-8399-849a40f5565a.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: true,
  },
  {
    id: 3,
    title: "Ghana's Agriculture Sector: Market Size, Growth, and Key Trends",
    excerpt:
      "Explore the current state of Ghana's agricultural sector, market opportunities, and emerging trends that are shaping the future of farming in the country.",
    author: 'Market Research Team',
    date: '2024-05-26',
    readTime: '6 min read',
    category: 'Market Analysis',
    tags: ['Market Trends', 'Growth', 'Analysis'],
    image: '/lovable-uploads/3e19a1d1-e890-436d-ba69-4227c2a1c8b1.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: false,
  },
  {
    id: 4,
    title: 'The Role of AI in African Farming: A Smart Future for Agriculture',
    excerpt:
      'Discover how artificial intelligence is revolutionizing farming practices across Africa, from crop disease detection to predictive analytics and smart farming solutions.',
    author: 'AI Research Team',
    date: '2024-05-06',
    readTime: '7 min read',
    category: 'Technology',
    tags: ['AI', 'Innovation', 'Smart Farming'],
    image: '/lovable-uploads/d5bee012-8bd6-4f66-bd49-d60d2468bcb3.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: false,
  },
  {
    id: 5,
    title: 'Sustainable Farming Practices for Smallholder Farmers',
    excerpt:
      'Learn about sustainable farming techniques that can help smallholder farmers improve yields while protecting the environment and ensuring long-term profitability.',
    author: 'Sustainability Expert',
    date: '2024-04-15',
    readTime: '8 min read',
    category: 'Sustainability',
    tags: ['Sustainability', 'Best Practices', 'Smallholder'],
    image: '/lovable-uploads/3957d1e2-dc2b-4d86-a585-6dbc1d1d7c70.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: false,
  },
  {
    id: 6,
    title: 'Digital Financial Services for Agricultural Growth',
    excerpt:
      'Explore how digital financial services are transforming agricultural financing and enabling farmers to access credit, insurance, and payment solutions.',
    author: 'Fintech Team',
    date: '2024-04-02',
    readTime: '6 min read',
    category: 'Fintech',
    tags: ['Digital Finance', 'Credit', 'Insurance'],
    image: '/lovable-uploads/512cd931-d1b6-4a18-8b57-63786de9ffb8.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: false,
  },
  {
    id: 7,
    title: 'Climate-Smart Agriculture: Adapting to Changing Weather Patterns',
    excerpt:
      'Discover climate-smart agricultural practices that help farmers adapt to changing weather patterns and build resilience against climate change impacts.',
    author: 'Climate Expert',
    date: '2024-03-20',
    readTime: '9 min read',
    category: 'Climate',
    tags: ['Climate Change', 'Resilience', 'Adaptation'],
    image: '/lovable-uploads/58a418db-b2d5-4bcb-94c1-d230345ec90b.png',
    link: 'https://agriinsider.beehiiv.com/',
    featured: true,
  },
];
