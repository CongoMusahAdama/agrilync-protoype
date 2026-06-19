import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    hero?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
};

/** Mobile page shell — lime hero + rounded overlap into white content */
const GrowerMobileShell: React.FC<Props> = ({
    title,
    onBack,
    rightAction,
    hero,
    children,
    className,
    contentClassName,
}) => {
    const navigate = useNavigate();

    return (
        <div className={cn('-mx-2 sm:mx-0 min-h-[calc(100dvh-8rem)] flex flex-col bg-[#7ede56]', className)}>
            <div className="shrink-0 text-white">
                <div className="flex items-center justify-between gap-3 px-4 pt-2 pb-2">
                    <button
                        type="button"
                        onClick={onBack ?? (() => navigate(-1))}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 active:scale-95 transition-transform"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-base font-bold tracking-tight truncate flex-1 text-center px-2">
                        {title}
                    </h1>
                    <div className="w-10 flex justify-end shrink-0">{rightAction}</div>
                </div>

                {hero ? <div className="px-4 pb-5">{hero}</div> : <div className="pb-3" />}
            </div>

            <div
                className={cn(
                    'flex-1 bg-white rounded-t-[1.75rem] shadow-[0_-6px_28px_rgba(0,47,55,0.1)] px-4 pt-5 pb-8',
                    contentClassName
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default GrowerMobileShell;
