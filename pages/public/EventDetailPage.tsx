
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_EVENTS } from '../../data/mockData';
import { Event } from '../../types';
import { Gallery } from '../../components/Gallery';
import { generateEventWriteup } from '../../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-five16-teal"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-five16-teal delay-150"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-five16-teal delay-300"></div>
    </div>
);

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | undefined | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const foundEvent = MOCK_EVENTS.find(e => e.slug === slug);
    setEvent(foundEvent);
  }, [slug]);

  const handleGenerateWriteup = async () => {
    if (!event) return;
    setIsGenerating(true);
    const newWriteup = await generateEventWriteup(event.name, event.location);
    // In a real app, you'd update this in the backend. Here we just update local state.
    setEvent(prev => prev ? { ...prev, writeup: newWriteup } : undefined);
    setIsGenerating(false);
  };

  if (event === null) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (event === undefined) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div>
      {/* Hero Image */}
      <div className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${event.heroImage})` }}>
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl font-extrabold text-white">{event.name}</h1>
          <p className="mt-4 text-xl text-five16-mint">
            {event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; {event.location}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Writeup Section */}
        <div className="max-w-3xl mx-auto mb-12">
           <div className="prose prose-invert lg:prose-xl text-five16-text prose-headings:text-five16-mint mx-auto" dangerouslySetInnerHTML={{ __html: event.writeup || '' }} />
            {(!event.writeup || event.writeup.includes("Error")) && (
              <div className="text-center mt-6">
                <button 
                  onClick={handleGenerateWriteup} 
                  disabled={isGenerating}
                  className="bg-five16-teal text-five16-dark font-bold py-2 px-6 rounded-md hover:bg-five16-mint transition-colors disabled:bg-gray-600 flex items-center justify-center mx-auto"
                >
                  {isGenerating ? <LoadingSpinner/> : 'Generate Writeup with AI'}
                </button>
                <p className="text-xs text-gray-400 mt-2">Powered by Gemini</p>
              </div>
            )}
        </div>

        {/* Gallery Section */}
        {event.photos.length > 0 ? (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-five16-mint">Event Gallery</h2>
            <Gallery photos={event.photos} />
          </div>
        ) : (
          <p className="text-center text-gray-400">Photo gallery coming soon.</p>
        )}
      </div>
    </div>
  );
};
