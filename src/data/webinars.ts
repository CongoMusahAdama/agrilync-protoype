export type WebinarItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  spots: number;
  registered: number;
  image: string;
  description: string;
  speaker: string;
  status: 'upcoming' | 'completed';
  recordingLink?: string;
  registrationLink?: string;
  pdfLink?: string;
};

/** Shared with Blog page — keep in sync for Resources "Completed Events" */
export const WEBINARS: WebinarItem[] = [
  {
    id: 1,
    title: 'AI for Crop Disease Detection',
    date: '2024-02-15',
    time: '14:00 GMT',
    location: 'Virtual',
    spots: 50,
    registered: 50,
    image: '/lovable-uploads/webinar.jpg',
    description:
      'Learn how to use AI-powered tools to identify and treat crop diseases early, preventing significant yield losses.',
    speaker: 'Dr. Sarah Mensah',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Modern Fish Farming Techniques',
    date: '2024-02-20',
    time: '10:00 GMT',
    location: 'Accra, Ghana',
    spots: 30,
    registered: 30,
    image: '/lovable-uploads/webinar1.jpg',
    description:
      'Discover sustainable aquaculture practices and modern fish farming technologies for better yields.',
    speaker: 'Prof. Kofi Osei',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Post-Harvest Strategy and Strategic Growth for Lync Growers',
    date: '2025-08-09',
    time: '6:00 PM - 7:30 PM',
    location: 'Virtual (Google Meet)',
    spots: 100,
    registered: 45,
    image: '/lovable-uploads/webinar4.jpg',
    description:
      'Comprehensive strategies to reduce post-harvest losses and improve strategic growth for Lync Growers in Ghana.',
    speaker: 'Mrs Erica Adjoa Appaih',
    status: 'completed',
    recordingLink:
      'https://drive.google.com/file/d/1kqJWei0rrOflXEF1DzfKnoD-s5ElcMEw/view?usp=sharing',
  },
  {
    id: 4,
    title: 'Smart Farming Investments: What Every Entrepreneur and Investor Should Know',
    date: '2025-12-14',
    time: '3:00 PM - 6:00 PM',
    location: 'Virtual',
    spots: 100,
    registered: 0,
    image: '/lovable-uploads/image copy 5.png',
    description:
      'Join us for an insightful session on smart farming investments and what every entrepreneur and investor needs to know to succeed in the agricultural sector.',
    speaker: 'eyramax',
    status: 'completed',
    registrationLink: 'https://luma.com/q7tsnwsl',
    pdfLink:
      'https://drive.google.com/file/d/1SS6YK0htLNajYWUjZDzJcpKdR8pX8xp3/view?usp=drive_link',
  },
  {
    id: 5,
    title: 'Modern Greenhouse Farming & Agriculture Strategies',
    date: '2026-03-15',
    time: '14:00 GMT',
    location: 'Virtual',
    spots: 150,
    registered: 150,
    image: '/lovable-uploads/webinargreenhouse.jpeg',
    description:
      'An exclusive deep-dive into modern greenhouse farming. Discover how controlled-environment agriculture can maximize crop yields, extend growing seasons, and protect your investments from climate volatility.',
    speaker: 'Simon Sjustice',
    status: 'completed',
    recordingLink: 'https://youtu.be/k2FJAGKz35k',
  },
  {
    id: 6,
    title: 'THE FARMER TALK: Smart Farm Planning for Farm Profitability',
    date: '2026-07-04',
    time: '7:00 PM – 8:00 PM',
    location: 'Virtual (Online)',
    spots: 200,
    registered: 0,
    image: '/lovable-uploads/farm%20B.png',
    description:
      'A knowledge session for forward-thinking agripreneurs on using budgets and farm records to improve profitability. Speaker: Cynthia Awewura Abavare (Climate Change & Environmental Conservation Specialist, Field Agent, AgriLync Nexus). Moderated by Congo Musah Adama (Founder & CEO, AgriLync Nexus).',
    speaker: 'Cynthia Awewura Abavare',
    status: 'upcoming',
    registrationLink: 'https://luma.com/8wjuzm3c',
  },
];

export const upcomingWebinars = WEBINARS.filter(w => w.status === 'upcoming');
export const completedWebinars = WEBINARS.filter(w => w.status === 'completed');
