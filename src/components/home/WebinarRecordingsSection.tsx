import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Youtube, ExternalLink } from 'lucide-react';
import {
  YOUTUBE_VIDEOS,
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_CHANNEL_HANDLE,
  youtubeWatchUrl,
  youtubeThumbUrl,
} from '@/data/youtubeVideos';

export const WebinarRecordingsSection: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <section
      id="webinar-recordings"
      className="py-20 md:py-28 bg-[#0a0a0a] text-white"
      aria-labelledby="webinar-recordings-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Centered portfolio-style heading */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#7ede56] text-xs font-bold uppercase tracking-[0.3em] mb-3">
            Our Webinars
          </p>
          <h2
            id="webinar-recordings-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat tracking-tight"
          >
            Latest Work
          </h2>
          <p className="mt-4 text-white/50 text-sm md:text-base max-w-lg mx-auto font-montserrat">
            Farmer Talk recordings and channel videos from{' '}
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#7ede56] transition-colors font-semibold"
            >
              {YOUTUBE_CHANNEL_HANDLE}
            </a>
          </p>
        </div>

        {/* Equal video grid */}
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 list-none m-0 p-0"
        >
          {YOUTUBE_VIDEOS.map((video) => (
            <motion.li
              key={video.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <button
                type="button"
                onClick={() => setActiveVideoId(video.id)}
                className="group relative w-full aspect-[16/10] overflow-hidden bg-[#111] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ede56]"
              >
                <img
                  src={youtubeThumbUrl(video.id, 'max')}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = youtubeThumbUrl(video.id, 'hq');
                  }}
                />
                {/* Soft dark wash */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />

                {/* Center play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/70 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#7ede56] group-hover:border-[#7ede56] group-hover:text-[#002f37] group-hover:scale-110">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
                  </span>
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16">
                  {video.isWebinar && (
                    <span className="inline-block text-[#7ede56] text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5">
                      Webinar
                    </span>
                  )}
                  <h3 className="text-white text-base md:text-lg font-bold font-montserrat leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-white/60 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </button>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10 md:mt-12 flex justify-center">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#7ede56] hover:text-[#002f37] hover:border-[#7ede56] transition-colors"
          >
            <Youtube className="w-5 h-5" />
            View channel
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveVideoId(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideoId(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="AgriLync Nexus video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <a
                href={youtubeWatchUrl(activeVideoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
              >
                Open on YouTube
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
