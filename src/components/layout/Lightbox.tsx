import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CarouselLightboxProps {
  images: { url: string; id?: string }[];
  startIndex: number;
  onClose: () => void;
}

export default function CarouselLightbox({ images, startIndex, onClose }: CarouselLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goNext, goPrev]);

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-white/10 border border-white/20 hover:bg-white/30 p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/25 border border-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Image */}
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          src={images[currentIndex].url}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-default"
          draggable={false}
        />

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 text-white bg-white/10 hover:bg-white/25 border border-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
