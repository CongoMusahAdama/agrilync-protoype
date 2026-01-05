import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    decimals?: number;
}

const CountUp: React.FC<CountUpProps> = ({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = '',
    decimals = 0
}) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const targetValue = isNaN(end) ? 0 : end;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let startTime: number | null = null;
                    const startValue = 0;

                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);

                        // Easing function for smooth animation (easeOutExpo)
                        const easeOutExpo = (x: number): number => {
                            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
                        };

                        const currentCount = easeOutExpo(progress) * (targetValue - startValue) + startValue;
                        setCount(currentCount);

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };

                    window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [end, duration]);

    return (
        <span ref={elementRef} className={className}>
            {prefix}{count.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}{suffix}
        </span>
    );
};

export default CountUp;
