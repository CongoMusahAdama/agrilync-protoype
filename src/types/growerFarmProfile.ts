export type FarmStatusFlag = 'on_track' | 'at_risk' | 'off_track';

export type StageStatus = 'completed' | 'current' | 'pending';

export type FarmProfileStage = {
    key: string;
    label: string;
    status: StageStatus;
};

export type FarmProfileTracker = {
    farmId: string;
    farmCode: string;
    farmName: string;
    crop: string;
    category: 'crop' | 'livestock';
    currentStage: string;
    stages: FarmProfileStage[];
};

export type FarmProfileActivity = {
    id: string;
    farmId: string;
    farmName: string;
    date: string;
    stage: string;
    stageLabel: string;
    activityType: string;
    description?: string;
    inputsUsed: string;
    cost: number | null;
    hasPhoto: boolean;
    confirmationStatus: 'pending' | 'yes' | 'not_yet';
};

export type PendingConfirmation = {
    activityId: string;
    farmId: string;
    farmName: string;
    stage: string;
    stageLabel: string;
    activityType: string;
    date: string;
    description?: string;
};

export type FarmProfileRating = {
    stars: number;
    proposedStars: number;
    note: string;
    status: 'none' | 'pending_admin' | 'confirmed';
    isConfirmed: boolean;
    isPendingReview: boolean;
};

export type FarmProfileSummary = {
    farmName: string;
    farmId: string;
    farmSize?: number;
    measuredAcres?: number;
    gps?: { lat: number; lng: number } | null;
    primaryActivity: 'crop' | 'livestock' | 'mixed';
    currentSeason: string;
    currentStage?: string;
    currentStageLabel?: string;
    farmStatusFlag: FarmStatusFlag;
    region?: string;
    district?: string;
    community?: string;
};

export type FarmProfilePerformance = {
    stagesCompleted: number;
    trainingModulesCompleted: number;
    trainingModulesTotal: number;
    lastAgentVisit: string | null;
    rating: FarmProfileRating;
    farmStatusFlag: FarmStatusFlag;
};

export type GrowerFarmProfileData = {
    summary: FarmProfileSummary;
    rating: FarmProfileRating;
    pendingConfirmations: PendingConfirmation[];
    farms: Array<{
        id: string;
        farmCode: string;
        name: string;
        crop: string;
        category: 'crop' | 'livestock';
        location: string;
        stageTracker: FarmProfileTracker;
    }>;
    activities: FarmProfileActivity[];
    performance: FarmProfilePerformance;
};
