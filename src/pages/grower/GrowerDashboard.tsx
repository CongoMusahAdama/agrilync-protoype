import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  Leaf,
  Phone,
  Sprout,
} from 'lucide-react';
import GrowerLayout from '@/components/grower/GrowerLayout';
import GrowerStatusHero from '@/components/grower/GrowerStatusHero';
import GrowerLyncCardModal from '@/components/grower/GrowerLyncCardModal';
import GrowerHomeShortcuts from '@/components/grower/GrowerHomeShortcuts';
import GrowerAgentDetailsDialog from '@/components/grower/GrowerAgentDetailsDialog';
import GrowerFarmSnapshotChart from '@/components/grower/GrowerFarmSnapshotChart';
import GrowerFarmSnapshotTeaser from '@/components/grower/GrowerFarmSnapshotTeaser';
import CountUp from '@/components/CountUp';
import { useGrower } from '@/contexts/GrowerContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { GROWER_ROUTES } from '@/utils/growerRoutes';
import { DEV_GROWER_FARMS } from '@/utils/devGrower';
import { resolvePublicAssetUrl } from '@/lib/resolveAssetUrl';
import {
  GD_BODY,
  GD_BTN,
  GD_BTN_PILL,
  GD_CAPTION,
  GD_H1,
  GD_H2,
  GD_H3,
  GD_ID,
  GD_LABEL_SM,
  GD_METRIC_LABEL,
  GD_METRIC_SUB,
  GD_METRIC_VALUE,
  GROWER_DASHBOARD_HOME,
} from '@/constants/growerDashboardTypography';

type VerificationStatus = 'pending' | 'active' | 'returned' | 'incomplete';
type ProjectTrackStatus = 'on-track' | 'at-risk' | 'off-track';

const TRACK_LABELS: Record<ProjectTrackStatus, string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'off-track': 'Off Track',
};

const STAGE_LABELS: Record<string, string> = {
  planning: 'Planning',
  planting: 'Planting',
  growing: 'Growing',
  harvesting: 'Harvesting',
  maintenance: 'Maintenance',
  other: 'Other',
};

type HighlightCard = {
  id: string;
  title: string;
  value: string | number;
  valueIsNumeric?: boolean;
  subtext: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
};

const GrowerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { grower, assignedAgent, stats, farms } = useGrower();
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const farmSnapshotRef = useRef<HTMLDivElement>(null);

  const scrollToFarmSnapshot = () => {
    farmSnapshotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const displayName = grower?.name || 'Lync Grower';
  const firstName = displayName.split(' ')[0];
  const primaryFarm = farms[0] ?? DEV_GROWER_FARMS[0];
  const avatarSrc = grower?.profilePicture ? resolvePublicAssetUrl(grower.profilePicture) : undefined;

  const verificationStatus: VerificationStatus = useMemo(() => {
    if (grower?.status === 'pending') return 'pending';
    if (grower?.status === 'active') return 'active';
    if (grower?.status === 'inactive') return 'incomplete';
    return 'pending';
  }, [grower?.status]);

  const heroStatus = verificationStatus === 'returned' ? 'returned' : verificationStatus;

  const projectTrack: ProjectTrackStatus = 'on-track';
  const farmStage = stats?.currentStage || grower?.currentStage || primaryFarm?.currentStage || 'planning';
  const stageLabel = STAGE_LABELS[farmStage] || farmStage;

  const trainingCompleted = stats?.trainingSessions ?? 0;
  const trainingTotal = 5;
  const agentVisits = assignedAgent ? 3 : 0;
  const daysSinceLastVisit = assignedAgent ? 14 : null;

  const plantingDate = '2024-03-15';
  const daysSincePlanting = useMemo(() => {
    const planted = new Date(plantingDate);
    const diff = Date.now() - planted.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const highlightCards: HighlightCard[] = useMemo(
    () => [
      {
        id: 'project-health',
        title: 'Project Health',
        value: TRACK_LABELS[projectTrack],
        subtext: 'Farm project status',
        color: 'bg-[#065f46]',
        icon: Sprout,
        route: GROWER_ROUTES.farmVisits,
      },
      {
        id: 'farm-stage',
        title: 'Farm Stage',
        value: stageLabel,
        subtext: 'Current growth phase',
        color: 'bg-blue-600',
        icon: Leaf,
        route: GROWER_ROUTES.farmProfile,
      },
      {
        id: 'training',
        title: 'Training',
        value: trainingCompleted,
        valueIsNumeric: true,
        subtext: `of ${trainingTotal} modules`,
        color: 'bg-orange-600',
        icon: GraduationCap,
        route: GROWER_ROUTES.training,
      },
      {
        id: 'field-outreach',
        title: 'Field Outreach',
        value: daysSinceLastVisit ?? '—',
        valueIsNumeric: daysSinceLastVisit != null,
        subtext:
          daysSinceLastVisit != null ? `days since visit · ${agentVisits} total` : 'no agent visits yet',
        color: 'bg-rose-600',
        icon: ClipboardList,
        route: GROWER_ROUTES.farmVisits,
      },
    ],
    [projectTrack, stageLabel, trainingCompleted, trainingTotal, daysSinceLastVisit, agentVisits]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statusHero =
    verificationStatus === 'active' ? (
      <GrowerStatusHero
        status="active"
        growerName={isMobile ? undefined : displayName}
        onViewCard={() => setCardModalOpen(true)}
        compact={isMobile}
        className={isMobile ? '!rounded-[1.25rem] !mb-0 !h-auto !min-h-0' : undefined}
      />
    ) : (
      <GrowerStatusHero
        status={heroStatus}
        growerName={isMobile ? undefined : displayName}
        compact={isMobile}
        className={isMobile ? '!rounded-[1.25rem] !mb-0 !h-auto !min-h-0' : undefined}
      />
    );

  const metricsGrid = (mobile: boolean) => (
    <div className={`grid grid-cols-2 ${mobile ? 'gap-2 px-0.5' : 'lg:grid-cols-4 gap-3 lg:gap-6'}`}>
      {highlightCards.map((item, idx) => (
        <Card
          key={item.id}
          className={`${item.color} border-none rounded-none ${mobile ? 'h-[5.25rem]' : 'h-24 lg:h-40'} flex flex-col justify-between shadow-lg ${mobile ? '' : 'lg:shadow-xl hover:scale-[1.02] lg:hover:scale-105'} transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${idx * 100}ms` }}
          onClick={() => navigate(item.route)}
        >
          <div
            className={`absolute ${mobile ? '-right-3 -bottom-3' : '-right-3 lg:-right-6 -bottom-3 lg:-bottom-6'} opacity-10 pointer-events-none`}
          >
            <item.icon className={`${mobile ? 'h-12 w-12' : 'h-12 w-12 lg:h-32 lg:w-32'} text-white rotate-12`} />
          </div>

          <div className={`${mobile ? 'p-2.5' : 'p-3 lg:p-8'} h-full flex flex-col justify-between relative z-10`}>
            <div className={`flex items-center ${mobile ? 'gap-1' : 'gap-1.5 lg:gap-3'} min-w-0`}>
              <div
                className={`${mobile ? 'p-0.5 rounded-md' : 'p-1 lg:p-2.5 rounded-lg lg:rounded-2xl'} bg-white/10 backdrop-blur-md border border-white/10 shrink-0`}
              >
                <item.icon className={`${mobile ? 'h-2.5 w-2.5' : 'h-3 w-3 lg:h-6 lg:w-6'} text-white`} />
              </div>
              <span
                className={`${mobile ? GD_METRIC_LABEL : GD_METRIC_LABEL} leading-none truncate`}
              >
                {item.title}
              </span>
            </div>

            <div className="space-y-0">
              <p className={`${mobile ? 'text-[17px]' : 'text-[18px] lg:text-4xl'} ${GD_METRIC_VALUE} truncate`}>
                {item.valueIsNumeric ? (
                  <CountUp end={Number(item.value) || 0} duration={mobile ? 1000 : 1200} />
                ) : (
                  item.value
                )}
              </p>
              <span className={`${GD_METRIC_SUB} line-clamp-1`}>
                {item.subtext}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const modals = (
    <>
      <GrowerLyncCardModal
        open={cardModalOpen}
        onOpenChange={setCardModalOpen}
        grower={grower}
        assignedAgent={assignedAgent}
      />
      <GrowerAgentDetailsDialog
        open={agentDetailsOpen}
        onOpenChange={setAgentDetailsOpen}
        agent={assignedAgent}
      />
    </>
  );

  const farmSnapshot = (
    <GrowerFarmSnapshotChart
      className="px-0.5"
      crop={primaryFarm?.crop || grower?.farmType || '—'}
      farmSize={grower?.farmSize ?? 2.5}
      stageKey={farmStage}
      stageLabel={stageLabel}
      plantingDate={plantingDate}
      daysSincePlanting={daysSincePlanting}
    />
  );

  if (isMobile) {
    return (
      <GrowerLayout activeSection="dashboard" title="Home" subtitle="" hideTopBar>
        <div className={`${GROWER_DASHBOARD_HOME} flex flex-col -mt-4 pb-12 relative`}>
          <div className="sticky top-0 z-50 bg-[#f8fafc] -mx-2 px-3 pt-4 pb-3 border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  className="h-11 w-11 border-2 border-[#7ede56]/30 shadow-md cursor-pointer shrink-0"
                  onClick={() => setProfileSheetOpen(true)}
                >
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-[#065f46] text-white text-xs font-semibold">
                    {firstName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <div
                    className="flex items-center gap-1.5 cursor-pointer min-w-0"
                    onClick={() => setProfileSheetOpen(true)}
                  >
                    <h1 className={`${GD_H1} leading-none truncate`}>
                      Hello {firstName}!
                    </h1>
                    <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                  </div>
                  <span className={`${GD_ID} mt-0.5 truncate`}>
                    {grower?.lyncId || 'Lync Grower'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {assignedAgent?.contact ? (
                  <a
                    href={`tel:${assignedAgent.contact}`}
                    className={`inline-flex items-center gap-1 h-9 px-2.5 rounded-full bg-[#7ede56] text-white active:scale-95 shadow-sm ${GD_BTN_PILL}`}
                    aria-label="Call agent"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white shadow-sm border border-gray-100 h-10 w-10 active:scale-95"
                  onClick={() => navigate(GROWER_ROUTES.help)}
                >
                  <img src="/lovable-uploads/notifs.png" alt="Notifications" className="h-6 w-6 object-contain" />
                </Button>
              </div>
            </div>
            {assignedAgent && (
              <p className={`${GD_LABEL_SM} mt-2 pl-1`}>
                Agent:{' '}
                <button
                  type="button"
                  onClick={() => setAgentDetailsOpen(true)}
                  className="font-semibold text-[#065f46]"
                >
                  {assignedAgent.name}
                </button>
                <span className="text-[#065f46]"> · </span>
                <button type="button" onClick={() => setAgentDetailsOpen(true)} className="font-semibold text-[#065f46]">
                  Details
                </button>
              </p>
            )}
          </div>

          <div className={`fixed top-0 left-0 right-0 z-[100] bg-white rounded-b-[2rem] shadow-xl p-5 transition-all duration-500 transform ${profileSheetOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-1 bg-gray-100 rounded-full mb-1 cursor-pointer" onClick={() => setProfileSheetOpen(false)} />
              <Avatar className="h-16 w-16 border-2 border-[#7ede56]/20 shadow-lg">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="bg-[#065f46] text-white text-xl font-semibold">
                  {firstName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className={`${GD_H3} text-[19px]`}>{displayName}</h3>
                <p className={`${GD_ID} mt-1`}>{grower?.lyncId}</p>
              </div>
              <Button
                className={`w-full bg-white text-[#002f37] border border-gray-100 rounded-full h-11 ${GD_BTN}`}
                onClick={() => {
                  setProfileSheetOpen(false);
                  navigate(GROWER_ROUTES.settings);
                }}
              >
                Manage Your Account
              </Button>
            </div>
          </div>
          {profileSheetOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90]" onClick={() => setProfileSheetOpen(false)} />
          )}

          <div className="flex flex-col gap-3 pt-4 px-1">
            {statusHero}

            <GrowerHomeShortcuts mobileOnly />

            <GrowerFarmSnapshotTeaser
              crop={primaryFarm?.crop || grower?.farmType || '—'}
              stageLabel={stageLabel}
              onTap={scrollToFarmSnapshot}
            />

            <div className="space-y-2">
              <h2 className={`${GD_H2} px-0.5`}>Active metrics</h2>
              {metricsGrid(true)}
            </div>

            <div ref={farmSnapshotRef} id="farm-snapshot" className="scroll-mt-24">
              {farmSnapshot}
            </div>

            {projectTrack === 'at-risk' && (
              <div className={`mx-1 p-4 flex gap-2 ${GD_BODY} text-amber-900 bg-amber-50 rounded-[1.75rem] border border-amber-200`}>
                <AlertTriangle className="h-5 w-5 shrink-0" />
                Project flagged At Risk — complete training and check visit reports.
              </div>
            )}
          </div>
        </div>
        {modals}
      </GrowerLayout>
    );
  }

  return (
    <GrowerLayout activeSection="dashboard" title="Home" subtitle="Outreach, training, and farm snapshot">
      <div
        className={`${GROWER_DASHBOARD_HOME} mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className={`${GD_H1} text-gray-900 mb-1`}>
              {greeting()}, {firstName}
            </h2>
            <p className={GD_BODY}>
              Track your farm stage, training progress, and field agent outreach.
            </p>
            {grower?.lyncId && (
              <p className={`${GD_ID} mt-1`}>{grower.lyncId}</p>
            )}
          </div>
          {assignedAgent?.contact && (
            <a
              href={`tel:${assignedAgent.contact}`}
              className={`shrink-0 inline-flex items-center gap-1.5 h-10 px-3 rounded-full bg-[#7ede56] text-white hover:bg-[#6bcb4b] active:scale-95 transition-all shadow-md ${GD_BTN_PILL}`}
              aria-label={`Call ${assignedAgent.name}`}
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Call agent</span>
            </a>
          )}
        </div>
        {assignedAgent && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
            <p className={GD_CAPTION}>
              Field agent:{' '}
              <button
                type="button"
                onClick={() => setAgentDetailsOpen(true)}
                className="font-medium text-[#065f46] hover:underline underline-offset-2"
              >
                {assignedAgent.name}
              </button>
              {assignedAgent.region ? <span className="text-gray-400"> · {assignedAgent.region}</span> : null}
            </p>
            <button
              type="button"
              onClick={() => setAgentDetailsOpen(true)}
              className={`${GD_BTN_PILL} text-[#065f46] hover:underline`}
            >
              View details
            </button>
          </div>
        )}
      </div>

      {statusHero}
      {modals}

      <div className={`${GROWER_DASHBOARD_HOME} space-y-4 mb-6`}>
        <h2 className={GD_H2}>Active Metrics</h2>
        {metricsGrid(false)}
      </div>

      <div className="mb-6">
        <GrowerHomeShortcuts />
      </div>

      <Card className={`${GROWER_DASHBOARD_HOME} mb-6`}>
        <CardHeader className="pb-3">
          <CardTitle className={`${GD_H2} flex items-center justify-between gap-2`}>
            <span>Project Status</span>
            <Badge
              className={
                projectTrack === 'on-track'
                  ? 'bg-[#7ede56] text-[#002f37]'
                  : projectTrack === 'at-risk'
                    ? 'bg-amber-400 text-[#002f37]'
                    : 'bg-red-500 text-white'
              }
            >
              {TRACK_LABELS[projectTrack]}
            </Badge>
          </CardTitle>
          <CardDescription className={GD_BODY}>
            On Track / At Risk / Off Track — based on training and field visit activity (funding coming later).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(GROWER_ROUTES.training)}>
            Continue training
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(GROWER_ROUTES.farmVisits)}>
            Farm visits & reports
          </Button>
        </CardContent>
      </Card>

      {farmSnapshot}

      {projectTrack === 'at-risk' && (
        <Card className="mt-6 border-amber-300 bg-amber-50">
          <CardContent className={`p-4 flex gap-2 ${GD_BODY} text-amber-900`}>
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Project flagged At Risk — complete pending training and check recent farm visit reports.
          </CardContent>
        </Card>
      )}
    </GrowerLayout>
  );
};

export default GrowerDashboard;
