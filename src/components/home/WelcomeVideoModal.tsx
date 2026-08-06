import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { webinarRecordings, youtubeThumbUrl } from '@/data/youtubeVideos';

const STORAGE_KEY = 'agrilync-resources-webinar-seen';

/** Latest webinar modal — show once per session on Resources page (no autoplay) */
export const WelcomeVideoModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const webinar = webinarRecordings[0];

  useEffect(() => {
    if (!webinar) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // still show once this mount
    }
    const t = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(t);
  }, [webinar]);

  const close = () => {
    setOpen(false);
    setPlaying(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!webinar) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-[2px]"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Webinar recording"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl md:max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#e53935] hover:bg-[#c62828] text-white text-sm font-semibold shadow-lg transition-colors"
              aria-label="Close video"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              Close
            </button>

            <div className="absolute top-3 right-3 z-20 max-w-[55%] sm:max-w-[60%] pointer-events-none">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7ede56] text-right drop-shadow">
                Latest webinar
              </p>
              <p className="text-white text-xs sm:text-sm font-semibold text-right line-clamp-2 drop-shadow-md">
                {webinar.title}
              </p>
            </div>

            {playing ? (
              <iframe
                src={`https://www.youtube.com/embed/${webinar.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={webinar.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full group focus:outline-none"
                aria-label={`Play ${webinar.title}`}
              >
                <img
                  src={youtubeThumbUrl(webinar.id, 'max')}
                  alt={webinar.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = youtubeThumbUrl(webinar.id, 'hq');
                  }}
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#7ede56] text-[#002f37] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 md:w-8 md:h-8 fill-current ml-1" />
                  </span>
                </div>
                <p className="absolute bottom-4 left-0 right-0 text-center text-white/90 text-sm font-semibold drop-shadow">
                  Tap play to watch
                </p>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
