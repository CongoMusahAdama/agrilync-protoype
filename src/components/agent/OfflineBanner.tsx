import React from 'react';
import { Link } from 'react-router-dom';
import { CloudOff, CloudUpload, Download, Loader2, Wifi, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOfflineOptional } from '@/contexts/OfflineContext';

const formatCachedTime = (ts: number | null) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const OfflineBanner: React.FC = () => {
    const offline = useOfflineOptional();
    if (!offline) return null;

    const {
        isOnline,
        pendingCount,
        pendingSummary,
        cachedFarmers,
        farmersCachedAt,
        isSyncing,
        isPreloading,
        preloadFieldData,
        syncNow,
    } = offline;

    const pendingDetail = (() => {
        if (pendingCount === 0) return '';
        const parts: string[] = [];
        if (pendingSummary.farmers > 0) {
            parts.push(`${pendingSummary.farmers} onboarding${pendingSummary.farmers > 1 ? 's' : ''}`);
        }
        if (pendingSummary.visits > 0) {
            parts.push(`${pendingSummary.visits} visit${pendingSummary.visits > 1 ? 's' : ''}`);
        }
        return parts.join(' · ');
    })();

    const showBanner = !isOnline || pendingCount > 0 || cachedFarmers.length === 0;

    if (!showBanner) return null;

    return (
        <div
            className={`shrink-0 px-3 sm:px-4 py-2.5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs ${
                isOnline
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-slate-900 border-slate-700 text-white'
            }`}
        >
            <div className="flex items-start sm:items-center gap-2 min-w-0">
                {isOnline ? (
                    pendingCount > 0 ? (
                        <CloudUpload className="h-4 w-4 shrink-0 text-amber-600" />
                    ) : (
                        <Wifi className="h-4 w-4 shrink-0 text-emerald-600" />
                    )
                ) : (
                    <CloudOff className="h-4 w-4 shrink-0 text-amber-300" />
                )}
                <div className="min-w-0">
                    <p className="font-black uppercase tracking-wide text-[10px]">
                        {!isOnline
                            ? 'Offline — field mode active'
                            : pendingCount > 0
                              ? `${pendingCount} item(s) waiting to sync`
                              : 'Download grower data before leaving town'}
                    </p>
                    <p className="opacity-80 mt-0.5 truncate">
                        {!isOnline
                            ? `Using ${cachedFarmers.length} cached grower(s) · onboard & log visits offline`
                            : pendingCount > 0
                              ? pendingDetail || 'Will upload automatically when connection is stable'
                              : `Last download: ${formatCachedTime(farmersCachedAt)}`}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <Link
                    to="/dashboard/agent/offline-guide"
                    className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-wide border border-current/20 hover:bg-black/5 whitespace-nowrap"
                >
                    <BookOpen className="h-3.5 w-3.5" />
                    Guide
                </Link>
                {isOnline && pendingCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={isSyncing}
                        onClick={() => void syncNow()}
                        className="h-8 text-[10px] font-black uppercase tracking-wide border-amber-300 bg-white"
                    >
                        {isSyncing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            'Sync now'
                        )}
                    </Button>
                )}
                {isOnline && (
                    <Button
                        size="sm"
                        disabled={isPreloading}
                        onClick={() => void preloadFieldData()}
                        className="h-8 text-[10px] font-black uppercase tracking-wide bg-[#065f46] hover:bg-[#065f46]/90 text-white"
                    >
                        {isPreloading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <>
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Download field data
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OfflineBanner;
