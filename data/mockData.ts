import { Event, Photo, PhotoStatus } from '../types';

const generatePhotos = (eventId: string, count: number, tags: string[]): Photo[] => {
  const statuses = [PhotoStatus.READY, PhotoStatus.PENDING, PhotoStatus.HELD, PhotoStatus.FAILED];
  return Array.from({ length: count }, (_, i) => ({
    id: `${eventId}-photo-${i + 1}`,
    eventId,
    objectKey: `events/${eventId}/photo-${i + 1}.jpg`,
    url: `https://picsum.photos/seed/${eventId}${i+1}/1200/800`,
    thumbUrl: `https://picsum.photos/seed/${eventId}${i+1}/400/300`,
    status: statuses[i % statuses.length], // Cycle through statuses for variety
    tags: tags,
    createdAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)),
  }));
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Tech Summit 2024',
    slug: 'tech-summit-2024',
    date: new Date('2024-10-26T09:00:00Z'),
    location: 'Metropolis Convention Center',
    heroImage: 'https://picsum.photos/seed/techsummit2024/1920/1080',
    writeup: '<h3>A Glimpse into Tomorrow</h3><p>Tech Summit 2024 brought together the brightest minds in technology for a day of innovation, networking, and groundbreaking announcements. From AI to quantum computing, the future was on full display.</p>',
    photos: generatePhotos('1', 12, ['tech', 'conference']),
    published: true,
  },
  {
    id: '2',
    name: 'Annual Charity Gala',
    slug: 'annual-charity-gala-2024',
    date: new Date('2024-11-15T18:00:00Z'),
    location: 'Grand Ballroom, Plaza Hotel',
    heroImage: 'https://picsum.photos/seed/charitygala2024/1920/1080',
    writeup: '<h3>An Evening of Elegance and Giving</h3><p>Our Annual Charity Gala was a resounding success, raising funds for local communities. Guests enjoyed a night of fine dining, live music, and heartfelt speeches, all for a great cause.</p>',
    photos: generatePhotos('2', 18, ['gala', 'charity', 'formal']),
    published: true,
  },
  {
    id: '3',
    name: 'Summer Music Festival',
    slug: 'summer-music-festival-2024',
    date: new Date('2024-08-05T14:00:00Z'),
    location: 'Greenfield Park',
    heroImage: 'https://picsum.photos/seed/summerfest2024/1920/1080',
    writeup: '<h3>Vibes and Melodies Under the Sun</h3><p>The Summer Music Festival was an unforgettable weekend of music, art, and community. Thousands gathered to see their favorite artists perform across three stages in the beautiful Greenfield Park.</p>',
    photos: generatePhotos('3', 24, ['music', 'festival', 'outdoor']),
    published: true,
  },
  {
    id: '4',
    name: 'Corporate Retreat 2025',
    slug: 'corporate-retreat-2025',
    date: new Date('2025-01-20T10:00:00Z'),
    location: 'Lakeside Mountain Resort',
    heroImage: 'https://picsum.photos/seed/retreat2025/1920/1080',
    writeup: '',
    photos: generatePhotos('4', 8, ['corporate', 'retreat', 'team']),
    published: false,
  },
];
