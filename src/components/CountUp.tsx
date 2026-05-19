import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    decimals?: number;
    loop?: boolean;
    loopDelay?: number; // ms to hold the final value before restarting
}

const CountUp: React.FC<CountUpProps> = ({
    end,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = '',
    decimals = 0,
    loop = false,
    loopDelay = 1800,
}) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasStarted = useRef(false);
    const rafRef = useRef<number | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const runAnimation = () => {
        setCount(0);
        let startTime: number | null = null;
        const targetValue = isNaN(end) ? 0 : end;

        const easeOutExpo = (x: number): number =>
            x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(easeOutExpo(progress) * targetValue);

            if (progress < 1) {
                rafRef.current = window.requestAnimationFrame(step);
            } else {
                setCount(targetValue);
                if (loop) {
                    timeoutRef.current = setTimeout(runAnimation, loopDelay);
                }
            }
        };

        rafRef.current = window.requestAnimationFrame(step);
    };

    useEffect(() => {
        const targetValue = isNaN(end) ? 0 : end;

        if (!loop) {
            // Original scroll-triggered, one-shot behaviour
            const observer = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (entry.isIntersecting && !hasStarted.current) {
                        hasStarted.current = true;
                        let startTime: number | null = null;
                        const easeOutExpo = (x: number) =>
                            x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

                        const step = (timestamp: number) => {
                            if (!startTime) startTime = timestamp;
                            const progress = Math.min(
                                (timestamp - startTime) / duration,
                                1
                            );
                            setCount(easeOutExpo(progress) * targetValue);
                            if (progress < 1)
                                rafRef.current = window.requestAnimationFrame(step);
                            else setCount(targetValue);
                        };
                        rafRef.current = window.requestAnimationFrame(step);
                    }
                },
                { threshold: 0.1 }
            );
            if (elementRef.current) observer.observe(elementRef.current);
            return () => {
                if (elementRef.current) observer.unobserve(elementRef.current);
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
        } else {
            // Looping mode — start immediately
            runAnimation();
            return () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [end, duration, loop, loopDelay]);

    return (
        <span ref={elementRef} className={className}>
            {prefix}{count.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}{suffix}
        </span>
    );
};

export default CountUp;

