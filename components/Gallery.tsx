
import React, { useState, useCallback, useEffect } from 'react';
import { Photo } from '../types';

interface GalleryProps {
  photos: Photo[];
}

const Lightbox: React.FC<{
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ photos, currentIndex, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 p-4">‹</button>
      <div className="relative max-w-screen-lg max-h-screen-lg w-full h-full flex items-center justify-center p-8" onClick={e => e.stopPropagation()}>
        <img src={photos[currentIndex].url} alt={`Gallery view ${currentIndex + 1}`} className="max-h-full max-w-full object-contain" />
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl z-10 p-4">›</button>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl z-10 p-2">&times;</button>
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  const showPrev = useCallback(() => {
     if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + photos.length) % photos.length);
    }
  }, [lightboxIndex, photos.length]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="aspect-w-4 aspect-h-3 cursor-pointer group overflow-hidden rounded-lg" onClick={() => openLightbox(index)}>
            <img src={photo.thumbUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  );
};
