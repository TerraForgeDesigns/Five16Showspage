import React, { useState, createContext, useContext } from 'react';
import { Event, Photo } from '../types';
import { MOCK_EVENTS } from '../data/mockData';
import { useToasts } from './ToastContext';

interface EventsContextType {
  events: Event[];
  addEvent: () => Event;
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => void;
  addPhotosToEvent: (eventId: string, newPhotos: Photo[]) => void;
  getEventBySlug: (slug: string) => Event | undefined;
}

const EventsContext = createContext<EventsContextType>(null!);

export const useEvents = () => useContext(EventsContext);

export const EventsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const { addToast } = useToasts();

    const addEvent = () => {
        const slug = `untitled-event-${Date.now()}`;
        const newEvent: Event = {
            id: `${Date.now()}`,
            name: 'Untitled Event',
            slug: slug,
            date: new Date(),
            location: 'TBD',
            photos: [],
            published: false,
            writeup: '',
            backgroundImageUrl: '',
            backgroundImageAlt: '',
        };
        setEvents(prev => [newEvent, ...prev]);
        addToast('New event draft created!', 'success');
        return newEvent;
    };
    
    const updateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        addToast('Event saved successfully!', 'success');
    };

    const deleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        addToast('Event deleted.', 'success');
    };
    
    const addPhotosToEvent = (eventId: string, newPhotos: Photo[]) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                // Prepend new photos so they appear first in the gallery
                return { ...event, photos: [...newPhotos, ...event.photos] };
            }
            return event;
        }));
    };

    const getEventBySlug = (slug: string) => {
        return events.find(e => e.slug === slug);
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventBySlug, addPhotosToEvent }}>
            {children}
        </EventsContext.Provider>
    );
};
