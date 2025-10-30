import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../../App';
import { Event } from '../../types';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


export const EventsManagementPage: React.FC = () => {
    const { events, addEvent, deleteEvent } = useEvents();
    const navigate = useNavigate();
    
    const sortedEvents = [...events].sort((a,b) => b.date.getTime() - a.date.getTime());

    const handleCreateEvent = () => {
        const newEvent = addEvent();
        navigate(`/admin/events/edit/${newEvent.slug}`);
    };

    const handleDelete = (eventId: string, eventName: string) => {
        if (window.confirm(`Are you sure you want to delete the event "${eventName}"? This action cannot be undone.`)) {
            deleteEvent(eventId);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-five16-mint">Events Management</h1>
                <button 
                    onClick={handleCreateEvent}
                    className="bg-five16-teal text-five16-dark font-bold py-2 px-4 rounded-md hover:bg-five16-mint transition-colors">
                    Create New Event
                </button>
            </div>

            <div className="bg-five16-dark rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Event Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {sortedEvents.map((event: Event) => (
                            <tr key={event.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-five16-text">{event.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{event.date.toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{event.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {event.published ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-five16-teal/20 text-five16-mint">
                                            Published
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/30 text-gray-300">
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-4">
                                        <Link to={`/admin/events/edit/${event.slug}`} className="text-five16-mint hover:text-five16-teal transition-colors" title="Edit">
                                            <EditIcon />
                                        </Link>
                                        <button onClick={() => handleDelete(event.id, event.name)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};