import React from 'react';
import { useNavigate } from 'react-router-dom';
import AgentLayout from './AgentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOffline } from '@/contexts/OfflineContext';
import {
    Smartphone,
    Download,
    CloudOff,
    CloudUpload,
    UserPlus,
    ClipboardList,
    Calendar,
    Search,
    Edit,
    Camera,
    Wifi,
    CheckCircle2,
    XCircle,
    Loader2,
    ChevronRight,
    Share2,
} from 'lucide-react';

const capabilityRows = [
    { action: 'Onboard a new grower', offline: true, note: 'Saved on your phone until sync' },
    { action: 'Log a field visit', offline: true, note: 'Queued automatically' },
    { action: 'Schedule a visit', offline: true, note: 'Queued automatically' },
    { action: 'Search downloaded growers', offline: true, note: 'After “Download field data”' },
    { action: 'Edit an existing grower', offline: false, note: 'Needs internet' },
    { action: 'Upload photos / media', offline: false, note: 'Needs internet for now' },
];

const dailySteps = [
    {
        time: 'Before leaving town',
        title: 'Download field data',
        detail: 'Open AgriLync while you have mobile data or Wi‑Fi. Tap Download field data on the banner so grower names are on your phone.',
    },
    {
        time: 'In the village',
        title: 'Work offline',
        detail: 'Onboard growers, log visits, and schedule visits. “Saved on Device” means it is stored safely until you sync.',
    },
    {
        time: 'Back in town',
        title: 'Sync your work',
        detail: 'Open the app with internet. Uploads run automatically, or tap Sync now on the yellow banner.',
    },
];

const faqs = [
    {
        q: 'Do I need to install the app?',
        a: 'Yes — add AgriLync to your home screen. It works better offline than opening in a browser tab.',
    },
    {
        q: 'When do my growers get their Lync ID?',
        a: 'After you sync when back online. SMS and IDs are sent once the server receives your saved work.',
    },
    {
        q: 'What if I forget to download field data?',
        a: 'You can still onboard new growers offline, but you may not be able to search existing growers until you download data with internet.',
    },
    {
        q: 'Is my offline work safe if my phone dies?',
        a: 'Yes — it stays in the app on your phone until synced. Sync as soon as you get signal.',
    },
];

const OfflineFieldGuide: React.FC = () => {
    const navigate = useNavigate();
    const {
        isOnline,
        pendingCount,
        cachedFarmers,
        farmersCachedAt,
        isSyncing,
        isPreloading,
        preloadFieldData,
        syncNow,
    } = useOffline();

    const cachedLabel = farmersCachedAt
        ? new Date(farmersCachedAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : 'Not downloaded yet';

    return (
        <AgentLayout
            activeSection="offline-field-guide"
            title="Offline Field Guide"
            subtitle="Install the app, download data, work in the village, sync in town"
        >
            <div className="space-y-5 sm:space-y-6 pb-8 animate-fade-in w-full max-w-full overflow-x-hidden">
                {/* Mobile page intro — AgentLayout hides the top bar on small screens */}
                <div className="md:hidden space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7ede56]">
                        Field agent handbook
                    </p>
                    <h1 className="text-xl font-black text-[#002f37] leading-tight tracking-tight">
                        Offline Field Guide
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Install AgriLync, download grower data before travel, work in the village without signal,
                        then sync when you are back in town.
                    </p>
                </div>

                {/* Live status */}
                <Card className="border-none shadow-xl overflow-hidden rounded-2xl sm:rounded-3xl">
                    <div className={`p-4 sm:p-5 ${isOnline ? 'bg-[#065f46]' : 'bg-slate-900'} text-white`}>
                        <div className="flex items-start gap-3">
                            {isOnline ? (
                                <Wifi className="h-6 w-6 text-[#7ede56] shrink-0 mt-0.5" />
                            ) : (
                                <CloudOff className="h-6 w-6 text-amber-300 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#7ede56]">
                                    Your phone right now
                                </p>
                                <p className="text-base sm:text-lg font-black mt-1 leading-snug">
                                    {isOnline ? 'Online — ready to download & sync' : 'Offline — field mode active'}
                                </p>
                                <ul className="text-xs text-white/75 mt-2 space-y-1 sm:hidden">
                                    <li>{cachedFarmers.length} grower(s) cached</li>
                                    <li>Last download: {cachedLabel}</li>
                                    {pendingCount > 0 && <li>{pendingCount} waiting to upload</li>}
                                </ul>
                                <p className="hidden sm:block text-xs text-white/70 mt-1 leading-relaxed">
                                    {cachedFarmers.length} grower(s) cached · Last download: {cachedLabel}
                                    {pendingCount > 0 && ` · ${pendingCount} waiting to upload`}
                                </p>
                                {!isOnline && (
                                    <p className="text-xs text-amber-200/90 mt-2 leading-relaxed">
                                        Your work saves on this phone. Open the app with signal to sync.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full [&>button]:w-full sm:[&>button]:flex-1 [&>button]:min-h-[44px]">
                            {isOnline && (
                                <>
                                    <Button
                                        disabled={isPreloading}
                                        onClick={() => void preloadFieldData()}
                                        className="flex-1 h-11 bg-[#7ede56] hover:bg-[#6bcb4b] text-[#002f37] font-black text-[10px] uppercase tracking-widest rounded-xl"
                                    >
                                        {isPreloading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download field data
                                            </>
                                        )}
                                    </Button>
                                    {pendingCount > 0 && (
                                        <Button
                                            disabled={isSyncing}
                                            variant="outline"
                                            onClick={() => void syncNow()}
                                            className="flex-1 h-11 border-white/30 bg-white/10 text-white hover:bg-white/20 font-black text-[10px] uppercase tracking-widest rounded-xl"
                                        >
                                            {isSyncing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CloudUpload className="h-4 w-4 mr-2" />
                                                    Sync now ({pendingCount})
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Install */}
                <section className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#002f37] flex items-center gap-2 leading-snug">
                        <Smartphone className="h-4 w-4 text-[#065f46] shrink-0" />
                        Step 1 — Install on your phone
                    </h2>
                    <Card className="border-none shadow-lg rounded-2xl sm:rounded-3xl">
                        <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                            <div className="flex gap-3 p-3 sm:p-4 rounded-2xl bg-gray-50">
                                <Badge className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-[#065f46] text-white shrink-0 flex items-center justify-center p-0 text-xs font-black">
                                    A
                                </Badge>
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-base font-black text-[#002f37]">Android (Chrome)</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                                        Open AgriLync → tap <strong>Add to Home Screen</strong> when prompted → open from your home screen icon.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 sm:p-4 rounded-2xl bg-gray-50">
                                <Badge className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-[#065f46] text-white shrink-0 flex items-center justify-center p-0 text-xs font-black">
                                    i
                                </Badge>
                                <div className="min-w-0">
                                    <p className="text-sm sm:text-base font-black text-[#002f37] flex items-center gap-1.5 flex-wrap">
                                        iPhone (Safari) <Share2 className="h-3.5 w-3.5 text-gray-400" />
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                                        Safari → Share → <strong>Add to Home Screen</strong> → open from home screen.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Daily routine */}
                <section className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#002f37] leading-snug">
                        Step 2 — Daily field routine
                    </h2>
                    <div className="space-y-3">
                        {dailySteps.map((step, idx) => (
                            <Card key={idx} className="border-none shadow-md rounded-2xl overflow-hidden">
                                <CardContent className="p-4 flex gap-3 sm:gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-[#7ede56]/15 text-[#065f46] flex items-center justify-center font-black text-sm shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-[#7ede56]">
                                            {step.time}
                                        </p>
                                        <p className="text-sm sm:text-base font-black text-[#002f37] mt-0.5 leading-snug">{step.title}</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">{step.detail}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* What works offline */}
                <section className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#002f37] leading-snug">
                        What works offline
                    </h2>
                    <Card className="border-none shadow-lg rounded-2xl sm:rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-gray-100">
                            {capabilityRows.map((row) => (
                                <div
                                    key={row.action}
                                    className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3 p-4"
                                >
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        {row.offline ? (
                                            <CheckCircle2 className="h-5 w-5 text-[#7ede56] shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-[#002f37] leading-snug">{row.action}</p>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{row.note}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`self-start sm:shrink-0 text-[9px] sm:text-[8px] font-black uppercase px-2.5 py-1 ${
                                            row.offline
                                                ? 'border-[#7ede56]/40 text-[#065f46] bg-[#7ede56]/10'
                                                : 'border-gray-200 text-gray-400'
                                        }`}
                                    >
                                        {row.offline ? 'Offline OK' : 'Online only'}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { icon: UserPlus, label: 'Onboard' },
                            { icon: ClipboardList, label: 'Field visit' },
                            { icon: Calendar, label: 'Schedule' },
                            { icon: Search, label: 'Search growers' },
                            { icon: Edit, label: 'Edit profile' },
                            { icon: Camera, label: 'Photos' },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center justify-center gap-1.5 p-3.5 sm:p-3 min-h-[88px] rounded-2xl bg-white border border-gray-100 shadow-sm"
                            >
                                <Icon className="h-5 w-5 text-[#065f46]" />
                                <span className="text-[10px] sm:text-[9px] font-black uppercase text-gray-500 text-center leading-tight px-1">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Banner legend */}
                <section className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#002f37] leading-snug">
                        Banner colours (top of app)
                    </h2>
                    <Card className="border-none shadow-lg rounded-2xl sm:rounded-3xl">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex gap-3 items-start p-3 sm:p-4 rounded-xl bg-slate-900 text-white">
                                <CloudOff className="h-4 w-4 shrink-0 mt-0.5 text-amber-300" />
                                <p className="text-xs sm:text-sm leading-relaxed min-w-0">
                                    <strong className="font-black">Dark banner</strong> — no signal. Keep working; data saves on your phone.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start p-3 sm:p-4 rounded-xl bg-amber-50 text-amber-950 border border-amber-200">
                                <CloudUpload className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                                <p className="text-xs sm:text-sm leading-relaxed min-w-0">
                                    <strong className="font-black">Yellow banner</strong> — items waiting to upload. Tap Sync now when online.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* FAQ */}
                <section className="space-y-3">
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#002f37] leading-snug">
                        Common questions
                    </h2>
                    <div className="space-y-2">
                        {faqs.map((item) => (
                            <Card key={item.q} className="border-none shadow-sm rounded-2xl">
                                <CardContent className="p-4">
                                    <p className="text-sm sm:text-base font-black text-[#002f37] leading-snug">{item.q}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">{item.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard/agent/farm-management')}
                    className="w-full min-h-[48px] rounded-2xl font-black text-[11px] sm:text-[10px] uppercase tracking-widest border-[#065f46]/20 text-[#065f46]"
                >
                    Go to Manage Farms
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </AgentLayout>
    );
};

export default OfflineFieldGuide;
