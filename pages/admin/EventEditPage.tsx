import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEvents } from '../../App';
import { Event } from '../../types';
import { BackgroundImageField } from '../../components/admin/BackgroundImageField';

// Simple slugify function
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-five16-mint mb-2">{label}</label>
    <input
      id={id}
      {...props}
      className="w-full bg-gray-900/50 border-gray-700 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
    />
  </div>
);

export const EventEditPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { getEventBySlug, updateEvent, events } = useEvents();
    
    const [event, setEvent] = useState<Event | null | undefined>(null);
    const [slugError, setSlugError] = useState('');

    useEffect(() => {
        if (slug) {
            setEvent(getEventBySlug(slug));
        }
    }, [slug, getEventBySlug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (event) {
            let newSlug = event.slug;
            if (name === 'name') {
               newSlug = slugify(value);
            }
            setEvent({
                ...event,
                [name]: type === 'checkbox' ? checked : value,
                slug: name === 'name' ? newSlug : event.slug, // Auto-update slug from name
            });
        }
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(event) {
            // HTML date input gives YYYY-MM-DD. Need to preserve time zone info if any.
            const newDate = new Date(e.target.value);
            const timezoneOffset = event.date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(newDate.getTime() + timezoneOffset);
            setEvent({ ...event, date: adjustedDate });
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (event) {
            const newSlug = slugify(e.target.value);
            setEvent({ ...event, slug: newSlug });
            // Check for slug uniqueness
            if(events.some(e => e.slug === newSlug && e.id !== event.id)) {
                setSlugError('This slug is already in use. Please choose another.');
            } else {
                setSlugError('');
            }
         }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (event && !slugError) {
            updateEvent(event);
            navigate('/admin/events');
        }
    };

    if (event === undefined) {
        return <Navigate to="/admin/events" replace />;
    }
    if (event === null) {
        return <div>Loading event...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-five16-mint mb-6">
                {event.id.startsWith('untitled-event') ? 'Create New Event' : 'Edit Event'}
            </h1>
            <form onSubmit={handleSubmit} className="bg-five16-dark p-8 rounded-lg space-y-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-five16-mint border-b border-gray-700 pb-2">Event Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField id="name" name="name" label="Event Name" value={event.name} onChange={handleInputChange} required />
                        <div>
                            <InputField id="slug" name="slug" label="URL Slug" value={event.slug} onChange={handleSlugChange} required />
                            {slugError && <p className="text-red-400 text-sm mt-1">{slugError}</p>}
                        </div>
                        <InputField id="date" name="date" label="Event Date" type="date" value={event.date.toISOString().split('T')[0]} onChange={handleDateChange} required />
                        <InputField id="location" name="location" label="Location" value={event.location} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-five16-mint border-b border-gray-700 pb-2">Content & Media</h2>
                     <BackgroundImageField
                        value={event.backgroundImageUrl}
                        alt={event.backgroundImageAlt}
                        onChange={(url) => setEvent(e => e ? { ...e, backgroundImageUrl: url || "" } : null)}
                        onAltChange={(alt) => setEvent(e => e ? { ...e, backgroundImageAlt: alt } : null)}
                     />

                    <div>
                      <label htmlFor="writeup" className="block text-sm font-medium text-five16-mint mb-2">
                        Event Writeup (HTML is supported)
                      </label>
                      <textarea
                        id="writeup"
                        name="writeup"
                        rows={8}
                        value={event.writeup || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900/50 border-gray-700 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
                        placeholder="Add a captivating description for the event..."
                      />
                    </div>
                </div>

                <div className="space-y-6">
                     <h2 className="text-xl font-semibold text-five16-mint border-b border-gray-700 pb-2">Publishing</h2>
                    <div className="flex items-center">
                        <input
                            id="published"
                            name="published"
                            type="checkbox"
                            checked={event.published}
                            onChange={handleInputChange}
                            className="h-4 w-4 rounded border-gray-300 text-five16-teal focus:ring-five16-teal"
                        />
                        <label htmlFor="published" className="ml-2 block text-sm text-five16-text">
                            Published
                        </label>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                    <button type="button" onClick={() => navigate('/admin/events')} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={!!slugError} className="bg-five16-teal text-five16-dark font-bold py-2 px-6 rounded-md hover:bg-five16-mint transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Save Event
                    </button>
                </div>
            </form>
        </div>
    );
};