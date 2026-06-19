import React, { useMemo } from "react";
import { Calendar, Sprout } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  GD_BODY,
  GD_BODY_SM,
  GD_CARD_META,
  GD_CARD_TITLE,
  GD_EYEBROW,
  GD_FONT,
  GD_H2,
  GD_LABEL_SM,
  GD_STAT_LABEL,
  GD_STAT_VALUE,
} from "@/constants/growerDashboardTypography";

const STAGES = ["planning", "planting", "growing", "harvesting"] as const;
const STAGE_NAMES: Record<string, string> = {
  planning: "Plan",
  planting: "Plant",
  growing: "Grow",
  harvesting: "Harvest",
};

const SEGMENT_META = {
  completed: {
    label: "Completed",
    fill: "#065f46",
    textOnSlice: "#ffffff",
    legendText: "#065f46",
  },
  current: {
    label: "In progress",
    fill: "#7ede56",
    textOnSlice: "#002f37",
    legendText: "#065f46",
  },
  pending: {
    label: "Upcoming",
    fill: "#d4edda",
    textOnSlice: "#065f46",
    legendText: "#3d6b5a",
  },
} as const;

const chartConfig = {
  completed: { label: "Completed", color: "#065f46" },
  current: { label: "In progress", color: "#7ede56" },
  pending: { label: "Upcoming", color: "#d4edda" },
};

type GrowerFarmSnapshotChartProps = {
  crop: string;
  farmSize?: number | string;
  stageKey: string;
  stageLabel: string;
  plantingDate: string;
  daysSincePlanting: number;
  seasonLengthDays?: number;
  className?: string;
  /** Spread layout on desktop — use on Farm Profile page */
  wide?: boolean;
};

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
      fill={payload?.textOnSlice ?? "#fff"}
      textAnchor="middle"
      dominantBaseline="central"
      className={GD_FONT}
      style={{ fontSize: percent < 0.12 ? 11 : 13, fontWeight: 800 }}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

function formatSize(v: number | string | undefined): string {
  if (v == null || v === "—") return "—";
  if (typeof v === "number") return `${v} acres`;
  return String(v).includes("acre") ? String(v) : `${v} acres`;
}

function briefLine(
  stageKey: string,
  pct: number,
  daysLeft: number,
  daysIn: number,
): string {
  if (stageKey === "planning") return "Getting ready for the season.";
  if (stageKey === "planting") return "Recently planted — follow your agent.";
  if (stageKey === "harvesting")
    return "Harvest season — plan with your agent.";
  if (pct >= 75)
    return `${daysIn} days growing — talk to your agent about harvest.`;
  if (daysLeft > 0) return `About ${daysLeft} days until harvest.`;
  return "On track this season.";
}

function stageCounts(stageIdx: number) {
  const completed = Math.max(0, stageIdx);
  const current = 1;
  const pending = Math.max(0, STAGES.length - stageIdx - 1);
  return { completed, current, pending };
}

const GrowerFarmSnapshotChart: React.FC<GrowerFarmSnapshotChartProps> = ({
  crop,
  farmSize = "—",
  stageKey,
  stageLabel,
  plantingDate,
  daysSincePlanting,
  seasonLengthDays = 180,
  className = "",
  wide = false,
}) => {
  const daysLeft = Math.max(0, seasonLengthDays - daysSincePlanting);
  const stageIdx = Math.max(
    0,
    STAGES.indexOf(stageKey as (typeof STAGES)[number]),
  );
  const { completed, current, pending } = stageCounts(stageIdx);
  const pct = Math.round((completed / STAGES.length) * 100);
  const line = briefLine(stageKey, pct, daysLeft, daysSincePlanting);

  const pieData = useMemo(() => {
    const raw = [
      { name: "completed", value: completed, ...SEGMENT_META.completed },
      { name: "current", value: current, ...SEGMENT_META.current },
      { name: "pending", value: pending, ...SEGMENT_META.pending },
    ].filter((d) => d.value > 0);

    const sum = raw.reduce((s, d) => s + d.value, 0) || 1;
    return raw.map((d) => ({
      ...d,
      share: Math.round((d.value / sum) * 100),
    }));
  }, [completed, current, pending]);

  const pieChart = (sizeClass: string) => (
    <ChartContainer
      config={chartConfig}
      className={`${sizeClass} aspect-square [&_.recharts-surface]:overflow-visible`}
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
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, _name, item) => (
                <span className={`${GD_FONT} font-semibold text-[#002f37]`}>
                  {item.payload?.label}: {value} stage
                  {Number(value) !== 1 ? "s" : ""} ({item.payload?.share}%)
                </span>
              )}
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );

  const legend = (
    <ul
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${
        wide ? "flex-col items-start gap-1.5" : "justify-center"
      }`}
    >
      {pieData.map((d) => (
        <li key={d.name} className="flex items-center gap-1.5">
          <span
            className={`shrink-0 ${wide ? "h-2.5 w-4 rounded-sm" : "h-2.5 w-2.5 rounded-full"}`}
            style={{ backgroundColor: d.fill }}
            aria-hidden
          />
          <span
            className={`${GD_FONT} font-medium text-[#002f37] ${wide ? "text-[10px] uppercase tracking-wide" : "text-[11px]"}`}
            style={wide ? { color: d.legendText } : undefined}
          >
            {d.label}
          </span>
        </li>
      ))}
    </ul>
  );

  const statsRow = (
    <div className={`grid grid-cols-2 gap-3 ${wide ? "xl:gap-4" : ""}`}>
      <div className="rounded-xl bg-[#065f46]/5 border border-[#065f46]/10 px-3 py-2.5">
        <p className={GD_STAT_LABEL}>
          Days growing
        </p>
        <p
          className={`${GD_STAT_VALUE} mt-1 ${
            wide ? "text-2xl xl:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {daysSincePlanting}
        </p>
      </div>
      <div className="rounded-xl bg-[#7ede56]/10 border border-[#7ede56]/20 px-3 py-2.5">
        <p className={GD_STAT_LABEL}>
          {daysLeft > 0 ? "To harvest" : "Status"}
        </p>
        <p
          className={`${GD_STAT_VALUE} mt-1 ${
            wide ? "text-2xl xl:text-3xl" : "text-xl sm:text-2xl"
          }`}
        >
          {daysLeft > 0 ? daysLeft : "Done"}
        </p>
      </div>
    </div>
  );

  const summaryBox = (
    <div
      className={`rounded-2xl bg-[#065f46]/5 border border-[#065f46]/10 ${
        wide ? "px-4 py-4 text-left" : "px-4 py-4 text-center"
      }`}
    >
      <p
        className={`${GD_STAT_VALUE} ${
          wide ? "text-3xl xl:text-4xl" : "text-4xl"
        }`}
      >
        {pct}%
      </p>
      <p className={`mt-1 ${GD_BODY} font-medium text-gray-600`}>
        of your season stages are done
      </p>
      <div className={wide ? "mt-3" : "mt-4"}>{legend}</div>
      {wide && (
        <p className={`mt-3 ${GD_BODY} font-medium text-[#002f37] leading-snug`}>
          {line}
        </p>
      )}
    </div>
  );

  const timeline = (
    <div className={wide ? "min-w-0" : ""}>
      <p className={`${GD_LABEL_SM} uppercase tracking-wider text-gray-400 mb-3`}>
        Season steps
      </p>
      <div className="relative">
        <div className="absolute top-[13px] left-[6%] right-[6%] h-0.5 bg-gray-200 rounded-full" />
        <div
          className="absolute top-[13px] left-[6%] h-0.5 bg-[#065f46] rounded-full"
          style={{ width: `${(stageIdx / (STAGES.length - 1)) * 88}%` }}
        />
        <div className="relative flex justify-between">
          {STAGES.map((key, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <div key={key} className="flex flex-col items-center flex-1">
                <div
                  className={`${wide ? "h-8 w-8 text-xs" : "h-7 w-7 text-[10px]"} rounded-full flex items-center justify-center font-semibold ${
                    active
                      ? "bg-[#7ede56] text-[#065f46] ring-2 ring-[#065f46]"
                      : done
                        ? "bg-[#065f46] text-white"
                        : "bg-white border border-gray-200 text-gray-300"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span
                  className={`${wide ? "text-[10px]" : "text-[9px] sm:text-[10px]"} font-medium mt-1 ${
                    active
                      ? "text-[#065f46]"
                      : done
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  {STAGE_NAMES[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const progressBlock = wide ? (
    <div className="space-y-5 xl:grid xl:grid-cols-[200px_minmax(0,1fr)] xl:gap-8 xl:items-start xl:space-y-0">
      <div className="flex flex-col items-center gap-3 shrink-0">
        {pieChart("h-[160px] w-[160px] xl:h-[200px] xl:w-[200px]")}
        <p className={`${GD_BODY} font-medium text-[#002f37] text-center xl:text-left w-full`}>
          <span className={`text-2xl ${GD_STAT_VALUE}`}>
            {pct}%
          </span>
          <span className="text-gray-500 font-normal ml-1.5">
            overall complete
          </span>
        </p>
      </div>
      <div className="space-y-4 min-w-0">
        {summaryBox}
        {statsRow}
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      {summaryBox}
      <div className="flex justify-center">{pieChart("h-[140px] w-[140px]")}</div>
      <p className={`${GD_BODY} font-medium text-[#002f37] leading-snug text-center px-1`}>
        {line}
      </p>
      {statsRow}
    </div>
  );

  return (
    <div className={`${GD_FONT} ${className}`}>
      {!wide && (
        <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
          <h2 className={`${GD_H2} flex items-center gap-2`}>
            <Sprout className="h-5 w-5 text-[#065f46]" aria-hidden />
            Your farm at a glance
          </h2>
          <span className={`${GD_LABEL_SM} text-[#065f46] bg-[#7ede56]/20 px-2.5 py-1 rounded-full`}>
            {stageLabel}
          </span>
        </div>
      )}

      <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <header
          className={`px-4 sm:px-5 border-b border-gray-50 flex flex-wrap items-start justify-between gap-2 ${
            wide ? "pt-5 pb-4 xl:px-8" : "pt-4 pb-3"
          }`}
        >
          <div className="min-w-0">
            {wide && (
              <p className={`${GD_EYEBROW} mb-1 flex items-center gap-1.5`}>
                <Sprout className="h-4 w-4" />
                Your farm at a glance
              </p>
            )}
            {!wide && (
              <p className={GD_BODY_SM}>What you are growing</p>
            )}
            <p
              className={`${GD_CARD_TITLE} truncate ${wide ? "text-2xl xl:text-3xl" : ""}`}
            >
              {crop}
            </p>
            <p className={`mt-1 ${GD_CARD_META} flex flex-wrap items-center gap-x-2 gap-y-0.5`}>
              <span>{formatSize(farmSize)}</span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#065f46]" aria-hidden />
                {plantingDate}
              </span>
            </p>
          </div>
          {wide && (
            <span className={`${GD_LABEL_SM} text-[#065f46] bg-[#7ede56]/20 px-3 py-1.5 rounded-full shrink-0`}>
              {stageLabel}
            </span>
          )}
        </header>

        {wide ? (
          <div className="px-4 sm:px-5 py-5 xl:px-8 xl:py-6 space-y-6 xl:space-y-0 xl:grid xl:grid-cols-[1fr_1fr] xl:gap-10">
            {progressBlock}
            <div className="xl:flex xl:items-center">{timeline}</div>
          </div>
        ) : (
          <>
            <div className="px-4 sm:px-5 py-4">{progressBlock}</div>
            <footer className="px-4 sm:px-5 pb-4 pt-3 border-t border-gray-50 bg-gray-50/40">
              {timeline}
            </footer>
          </>
        )}
      </article>
    </div>
  );
};

export default GrowerFarmSnapshotChart;
