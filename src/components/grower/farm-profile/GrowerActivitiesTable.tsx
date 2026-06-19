import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { GROWER_PROFILE_CARD } from '@/constants/farmProfile';
import { GROWER_TABLE } from '@/constants/growerTheme';
import { GROWER_DASHBOARD_FONT } from '@/constants/growerTypography';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import type { FarmProfileActivity } from '@/types/growerFarmProfile';

type Props = {
    activities: FarmProfileActivity[];
    showFarmColumn?: boolean;
    previewCount?: number;
};

function formatDate(date: string) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

const GrowerActivitiesTable: React.FC<Props> = ({
    activities,
    showFarmColumn = false,
    previewCount = 12,
}) => {
    const [showAll, setShowAll] = useState(false);

    const visible = useMemo(
        () => (showAll ? activities : activities.slice(0, previewCount)),
        [activities, previewCount, showAll]
    );

    if (activities.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center bg-[#f8fafc]">
                <p className="text-sm font-medium text-gray-600">No activities yet</p>
                <p className="text-xs text-gray-400 mt-1">Your agent will log visits here.</p>
            </div>
        );
    }

    return (
        <div className={GROWER_DASHBOARD_FONT}>
            <div className={`md:hidden space-y-2 max-h-[420px] overflow-y-auto`}>
                {visible.map((row, i) => (
                    <article
                        key={row.id}
                        className={`rounded-lg border border-gray-100 p-4 ${i % 2 === 1 ? 'bg-[#f8fafc]' : 'bg-white'}`}
                    >
                        <div className="flex justify-between gap-2 text-sm">
                            <span className="font-bold text-[#002f37]">{row.activityType}</span>
                            <span className="text-gray-500 shrink-0">{formatDate(row.date)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{row.stageLabel}</p>
                        <p className="text-xs text-gray-600 mt-2 truncate">{row.inputsUsed}</p>
                        {row.hasPhoto && (
                            <Camera className="h-4 w-4 text-[#7ede56] mt-2" aria-label="Photo attached" />
                        )}
                    </article>
                ))}
            </div>

            <div className="hidden md:block agent-table-scroll rounded-xl border border-gray-100 overflow-hidden max-h-[420px] overflow-y-auto">
                <Table>
                    <TableHeader className={`${GROWER_TABLE.header} sticky top-0 z-10`}>
                        <TableRow className={GROWER_TABLE.headRow}>
                            <TableHead className={GROWER_TABLE.headCell}>Date</TableHead>
                            <TableHead className={GROWER_TABLE.headCell}>Stage</TableHead>
                            <TableHead className={GROWER_TABLE.headCell}>Activity</TableHead>
                            <TableHead className={GROWER_TABLE.headCell}>Inputs</TableHead>
                            <TableHead className={`${GROWER_TABLE.headCell} text-center`}>Photo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.map((row, i) => (
                            <TableRow
                                key={row.id}
                                className={`${GROWER_TABLE.bodyRow} ${i % 2 === 1 ? 'bg-[#f8fafc]/80' : 'bg-white'}`}
                            >
                                <TableCell className={`${GROWER_TABLE.bodyCell} whitespace-nowrap`}>
                                    {formatDate(row.date)}
                                </TableCell>
                                <TableCell className={`${GROWER_TABLE.bodyCell} text-gray-600`}>
                                    {row.stageLabel}
                                </TableCell>
                                <TableCell className={`${GROWER_TABLE.bodyCell} font-semibold text-[#002f37]`}>
                                    {row.activityType}
                                </TableCell>
                                <TableCell className={`${GROWER_TABLE.bodyCell} text-gray-600 max-w-[200px] truncate`}>
                                    {row.inputsUsed}
                                </TableCell>
                                <TableCell className={`${GROWER_TABLE.bodyCell} text-center`}>
                                    {row.hasPhoto ? (
                                        <Camera className="h-4 w-4 text-[#7ede56] inline" aria-label="Photo" />
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
                {activities.length > previewCount && !showAll && (
                    <button
                        type="button"
                        onClick={() => setShowAll(true)}
                        className="text-sm font-bold text-gray-500 hover:underline"
                    >
                        Show more on this page
                    </button>
                )}
                {showAll && activities.length > previewCount && (
                    <button
                        type="button"
                        onClick={() => setShowAll(false)}
                        className="text-sm font-bold text-gray-500 hover:underline"
                    >
                        Show less
                    </button>
                )}
                <Link
                    to={GROWER_ROUTES.farmVisits}
                    className="text-sm font-bold text-[#7ede56] hover:underline"
                >
                    View Full History
                </Link>
            </div>
        </div>
    );
};

export function GrowerActivitiesSection({
    activities,
    showFarmColumn,
}: {
    activities: FarmProfileActivity[];
    showFarmColumn?: boolean;
}) {
    return (
        <section className={`${GROWER_PROFILE_CARD} ${GROWER_DASHBOARD_FONT} p-6 sm:p-7 lg:p-8`}>
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">
                Recent activities
            </h2>
            <GrowerActivitiesTable activities={activities} showFarmColumn={showFarmColumn} />
        </section>
    );
}

export default GrowerActivitiesTable;
