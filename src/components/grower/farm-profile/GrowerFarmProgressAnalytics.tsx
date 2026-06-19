import React, { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';
import {
    GROWER_TABLE,
    growerActionBtn,
    growerActionBtnRow,
    growerActionBtnRowOutline,
} from '@/constants/growerTheme';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import { useGrowerOptional } from '@/contexts/GrowerContext';
import { DEV_GROWER_AGENT, isGrowerLocalhostBypass } from '@/utils/devGrower';
import type {
    FarmProfileActivity,
    FarmProfilePerformance,
    FarmProfileStage,
    FarmProfileTracker,
} from '@/types/growerFarmProfile';

type Props = {
    trackers: FarmProfileTracker[];
    activities?: FarmProfileActivity[];
    performance: FarmProfilePerformance;
    currentSeason?: string;
};

const STAGES_PER_PAGE = 3;

const SEGMENT_META = {
    completed: {
        label: 'Completed',
        fill: '#065f46',
        textOnSlice: '#ffffff',
        legendText: '#065f46',
    },
    current: {
        label: 'In progress',
        fill: '#7ede56',
        textOnSlice: '#002f37',
        legendText: '#065f46',
    },
    pending: {
        label: 'Upcoming',
        fill: '#d4edda',
        textOnSlice: '#065f46',
        legendText: '#3d6b5a',
    },
} as const;

const chartConfig = {
    completed: { label: 'Completed', color: '#065f46' },
    current: { label: 'In progress', color: '#7ede56' },
    pending: { label: 'Upcoming', color: '#d4edda' },
};

const STATUS_LABELS = {
    completed: 'Done',
    current: 'Now',
    pending: 'Next',
} as const;

function aggregateStages(trackers: FarmProfileTracker[]) {
    const stages = trackers.flatMap((t) => t.stages);
    const completed = stages.filter((s) => s.status === 'completed').length;
    const current = stages.filter((s) => s.status === 'current').length;
    const pending = stages.filter((s) => s.status === 'pending').length;
    const total = stages.length || 1;
    const pct = Math.round((completed / total) * 100);
    return { completed, current, pending, total, pct, stages };
}

type StageRow = FarmProfileStage & {
    lastActivity: string;
    challenge: string;
};

function buildStageRows(
    tracker: FarmProfileTracker | undefined,
    activities: FarmProfileActivity[]
): StageRow[] {
    if (!tracker) return [];

    const farmActs = activities.filter((a) => a.farmId === tracker.farmId);

    return tracker.stages.map((stage) => {
        const stageActs = farmActs
            .filter(
                (a) =>
                    a.stage === stage.key ||
                    a.stageLabel?.toLowerCase() === stage.label.toLowerCase()
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const latest = stageActs[0];

        let lastActivity = '—';
        if (latest?.activityType) {
            lastActivity = latest.activityType;
        } else if (stage.status === 'current') {
            lastActivity = 'Awaiting agent log';
        }

        let challenge = '—';
        if (latest?.description?.trim()) {
            challenge = latest.description.trim();
        } else if (stage.status === 'current') {
            challenge = 'None noted';
        } else if (stage.status === 'completed' && latest) {
            challenge = 'None noted';
        }

        return { ...stage, lastActivity, challenge };
    });
}

type SliceLabelProps = {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    payload?: { textOnSlice?: string };
};

function SlicePercentLabel({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
    payload,
}: SliceLabelProps) {
    if (percent < 0.06) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill={payload?.textOnSlice ?? '#fff'}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-inter"
            style={{ fontSize: percent < 0.12 ? 12 : 14, fontWeight: 800 }}
        >
            {`${Math.round(percent * 100)}%`}
        </text>
    );
}

function normalizePhone(contact: string) {
    return contact.replace(/[^\d+]/g, '');
}

function stageMessageBody(agentFirstName: string, stageLabel: string) {
    return `Hello ${agentFirstName}, I have a question about the ${stageLabel} stage on my farm.`;
}

function StageAgentAction({
    stageLabel,
    agentName,
    agentPhone,
    layout = 'stacked',
}: {
    stageLabel: string;
    agentName?: string;
    agentPhone?: string;
    layout?: 'stacked' | 'row';
}) {
    if (!agentPhone) {
        return (
            <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap">No agent yet</span>
        );
    }

    const phone = normalizePhone(agentPhone);
    const firstName = (agentName || 'Agent').split(' ')[0];
    const smsBody = encodeURIComponent(stageMessageBody(firstName, stageLabel));

    const callClass =
        layout === 'row'
            ? growerActionBtnRow()
            : growerActionBtn(true, 'sm');

    const messageClass =
        layout === 'row'
            ? growerActionBtnRowOutline()
            : growerActionBtn(false, 'sm');

    return (
        <div
            className={
                layout === 'row'
                    ? 'grid grid-cols-2 gap-2 w-full'
                    : 'flex flex-col gap-1.5 items-stretch sm:items-end min-w-[88px]'
            }
        >
            <a href={`tel:${phone}`} className={callClass} aria-label={`Call your agent about ${stageLabel}`}>
                <Phone className={layout === 'row' ? 'h-4 w-4 shrink-0' : 'h-3.5 w-3.5 shrink-0'} aria-hidden />
                Call
            </a>
            <a
                href={`sms:${phone}?body=${smsBody}`}
                className={messageClass}
                aria-label={`Text your agent about ${stageLabel}`}
            >
                <MessageCircle className={layout === 'row' ? 'h-4 w-4 shrink-0' : 'h-3 w-3 shrink-0'} aria-hidden />
                Message
            </a>
        </div>
    );
}

function StageStatusBadge({ status }: { status: FarmProfileStage['status'] }) {
    return (
        <span
            className={`inline-block text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${
                status === 'completed'
                    ? 'bg-[#7ede56]/15 text-[#002f37]'
                    : status === 'current'
                      ? 'bg-[#7ede56]/35 text-[#002f37]'
                      : 'bg-[#d4edda] text-[#3d6b5a]'
            }`}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}

function MobileStageCard({
    row,
    agentName,
    agentPhone,
}: {
    row: StageRow;
    agentName?: string;
    agentPhone?: string;
}) {
    const showDetail = row.status === 'current' || row.lastActivity !== '—';

    return (
        <article
            className={`rounded-2xl border p-4 ${
                row.status === 'current'
                    ? 'border-[#7ede56] bg-[#7ede56]/8 shadow-sm'
                    : 'border-gray-100 bg-white'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-base font-black text-[#002f37] leading-tight">{row.label}</h3>
                    {showDetail && (
                        <p className="mt-1.5 text-sm text-gray-600 leading-snug">
                            {row.lastActivity !== '—' ? row.lastActivity : 'Your agent will log activity here'}
                        </p>
                    )}
                </div>
                <StageStatusBadge status={row.status} />
            </div>

            {row.status === 'current' && row.challenge !== '—' && (
                <p className="mt-2 text-xs text-gray-500">
                    <span className="font-bold text-gray-600">Note: </span>
                    {row.challenge}
                </p>
            )}

            <div className="mt-4">
                <StageAgentAction
                    stageLabel={row.label}
                    agentName={agentName}
                    agentPhone={agentPhone}
                    layout="row"
                />
            </div>
        </article>
    );
}

const GrowerFarmProgressAnalytics: React.FC<Props> = ({
    trackers,
    activities = [],
    performance,
    currentSeason,
}) => {
    const growerCtx = useGrowerOptional();
    const agent =
        growerCtx?.assignedAgent ?? (isGrowerLocalhostBypass() ? DEV_GROWER_AGENT : null);

    const primary = trackers[0];
    const { completed, current, pending, total, pct } = useMemo(
        () => aggregateStages(trackers),
        [trackers]
    );

    const stageRows = useMemo(
        () => buildStageRows(primary, activities),
        [primary, activities]
    );

    const [page, setPage] = useState(0);

    useEffect(() => {
        const currentIdx = stageRows.findIndex((r) => r.status === 'current');
        const startPage = currentIdx >= 0 ? Math.floor(currentIdx / STAGES_PER_PAGE) : 0;
        setPage(startPage);
    }, [stageRows]);

    const totalPages = Math.max(1, Math.ceil(stageRows.length / STAGES_PER_PAGE));
    const safePage = Math.min(page, totalPages - 1);
    const visibleRows = stageRows.slice(
        safePage * STAGES_PER_PAGE,
        safePage * STAGES_PER_PAGE + STAGES_PER_PAGE
    );

    const pieData = useMemo(() => {
        const raw = [
            { name: 'completed', value: completed, ...SEGMENT_META.completed },
            { name: 'current', value: current, ...SEGMENT_META.current },
            { name: 'pending', value: pending, ...SEGMENT_META.pending },
        ].filter((d) => d.value > 0);

        const sum = raw.reduce((s, d) => s + d.value, 0) || 1;
        return raw.map((d) => ({
            ...d,
            share: Math.round((d.value / sum) * 100),
        }));
    }, [completed, current, pending]);

    if (!trackers.length) return null;

    const agentFirstName = agent?.name?.split(' ')[0];

    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-4 sm:p-6 lg:p-8`}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4 lg:mb-5">
                <div className="min-w-0">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#065f46]">
                        Farm progress
                    </h2>
                    <p className="text-sm sm:text-base font-bold text-[#002f37] mt-1 line-clamp-2">
                        {primary?.farmName || 'Your farm'}
                        {currentSeason ? ` · Season ${currentSeason}` : ''}
                    </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] bg-[#7ede56]/25 px-3 py-1.5 rounded-full shrink-0">
                    {performance.trainingModulesCompleted}/{performance.trainingModulesTotal} training
                </span>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4">
                <div className="rounded-2xl bg-[#065f46]/5 border border-[#065f46]/10 px-4 py-4 text-center">
                    <p className="text-4xl font-black text-[#065f46] tabular-nums leading-none">{pct}%</p>
                    <p className="mt-1 text-sm font-bold text-gray-600">of your farm stages are done</p>
                    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        {pieData.map((d) => (
                            <li key={d.name} className="flex items-center gap-1.5">
                                <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: d.fill }}
                                    aria-hidden
                                />
                                <span className="text-[11px] font-bold text-[#002f37]">{d.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-center">
                    <ChartContainer
                        config={chartConfig}
                        className="h-[140px] w-[140px] aspect-square [&_.recharts-surface]:overflow-visible"
                    >
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius="92%"
                                strokeWidth={2}
                                stroke="#ffffff"
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={1}
                                labelLine={false}
                                label={(props) => <SlicePercentLabel {...props} />}
                            >
                                {pieData.map((d) => (
                                    <Cell key={d.name} fill={d.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                        Your stages
                    </p>
                    <div className="space-y-3">
                        {visibleRows.map((row) => (
                            <MobileStageCard
                                key={row.key}
                                row={row}
                                agentName={agent?.name}
                                agentPhone={agent?.contact}
                            />
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={safePage === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            className="flex-1 h-12 font-black text-sm uppercase tracking-wide border-gray-200"
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" />
                            Back
                        </Button>
                        <span className="text-xs font-bold text-gray-600 tabular-nums px-2 shrink-0">
                            {safePage + 1} / {totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={safePage >= totalPages - 1}
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            className="flex-1 h-12 font-black text-sm uppercase tracking-wide border-gray-200"
                        >
                            More
                            <ChevronRight className="h-5 w-5 ml-1" />
                        </Button>
                    </div>
                )}

                {agentFirstName && (
                    <p className="text-xs text-center text-gray-500 font-semibold">
                        Tap Call or Message to reach {agentFirstName} about any stage
                    </p>
                )}
            </div>

            {/* Desktop — chart + stage table */}
            <div className="hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
                <div className="flex flex-col gap-3 shrink-0">
                    <ChartContainer
                        config={chartConfig}
                        className="h-[200px] w-[200px] aspect-square mx-auto [&_.recharts-surface]:overflow-visible"
                    >
                        <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius="88%"
                                strokeWidth={3}
                                stroke="#ffffff"
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={1}
                                labelLine={false}
                                label={(props) => <SlicePercentLabel {...props} />}
                            >
                                {pieData.map((d) => (
                                    <Cell key={d.name} fill={d.fill} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        formatter={(value, _name, item) => (
                                            <span className="font-inter font-bold text-[#002f37]">
                                                {item.payload?.label}: {value} stage
                                                {Number(value) !== 1 ? 's' : ''} ({item.payload?.share}%)
                                            </span>
                                        )}
                                    />
                                }
                            />
                        </PieChart>
                    </ChartContainer>

                    <ul className="flex flex-col gap-1.5">
                        {pieData.map((d) => (
                            <li key={d.name} className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-4 rounded-sm shrink-0"
                                    style={{ backgroundColor: d.fill }}
                                    aria-hidden
                                />
                                <span
                                    className="text-[10px] font-black uppercase tracking-wide"
                                    style={{ color: d.legendText }}
                                >
                                    {d.label}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <p className="text-sm font-bold text-[#002f37]">
                        <span className="text-2xl font-black text-[#065f46] tabular-nums">{pct}%</span>
                        <span className="text-gray-500 font-semibold ml-1.5">overall complete</span>
                    </p>
                </div>

                <div className="min-w-0 w-full">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
                        Stage breakdown
                    </p>
                    <div className="rounded-xl border border-gray-100 overflow-x-auto shadow-sm">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className={GROWER_TABLE.headRow}>
                                    <th className={`${GROWER_TABLE.headCell} whitespace-nowrap`}>Stage</th>
                                    <th className={`${GROWER_TABLE.headCell} whitespace-nowrap`}>Status</th>
                                    <th className={`${GROWER_TABLE.headCell} whitespace-nowrap`}>Activity</th>
                                    <th className={`${GROWER_TABLE.headCell} whitespace-nowrap min-w-[120px]`}>
                                        Challenge
                                    </th>
                                    <th className={`${GROWER_TABLE.headCell} whitespace-nowrap text-right`}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRows.map((row, i) => (
                                    <tr
                                        key={row.key}
                                        className={`${GROWER_TABLE.bodyRow} ${i % 2 === 1 ? 'bg-[#f8fafc]/80' : 'bg-white'}`}
                                    >
                                        <td className={`${GROWER_TABLE.bodyCell} font-semibold text-[#002f37] whitespace-nowrap`}>
                                            {row.label}
                                        </td>
                                        <td className={GROWER_TABLE.bodyCell}>
                                            <StageStatusBadge status={row.status} />
                                        </td>
                                        <td className={`${GROWER_TABLE.bodyCell} text-[#002f37] max-w-[140px]`}>
                                            <span className="line-clamp-2">{row.lastActivity}</span>
                                        </td>
                                        <td className={`${GROWER_TABLE.bodyCell} text-gray-600 text-xs sm:text-sm max-w-[140px]`}>
                                            <span className="line-clamp-2">{row.challenge}</span>
                                        </td>
                                        <td className={`${GROWER_TABLE.bodyCell} text-right align-middle`}>
                                            <StageAgentAction
                                                stageLabel={row.label}
                                                agentName={agent?.name}
                                                agentPhone={agent?.contact}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-3 mt-3 px-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={safePage === 0}
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                className="h-9 px-3 font-bold text-xs uppercase tracking-wide border-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Prev
                            </Button>
                            <span className="text-xs font-bold text-gray-600 tabular-nums">
                                Page {safePage + 1} of {totalPages}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={safePage >= totalPages - 1}
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                className="h-9 px-3 font-bold text-xs uppercase tracking-wide border-gray-200"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}

                    <p className="text-[11px] text-gray-500 mt-3 font-semibold font-inter">
                        {completed} of {total} stages complete
                        {current > 0 ? ' · 1 in progress' : ''}
                        {agentFirstName ? ` · Call or message ${agentFirstName} about any stage` : ''}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default GrowerFarmProgressAnalytics;
