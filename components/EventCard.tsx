
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-five16-mint"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const LocationIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-five16-mint"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = event.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/events/${event.slug}`} className="block group bg-gray-800/20 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-five16-teal">
      <div className="relative h-48">
        <img
          src={event.backgroundImageUrl}
          alt={event.backgroundImageAlt || event.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-five16-text group-hover:text-five16-mint transition-colors">{event.name}</h3>
        <div className="mt-4 space-y-2 text-gray-300">
           <p className="flex items-center"><CalendarIcon /> {formattedDate}</p>
           <p className="flex items-center"><LocationIcon /> {event.location}</p>
        </div>
      </div>
    </Link>
  );
};