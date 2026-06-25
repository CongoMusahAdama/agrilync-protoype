import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

type SignaturePadProps = {
    value?: string;
    onChange: (dataUrl: string) => void;
    disabled?: boolean;
    className?: string;
};

const SignaturePad: React.FC<SignaturePadProps> = ({
    value,
    onChange,
    disabled = false,
    className = '',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const [hasStroke, setHasStroke] = useState(Boolean(value));

    const getPoint = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY,
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const emitChange = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        onChange(canvas.toDataURL('image/png'));
    }, [onChange]);

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        drawingRef.current = true;
        const { x, y } = getPoint(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawingRef.current || disabled) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getPoint(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasStroke(true);
    };

    const endDraw = () => {
        if (!drawingRef.current) return;
        drawingRef.current = false;
        emitChange();
    };

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(320, Math.floor(rect.width * 2));
        canvas.height = Math.max(120, Math.floor(rect.height * 2));
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#002f37';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (value) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                setHasStroke(true);
            };
            img.src = value;
        }
    }, [value]);

    useEffect(() => {
        setupCanvas();
        const onResize = () => setupCanvas();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [setupCanvas]);

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas || disabled) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasStroke(false);
        onChange('');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="relative rounded-xl border-2 border-dashed border-gray-200 bg-white overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-[140px] touch-none cursor-crosshair"
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                />
                {!hasStroke && !disabled && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium">
                        Sign here with mouse or finger
                    </div>
                )}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clear}
                disabled={disabled || !hasStroke}
                className="h-9 text-xs font-semibold"
            >
                <Eraser className="h-3.5 w-3.5 mr-1.5" />
                Clear signature
            </Button>
        </div>
    );
};

export default SignaturePad;
