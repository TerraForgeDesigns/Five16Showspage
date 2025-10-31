import React from 'react';
import { EventCard } from '../../components/EventCard';
import { useEvents } from '../../contexts/EventsContext';

export const EventsPage: React.FC = () => {
  const { events } = useEvents();
  const publishedEvents = events.filter(e => e.published).sort((a,b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-five16-mint">Our Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
