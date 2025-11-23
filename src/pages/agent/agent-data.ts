export const agentProfile = {
  name: 'Oti Gabriel Wontumi',
  title: 'Senior Lync Agent',
  avatar: '/lovable-uploads/profile.png',
  region: 'Ashanti Region',
  agentId: 'LYA458920',
  contact: '+233 20 987 6543',
  districts: ['Kumasi Metro', 'Ejisu', 'Bosomtwe'],
  stats: {
    farmersOnboarded: 45,
    activeFarms: 30,
    investorMatches: 12,
    pendingDisputes: 3,
    reportsThisMonth: 28,
    trainingsAttended: 8
  }
};

export const agentFarmers = [
  {
    name: 'John Koomson',
    region: 'Ashanti',
    community: 'Asokwa',
    farmType: 'Maize',
    status: 'active' as const,
    investmentStatus: 'Matched',
    lastUpdated: '06 Nov 2025'
  },
  {
    name: 'Amina Fuseini',
    region: 'Northern',
    community: 'Tamale North',
    farmType: 'Livestock',
    status: 'pending' as const,
    investmentStatus: 'Pending',
    lastUpdated: '04 Nov 2025'
  },
  {
    name: 'Yaw Boateng',
    region: 'Ashanti',
    community: 'Bosomtwe',
    farmType: 'Cassava',
    status: 'active' as const,
    investmentStatus: 'Matched',
    lastUpdated: '02 Nov 2025'
  },
  {
    name: 'Akua Ntim',
    region: 'Eastern',
    community: 'Nkawkaw',
    farmType: 'Cocoa',
    status: 'inactive' as const,
    investmentStatus: 'Completed',
    lastUpdated: '20 Oct 2025'
  },
  {
    name: 'Munira Alhassan',
    region: 'Savannah',
    community: 'Damongo',
    farmType: 'Groundnut',
    status: 'pending' as const,
    investmentStatus: 'Awaiting Verification',
    lastUpdated: '03 Nov 2025'
  }
];

export const agentAssignedFarms = [
  {
    id: 'F-2045',
    farmer: 'John Koomson',
    crop: 'Maize',
    status: 'verified' as const,
    lastVisit: '03 Nov 2025',
    nextVisit: '17 Nov 2025',
    reportStatus: 'Ready'
  },
  {
    id: 'F-1998',
    farmer: 'Amina Fuseini',
    crop: 'Cattle',
    status: 'scheduled' as const,
    lastVisit: '26 Oct 2025',
    nextVisit: '09 Nov 2025',
    reportStatus: 'Pending'
  },
  {
    id: 'F-2051',
    farmer: 'Yaw Boateng',
    crop: 'Cassava',
    status: 'needs-attention' as const,
    lastVisit: '01 Nov 2025',
    nextVisit: '12 Nov 2025',
    reportStatus: 'Flagged'
  },
  {
    id: 'F-1982',
    farmer: 'Akua Ntim',
    crop: 'Cocoa',
    status: 'scheduled' as const,
    lastVisit: '15 Sep 2025',
    nextVisit: '11 Nov 2025',
    reportStatus: 'Awaiting'
  }
];

export const agentMatches = [
  {
    investor: 'AgriFunds Ltd.',
    farmer: 'John Koomson',
    farmType: 'Maize',
    value: 'GHS 85,000',
    matchDate: '12 Sep 2025',
    status: 'Active'
  },
  {
    investor: 'Green Harvest Capital',
    farmer: 'Yaw Boateng',
    farmType: 'Cassava',
    value: 'GHS 60,000',
    matchDate: '28 Aug 2025',
    status: 'Pending Funding'
  },
  {
    investor: 'Akoto Invest',
    farmer: 'Amina Fuseini',
    farmType: 'Livestock',
    value: 'GHS 45,000',
    matchDate: '04 Nov 2025',
    status: 'Under Review'
  },
  {
    investor: 'Sunrise Agro Partners',
    farmer: 'Akua Ntim',
    farmType: 'Cocoa',
    value: 'GHS 120,000',
    matchDate: '01 Jun 2025',
    status: 'Completed'
  }
];

export const agentDisputes = [
  {
    id: '#D102',
    parties: 'John K. & AgriFunds Ltd.',
    type: 'Late Payment',
    logged: '02 Nov 2025',
    status: 'Ongoing'
  },
  {
    id: '#D097',
    parties: 'Amina F. & Akoto Invest',
    type: 'Crop Loss',
    logged: '28 Oct 2025',
    status: 'Resolved'
  },
  {
    id: '#D088',
    parties: 'Yaw B. & Green Harvest',
    type: 'Input Delivery',
    logged: '20 Oct 2025',
    status: 'Under Review'
  }
];

export const agentTrainings = {
  upcoming: [
    {
      title: 'Field Data Reporting',
      date: '10 Nov 2025',
      time: '10:00 AM',
      mode: 'Virtual'
    },
    {
      title: 'AI Advisory Toolkit',
      date: '18 Nov 2025',
      time: '2:00 PM',
      mode: 'In-Person'
    }
  ],
  summary: [
    { label: 'Farmers Onboarded', value: 45, goal: 60 },
    { label: 'Reports Submitted', value: 28, goal: 40 },
    { label: 'Disputes Resolved', value: 12, goal: 15 }
  ]
};

export const agentPerformanceTrend = [
  { month: 'Jun', farmers: 18, reports: 22, disputes: 3 },
  { month: 'Jul', farmers: 22, reports: 25, disputes: 4 },
  { month: 'Aug', farmers: 28, reports: 26, disputes: 5 },
  { month: 'Sep', farmers: 32, reports: 27, disputes: 6 },
  { month: 'Oct', farmers: 38, reports: 30, disputes: 8 },
  { month: 'Nov', farmers: 45, reports: 28, disputes: 12 }
];

export const agentNotifications = [
  {
    id: 1,
    title: 'New farmer assigned to your region.',
    time: '5 minutes ago',
    type: 'info'
  },
  {
    id: 2,
    title: 'Investor AgriFunds Ltd. requested progress update.',
    time: '2 hours ago',
    type: 'action'
  },
  {
    id: 3,
    title: 'Training: Field Data Reporting – tomorrow at 10AM.',
    time: '1 day ago',
    type: 'reminder'
  },
  {
    id: 4,
    title: 'Dispute #D102 requires follow up before Friday.',
    time: '2 days ago',
    type: 'alert'
  }
];

