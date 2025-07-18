import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = { threshold: 0.2 }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      options
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible] as const;
} 