import { useEffect, useRef, useState } from 'react';

type ScrollRevealOptions = IntersectionObserverInit & {
  /** Re-trigger every time the element enters/leaves the viewport, instead of only once. */
  once?: boolean;
};

export function useScrollReveal(options: ScrollRevealOptions = { threshold: 0.2 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { once = true, ...observerOptions } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      observerOptions
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible] as const;
} 
