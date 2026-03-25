export const agentProfile = {
  name: 'Lync Agent',
  title: 'Lync Agent',
  avatar: '/lovable-uploads/profile.png',
  region: 'Region',
  agentId: 'LYA---',
  contact: '',
  districts: [],
  stats: {
    farmersOnboarded: 0,
    activeFarms: 0,
    investorMatches: 0,
    pendingDisputes: 0,
    reportsThisMonth: 0,
    trainingsAttended: 0
  }
};

export const agentFarmers: any[] = [];

export const agentAssignedFarms: any[] = [];

export const agentMatches: any[] = [];

export const agentDisputes: any[] = [];

export const agentTrainings = {
  upcoming: [],
  summary: [
    { label: 'Farmers Onboarded', value: 0, goal: 60 },
    { label: 'Reports Submitted', value: 0, goal: 40 },
    { label: 'Disputes Resolved', value: 0, goal: 15 }
  ]
};

export const agentPerformanceTrend: any[] = [];



export const availableTrainings: any[] = [];
export const myTrainings: any[] = [];
export const performanceMetrics = {
  score: 0,
  farmersOnboarded: 0,
  fieldVisits: 0,
  reportsSubmitted: 0,
  investmentMatches: 0,
  disputesResolved: 0,
  monthlyActivity: [],
  trainingParticipation: []
};
export const agentNotifications: any[] = [];
export const scheduledVisits: any[] = [];
export const activityTimeline: any[] = [];

