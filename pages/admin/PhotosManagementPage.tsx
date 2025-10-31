import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '../../App';
import { Photo, PhotoStatus } from '../../types';

// Helper to get status color
const getStatusClasses = (status: PhotoStatus) => {
    switch (status) {
        case PhotoStatus.READY:
            return 'bg-five16-teal/20 text-five16-mint';
        case PhotoStatus.PENDING:
            return 'bg-yellow-500/20 text-yellow-300';
        case PhotoStatus.HELD:
            return 'bg-orange-500/20 text-orange-300';
        case PhotoStatus.FAILED:
            return 'bg-red-500/20 text-red-300';
        default:
            return 'bg-gray-500/30 text-gray-300';
    }
};

const PhotoCard: React.FC<{ photo: Photo }> = ({ photo }) => (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden group">
        <div className="relative aspect-w-4 aspect-h-3">
            <img src={photo.thumbUrl} alt="Event thumbnail" className="object-cover w-full h-full" />
            <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(photo.status)}`}>
                    {photo.status}
                </span>
            </div>
        </div>
        <div className="p-3">
            <div className="flex justify-center space-x-2">
                <button className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded transition-colors">Approve</button>
                <button className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 px-3 rounded transition-colors">Hold</button>
                <button className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition-colors">Delete</button>
            </div>
        </div>
    </div>
);


export const PhotosManagementPage: React.FC = () => {
    const { events } = useEvents();
    const [selectedEventId, setSelectedEventId] = useState<string>('');

    useEffect(() => {
        // Set the default selected event to the first one if available
        if (events.length > 0 && !selectedEventId) {
            setSelectedEventId(events[0].id);
        }
    }, [events, selectedEventId]);

    const displayedPhotos = useMemo(() => {
        if (!selectedEventId) return [];
        const selectedEvent = events.find(e => e.id === selectedEventId);
        return selectedEvent ? selectedEvent.photos : [];
    }, [selectedEventId, events]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-five16-mint">Photos Management</h1>
                {events.length > 0 ? (
                    <div className="flex items-center space-x-2">
                         <label htmlFor="event-filter" className="text-sm font-medium text-gray-300">Filter by event:</label>
                         <select
                            id="event-filter"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-five16-teal focus:border-five16-teal transition"
                         >
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.name}</option>
                            ))}
                         </select>
                    </div>
                ) : null}
            </div>
            
            {events.length > 0 ? (
                displayedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {displayedPhotos.map(photo => (
                            <PhotoCard key={photo.id} photo={photo} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-five16-dark rounded-lg p-8 text-center">
                        <p className="text-gray-400">No photos found for this event.</p>
                    </div>
                )
            ) : (
                <div className="bg-five16-dark rounded-lg p-8 text-center">
                    <p className="text-gray-400">There are no events. Create an event to start uploading photos.</p>
                </div>
            )}
        </div>
    );
};
