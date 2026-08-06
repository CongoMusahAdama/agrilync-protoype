import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { whatsappMeUrl } from '@/lib/communityLinks';
import { useLanguage } from '@/contexts/LanguageContext';

const HERO_VIDEO_ID = '1eC94T9N6Nw';
const START_AT = 34; // 0:34
const PAUSE_AT = 120; // 2:00

declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: Record<string, unknown>) => YTPlayer;
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
};

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else if (window.YT?.Player) {
      resolve();
    }
  });

  return ytApiPromise;
}

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    // Desktop-only video — skip YouTube API on small screens
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    let cancelled = false;

    const clearPoll = () => {
      if (pollRef.current != null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const startPauseWatcher = (player: YTPlayer) => {
      clearPoll();
      pollRef.current = window.setInterval(() => {
        try {
          const time = player.getCurrentTime();
          if (time >= PAUSE_AT) {
            player.pauseVideo();
            player.seekTo(PAUSE_AT, true);
            clearPoll();
          }
        } catch {
          // player may be mid-destroy
        }
      }, 250);
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player('hero-yt-player', {
        videoId: HERO_VIDEO_ID,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          start: START_AT,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            event.target.seekTo(START_AT, true);
            event.target.playVideo();
            startPauseWatcher(event.target);
          },
          onStateChange: (event: { data: number; target: YTPlayer }) => {
            if (event.data === window.YT?.PlayerState.PLAYING) {
              startPauseWatcher(event.target);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearPoll();
      try {
        playerRef.current?.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    };
  }, []);

  return (
    <section className="relative min-h-[75svh] md:h-[80vh] md:min-h-[600px] overflow-hidden bg-black flex flex-col md:flex-row md:items-start md:justify-start pt-28 md:pt-48 pb-12 md:pb-0">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Mobile: original hero image */}
        <img
          src="/lovable-uploads/image%20copy%2012.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-[85%_top] sm:object-right-top md:hidden opacity-60"
        />

        {/* Desktop: YouTube background video */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.77777778vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full">
            <div id="hero-yt-player" className="w-full h-full" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 md:from-black/55 md:via-black/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10 md:hidden" />
      </div>

      <div className="relative z-20 w-full px-4 sm:px-12 lg:px-24 xl:px-32 mt-auto md:mt-0 pb-6 md:pb-0">
        <div className="max-w-3xl text-left pr-12 sm:pr-0">
          <h1 className="text-[22px] leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 md:mb-10 md:leading-[1.15] font-montserrat tracking-tight animate-fade-in-up drop-shadow-lg max-w-full text-balance">
            {t('hero.headlineBefore')}{' '}
            <span className="text-[#7ede56]">{t('hero.headlineHighlight')}</span>{' '}
            <span className="text-[#7ede56]">{t('hero.headlineInvestable')}</span>.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-8 md:mb-12 leading-relaxed max-w-xl font-sans animate-fade-in-up delay-200">
            <span className="text-[#7ede56] font-bold tracking-[0.15em]">{t('hero.connect')}</span>{' '}
            <span className="text-[#FFD700] font-bold tracking-[0.15em]">{t('hero.improve')}</span>{' '}
            <span className="text-white/70 font-bold tracking-[0.15em]">{t('hero.and')}</span>{' '}
            <span className="text-white font-bold tracking-[0.15em]">{t('hero.grow')}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-start justify-start gap-3 md:gap-6 animate-fade-in-up delay-400">
            <a
              href={whatsappMeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-full sm:w-auto"
            >
              <Button className="bg-[#7ede56] hover:bg-[#6cd147] text-[#002f37] px-6 py-4 md:px-10 md:py-7 text-sm md:text-lg font-bold font-montserrat rounded-full shadow-[0_15px_30px_-10px_rgba(126,222,86,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                {t('hero.getInTouch')}
              </Button>
            </a>

            <Link to="/signup" className="shrink-0">
              <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white hover:text-[#002f37] bg-white/5 backdrop-blur-md px-6 py-4 md:px-10 md:py-7 text-sm md:text-lg font-bold font-montserrat rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95">
                {t('hero.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
