import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import type { PendingConfirmation } from '@/types/growerFarmProfile';

type Props = {
    items: PendingConfirmation[];
    onConfirm: (farmId: string, activityId: string, response: 'yes' | 'not_yet') => Promise<void>;
    compact?: boolean;
    className?: string;
};

function buildSentence(item: PendingConfirmation) {
    const date = item.date
        ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        : null;
    const parts = [
        item.activityType,
        item.stageLabel ? `· ${item.stageLabel}` : null,
        date ? `· ${date}` : null,
    ].filter(Boolean);
    let sentence = parts.join(' ');
    if (item.description) sentence += ` — ${item.description}`;
    return sentence;
}

const GrowerConfirmationTaps: React.FC<Props> = ({ items, onConfirm, compact = false, className = '' }) => {
    const [busy, setBusy] = useState(false);
    const item = items[0];

    if (!item) return null;

    const handleTap = async (response: 'yes' | 'not_yet') => {
        setBusy(true);
        try {
            await onConfirm(item.farmId, item.activityId, response);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section
            className={`${GROWER_DASHBOARD_FONT} rounded-xl border border-amber-300/80 bg-amber-50/90 shadow-sm ${
                compact ? 'p-3.5 sm:p-4 h-full flex flex-col' : 'p-6 sm:p-8'
            } ${className}`}
            role="alert"
        >
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" aria-hidden />
                <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-900 truncate">
                    Confirm activity
                </h2>
                {items.length > 1 && (
                    <span className="text-[10px] font-bold text-amber-800/70 ml-auto shrink-0">
                        +{items.length - 1}
                    </span>
                )}
            </div>

            <p
                className={`text-[#002f37] font-medium leading-snug ${
                    compact ? 'text-xs sm:text-sm line-clamp-3 flex-1' : 'text-base sm:text-lg'
                }`}
            >
                {buildSentence(item)}
            </p>

            <div className={`grid grid-cols-2 gap-2 ${compact ? 'mt-3' : 'mt-6 gap-3 sm:gap-4'}`}>
                <Button
                    type="button"
                    disabled={busy}
                    onClick={() => handleTap('yes')}
                    className={`font-black uppercase tracking-wide bg-[#7ede56] hover:bg-[#6bcb4b] text-white rounded-lg w-full ${
                        compact ? 'h-9 text-[11px]' : 'h-14 sm:h-16 text-base sm:text-lg rounded-xl'
                    }`}
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Done'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => handleTap('not_yet')}
                    className={`font-black uppercase tracking-wide rounded-lg border bg-white w-full ${
                        compact ? 'h-9 text-[11px]' : 'h-14 sm:h-16 text-base sm:text-lg rounded-xl border-2'
                    }`}
                >
                    Not Yet
                </Button>
            </div>
        </section>
    );
};

export default GrowerConfirmationTaps;
