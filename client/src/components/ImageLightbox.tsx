import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

/**
 * Fullscreen Interactive Image Lightbox Modal.
 * Offers high-resolution image viewing with smooth backdrop blur and navigation.
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  title,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || !images.length) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close-btn" onClick={onClose} aria-label="Close fullscreen gallery">
          <X size={24} />
        </button>

        <div className="lightbox-image-container">
          <img
            src={images[currentIndex]}
            alt={title ? `${title} photo ${currentIndex + 1}` : 'Gallery fullscreen view'}
            className="lightbox-image"
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              className="lightbox-nav-btn prev"
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="lightbox-nav-btn next"
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        <div className="lightbox-footer">
          <span className="lightbox-title">{title || 'The Kandivali Residence'}</span>
          <span className="lightbox-counter">
            <Maximize2 size={13} style={{ marginRight: 6 }} />
            {currentIndex + 1} of {images.length}
          </span>
        </div>
      </div>
    </div>
  );
};
