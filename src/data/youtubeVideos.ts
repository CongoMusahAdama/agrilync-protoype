export type YoutubeVideo = {
  id: string;
  title: string;
  published: string;
  description: string;
  isWebinar: boolean;
};

export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@agriLync';
export const YOUTUBE_CHANNEL_HANDLE = '@agriLync';
export const YOUTUBE_CHANNEL_NAME = 'AgriLync Nexus';

/** Webinar recordings & channel videos from youtube.com/@agriLync */
export const YOUTUBE_VIDEOS: YoutubeVideo[] = [
  {
    id: 'JrgdvbOy86k',
    title: 'AI and the Future of Agriculture: From Prediction to Action',
    published: '2026-08-03',
    description: 'Farmer Talk Series — practical AI for smallholder agriculture beyond the hype.',
    isWebinar: true,
  },
  {
    id: 'nU737QbfctQ',
    title: 'Smart Farm Planning: Budgets & Records for Farm Profitability',
    published: '2026-07-06',
    description: 'Farmer Talk Series — how budgets and records improve farm profitability.',
    isWebinar: true,
  },
  {
    id: 'k2FJAGKz35k',
    title: 'Smart Greenhouse Farming Webinar',
    published: '2026-03-16',
    description: 'Modern greenhouse farming technology for higher yields and climate resilience.',
    isWebinar: true,
  },
  {
    id: '2xkcBVdsob0',
    title: 'AgriNexus in Action',
    published: '2026-02-26',
    description: 'See AgriLync Nexus in action across farms and communities.',
    isWebinar: false,
  },
  {
    id: 'HxPYnwCG6QE',
    title: 'Welcome to AgriLync',
    published: '2026-02-04',
    description: 'An introduction to AgriLync Nexus and our mission.',
    isWebinar: false,
  },
];

export const webinarRecordings = YOUTUBE_VIDEOS.filter((v) => v.isWebinar);

export const youtubeWatchUrl = (id: string) =>
  `https://www.youtube.com/watch?v=${id}`;

export const youtubeThumbUrl = (id: string, quality: 'hq' | 'max' = 'hq') =>
  quality === 'max'
    ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
