import React from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from '../../components/EventCard';
import { useEvents } from '../../contexts/EventsContext';

export const HomePage: React.FC = () => {
  const { events } = useEvents();

  const upcomingEvents = events
    .filter(e => e.published && e.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);
    
  const recentGalleries = events
    .filter(e => e.published && e.photos.length > 0 && e.date <= new Date())
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/hero/1920/1080)` }}>
        <div className="absolute inset-0 bg-five16-bg/70"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-widest text-five16-text">
            Five16 Events
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-five16-mint">
            Curating Unforgettable Experiences
          </p>
          <Link
            to="/events"
            className="mt-8 inline-block bg-five16-teal text-five16-dark font-bold py-3 px-8 rounded-md hover:bg-five16-mint transition-transform transform hover:scale-105"
          >
            Explore Our Events
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-five16-mint">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No upcoming events scheduled. Check back soon!</p>
          )}
        </div>
      </section>
      
      {/* Recent Galleries */}
      <section className="py-16 bg-five16-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-five16-mint">Recent Galleries</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recentGalleries.map(event => (
              <Link key={event.id} to={`/events/${event.slug}`} className="block group relative aspect-square overflow-hidden rounded-lg">
                <img src={event.backgroundImageUrl} alt={event.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-black/50 flex items-end p-4 transition-opacity group-hover:opacity-100 opacity-0">
                   <h3 className="text-lg font-bold text-white">{event.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
