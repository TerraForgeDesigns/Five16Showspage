import React, { useState, useCallback, useEffect } from 'react';
import { Photo } from '../types';

export const Gallery: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedPhotoIndex(index);
  const closeModal = () => setSelectedPhotoIndex(null);

  const showNext = useCallback(() => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev! + 1) % photos.length);
    }
  }, [selectedPhotoIndex, photos.length]);

  const showPrev = useCallback(() => {
     if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev! - 1 + photos.length) % photos.length);
    }
  }, [selectedPhotoIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, showPrev, showNext]);


  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="relative group aspect-w-4 aspect-h-3 cursor-pointer overflow-hidden rounded-xl" 
            onClick={() => openModal(index)}
          >
            <img 
              src={photo.thumbUrl} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none rounded-xl"></div>
          </div>
        ))}
      </div>

      {selectedPhotoIndex !== null && (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center" 
            onClick={closeModal} 
            role="dialog" 
            aria-modal="true"
        >
            <button onClick={(e) => { e.stopPropagation(); showPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-[51] p-4">‹</button>
            
            <div className="relative" onClick={e => e.stopPropagation()}>
                <img 
                    src={photos[selectedPhotoIndex].url} 
                    alt={`Gallery view ${selectedPhotoIndex + 1}`} 
                    className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" 
                />
            </div>

            <button onClick={(e) => { e.stopPropagation(); showNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-[51] p-4">›</button>

            <button onClick={closeModal} className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl z-[51] p-2">&times;</button>
        </div>
      )}
    </>
  );
};
