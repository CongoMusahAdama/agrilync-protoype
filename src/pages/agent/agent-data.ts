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
    name: 'Koomson Maize Farm',
    farmerName: 'John Koomson',
    location: 'Asokwa, Ashanti',
    crop: 'Maize',
    status: 'verified' as const,
    lastVisit: '03 Nov 2025',
    nextVisit: '17 Nov 2025',
    reportStatus: 'Ready'
  },
  {
    id: 'F-1998',
    name: 'Fuseini Livestock Ranch',
    farmerName: 'Amina Fuseini',
    location: 'Tamale North, Northern',
    crop: 'Cattle',
    status: 'scheduled' as const,
    lastVisit: '26 Oct 2025',
    nextVisit: '09 Nov 2025',
    reportStatus: 'Pending'
  },
  {
    id: 'F-2051',
    name: 'Boateng Cassava Field',
    farmerName: 'Yaw Boateng',
    location: 'Bosomtwe, Ashanti',
    crop: 'Cassava',
    status: 'needs-attention' as const,
    lastVisit: '01 Nov 2025',
    nextVisit: '12 Nov 2025',
    reportStatus: 'Flagged'
  },
  {
    id: 'F-1982',
    name: 'Ntim Cocoa Estate',
    farmerName: 'Akua Ntim',
    location: 'Nkawkaw, Eastern',
    crop: 'Cocoa',
    status: 'scheduled' as const,
    lastVisit: '15 Sep 2025',
    nextVisit: '11 Nov 2025',
    reportStatus: 'Awaiting'
  }
];

export const agentMatches = [
  {
    id: 'M-101',
    investor: 'AgriFunds Ltd.',
    farmer: 'John Koomson',
    farmType: 'Maize',
    value: 'GHS 85,000',
    matchDate: '12 Sep 2025',
    status: 'Active',
    approvalStatus: 'approved',
    documents: {
      farmerSignature: true,
      investorSignature: true,
      agentApproval: true,
      agreement: 'signed_agreement.pdf'
    }
  },
  {
    id: 'M-102',
    investor: 'Green Harvest Capital',
    farmer: 'Yaw Boateng',
    farmType: 'Cassava',
    value: 'GHS 60,000',
    matchDate: '28 Aug 2025',
    status: 'Pending Funding',
    approvalStatus: 'approved',
    documents: {
      farmerSignature: true,
      investorSignature: true,
      agentApproval: true,
      agreement: 'signed_agreement.pdf'
    }
  },
  {
    id: 'M-103',
    investor: 'Akoto Invest',
    farmer: 'Amina Fuseini',
    farmType: 'Livestock',
    value: 'GHS 45,000',
    matchDate: '04 Nov 2025',
    status: 'Pending Approval',
    approvalStatus: 'pending',
    documents: {
      farmerSignature: true,
      investorSignature: true,
      agentApproval: false,
      agreement: 'draft_agreement.pdf'
    },
    notes: 'Farmer has signed. Investor has signed. Waiting for agent verification.'
  },
  {
    id: 'M-104',
    investor: 'Sunrise Agro Partners',
    farmer: 'Akua Ntim',
    farmType: 'Cocoa',
    value: 'GHS 120,000',
    matchDate: '01 Jun 2025',
    status: 'Completed',
    approvalStatus: 'approved',
    documents: {
      farmerSignature: true,
      investorSignature: true,
      agentApproval: true,
      agreement: 'completed_agreement.pdf'
    }
  },
  {
    id: 'M-105',
    investor: 'Future Farms Inc.',
    farmer: 'Munira Alhassan',
    farmType: 'Groundnut',
    value: 'GHS 35,000',
    matchDate: '05 Dec 2025',
    status: 'Pending Approval',
    approvalStatus: 'pending',
    documents: {
      farmerSignature: true,
      investorSignature: false,
      agentApproval: false,
      agreement: 'draft_agreement.pdf'
    },
    notes: 'Waiting for investor signature.'
  }
];

export const agentDisputes = [
  {
    id: '#D102',
    parties: { farmer: 'John Koomson', investor: 'AgriFunds Ltd.', agent: 'Oti Gabriel Wontumi' },
    type: 'Payment Delay',
    severity: 'Medium',
    dateLogged: '02 Nov 2025',
    status: 'Under Review',
    region: 'Ashanti',
    description: 'Investor delayed payment of GHS 40,000 for maize inputs. Farmer unable to purchase required fertilizers for the planting season.',
    timeline: [
      { date: '02 Nov 2025', action: 'Dispute created by Agent', user: 'Oti Gabriel Wontumi' },
      { date: '03 Nov 2025', action: 'Evidence uploaded', user: 'John Koomson' },
      { date: '04 Nov 2025', action: 'Investigation started', user: 'Oti Gabriel Wontumi' },
      { date: '05 Nov 2025', action: 'Investor contacted', user: 'Oti Gabriel Wontumi' }
    ],
    evidence: ['payment_agreement.pdf', 'bank_statement.pdf'],
    notes: 'Investor claims bank transfer was delayed due to technical issues. Verifying with bank.'
  },
  {
    id: '#D097',
    parties: { farmer: 'Amina Fuseini', investor: 'Akoto Invest', agent: 'Oti Gabriel Wontumi' },
    type: 'Miscommunication',
    severity: 'Low',
    dateLogged: '28 Oct 2025',
    status: 'Resolved',
    region: 'Northern',
    description: 'Misunderstanding regarding delivery schedule for livestock feed. Both parties had different expectations.',
    timeline: [
      { date: '28 Oct 2025', action: 'Dispute created', user: 'Amina Fuseini' },
      { date: '29 Oct 2025', action: 'Meeting scheduled', user: 'Oti Gabriel Wontumi' },
      { date: '30 Oct 2025', action: 'Resolution meeting held', user: 'Oti Gabriel Wontumi' },
      { date: '31 Oct 2025', action: 'Dispute resolved', user: 'Oti Gabriel Wontumi' }
    ],
    evidence: ['delivery_schedule.pdf'],
    notes: 'Resolved through mediation. New delivery schedule agreed upon.',
    resolution: 'Both parties agreed to a revised delivery schedule with clear timelines.'
  },
  {
    id: '#D112',
    parties: { farmer: 'Yaw Boateng', investor: 'Green Harvest Capital', agent: 'Oti Gabriel Wontumi' },
    type: 'Input Misuse',
    severity: 'High',
    dateLogged: '01 Nov 2025',
    status: 'Pending',
    region: 'Ashanti',
    description: 'Investor claims farmer misused provided inputs for cassava farming. Farmer denies allegations.',
    timeline: [
      { date: '01 Nov 2025', action: 'Dispute created', user: 'Green Harvest Capital' },
      { date: '01 Nov 2025', action: 'Assigned to agent', user: 'System' }
    ],
    evidence: [],
    notes: 'Field visit scheduled to verify input usage.'
  },
  {
    id: '#D088',
    parties: { farmer: 'Akua Ntim', investor: 'Sunrise Agro Partners', agent: 'Oti Gabriel Wontumi' },
    type: 'Poor Farm Performance',
    severity: 'Medium',
    dateLogged: '20 Oct 2025',
    status: 'Under Review',
    region: 'Eastern',
    description: 'Low cocoa yield reported. Investor questioning farming practices.',
    timeline: [
      { date: '20 Oct 2025', action: 'Dispute created', user: 'Sunrise Agro Partners' },
      { date: '21 Oct 2025', action: 'Farm inspection scheduled', user: 'Oti Gabriel Wontumi' },
      { date: '25 Oct 2025', action: 'Inspection report submitted', user: 'Oti Gabriel Wontumi' }
    ],
    evidence: ['inspection_report.pdf', 'farm_photos.zip'],
    notes: 'Weather conditions affected yield. Not farmer\'s fault. Awaiting investor response.'
  },
  {
    id: '#D115',
    parties: { farmer: 'Munira Alhassan', investor: 'AgriInvest Ghana', agent: 'Oti Gabriel Wontumi' },
    type: 'Breach of Agreement',
    severity: 'High',
    dateLogged: '05 Nov 2025',
    status: 'Escalated',
    region: 'Savannah',
    description: 'Farmer sold portion of harvest to third party instead of investor as per agreement.',
    timeline: [
      { date: '05 Nov 2025', action: 'Dispute created', user: 'AgriInvest Ghana' },
      { date: '06 Nov 2025', action: 'Escalated to legal team', user: 'Oti Gabriel Wontumi' }
    ],
    evidence: ['sales_receipt.pdf', 'agreement.pdf'],
    notes: 'Breach of contract confirmed. Case escalated to legal department.'
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



export const availableTrainings = [
  {
    id: 1,
    title: 'Advanced Crop Management',
    category: 'Crop Management',
    date: '15 Dec 2025',
    time: '10:00 AM',
    mode: 'Online',
    trainer: 'Dr. Kwame Agyeman',
    description: 'Learn the latest techniques in sustainable crop production and disease management.',
    spots: 25
  },
  {
    id: 2,
    title: 'Digital Tools for Agents',
    category: 'Digital Tools',
    date: '20 Dec 2025',
    time: '02:00 PM',
    mode: 'Webinar',
    trainer: 'AgriLync Tech Team',
    description: 'Master the AgriLync agent app and data collection tools.',
    spots: 50
  },
  {
    id: 3,
    title: 'Financial Literacy for Farmers',
    category: 'Field Advisory',
    date: '10 Jan 2026',
    time: '09:00 AM',
    mode: 'In-Person',
    trainer: 'Ghana Commercial Bank',
    description: 'How to guide farmers in managing their finances and investment funds.',
    spots: 20
  }
];

export const myTrainings = [
  {
    id: 101,
    title: 'Field Data Reporting',
    date: '10 Nov 2025',
    mode: 'Online',
    status: 'Registered',
    certificate: false
  },
  {
    id: 102,
    title: 'Farmer Engagement Skills',
    date: '02 Oct 2025',
    mode: 'In-Person',
    status: 'Completed',
    certificate: true
  },
  {
    id: 103,
    title: 'Pest Control Basics',
    date: '15 Aug 2025',
    mode: 'Webinar',
    status: 'Completed',
    certificate: true
  },
  {
    id: 104,
    title: 'Soil Testing Methods',
    date: '20 Jul 2025',
    mode: 'Field',
    status: 'Missed',
    certificate: false
  }
];

export const performanceMetrics = {
  score: 89,
  farmersOnboarded: 45,
  fieldVisits: 32,
  reportsSubmitted: 28,
  investmentMatches: 12,
  disputesResolved: 10,
  monthlyActivity: [
    { name: 'Jan', onboarding: 4, reports: 10 },
    { name: 'Feb', onboarding: 6, reports: 12 },
    { name: 'Mar', onboarding: 8, reports: 15 },
    { name: 'Apr', onboarding: 5, reports: 14 },
    { name: 'May', onboarding: 7, reports: 18 },
    { name: 'Jun', onboarding: 9, reports: 20 },
    { name: 'Jul', onboarding: 6, reports: 22 },
    { name: 'Aug', onboarding: 10, reports: 24 },
    { name: 'Sep', onboarding: 8, reports: 20 },
    { name: 'Oct', onboarding: 12, reports: 28 },
    { name: 'Nov', onboarding: 15, reports: 30 },
    { name: 'Dec', onboarding: 5, reports: 5 }
  ],
  trainingParticipation: [
    { name: 'Q1', attended: 2 },
    { name: 'Q2', attended: 3 },
    { name: 'Q4', attended: 2 }
  ]
};

export const agentNotifications = [
  {
    id: 1,
    title: 'Upcoming Training: Sustainable Farming Practices',
    time: '2 hours ago',
    type: 'training',
    read: false,
    priority: 'medium'
  },
  {
    id: 2,
    title: 'Submitted Field Report for F-2045',
    time: '5 hours ago',
    type: 'report',
    read: true,
    priority: 'low'
  },
  {
    id: 3,
    title: 'Urgent: Weather Alert for Northern Region',
    time: '1 hour ago',
    type: 'alert',
    read: false,
    priority: 'high'
  },
  {
    id: 4,
    title: 'Verified Farmer: John Koomson',
    time: '1 day ago',
    type: 'verification',
    read: true,
    priority: 'medium'
  },
  {
    id: 5,
    title: 'New Message from Investor: Solar Capital',
    time: '1 day ago',
    type: 'message',
    read: false,
    priority: 'medium'
  },
  {
    id: 6,
    title: 'Logged Dispute #D102',
    time: '2 days ago',
    type: 'dispute',
    read: true,
    priority: 'high'
  },
  {
    id: 7,
    title: 'Updated Investment Match M-101',
    time: '3 days ago',
    type: 'match',
    read: true,
    priority: 'medium'
  },
  {
    id: 8,
    title: 'Attended Event: Ashanti Regional Farmers Day',
    time: '1 week ago',
    type: 'event',
    read: true,
    priority: 'low'
  }
];

export const scheduledVisits = [
  {
    id: 'V-001',
    farmer: 'John Koomson',
    farm: 'Farm A - Maize',
    date: '12 Dec 2025',
    time: '09:00 AM',
    purpose: 'Crop Health Check',
    status: 'Confirmed'
  },
  {
    id: 'V-002',
    farmer: 'Amina Fuseini',
    farm: 'Farm B - Livestock',
    date: '14 Dec 2025',
    time: '02:00 PM',
    purpose: 'Vaccination Verification',
    status: 'Pending'
  },
  {
    id: 'V-003',
    farmer: 'Yaw Boateng',
    farm: 'Farm C - Cassava',
    date: '16 Dec 2025',
    time: '10:30 AM',
    purpose: 'Harvest Estimation',
    status: 'Confirmed'
  },
  {
    id: 'V-004',
    farmer: 'Akua Ntim',
    farm: 'Farm D - Cocoa',
    date: '18 Dec 2025',
    time: '08:00 AM',
    purpose: 'Sucker Removal Inspection',
    status: 'Pending'
  }
];

export const activityTimeline = [
  {
    id: 1,
    title: 'Completed Training: Sustainable Farming',
    time: '2 hours ago',
    type: 'training'
  },
  {
    id: 2,
    title: 'Submitted Field Report for F-2045',
    time: '5 hours ago',
    type: 'report'
  },
  {
    id: 3,
    title: 'Verified Farmer: John Koomson',
    time: '1 day ago',
    type: 'verification'
  },
  {
    id: 4,
    title: 'Logged Dispute #D102',
    time: '2 days ago',
    type: 'dispute'
  },
  {
    id: 5,
    title: 'Match Approved: M-101',
    time: '3 days ago',
    type: 'match'
  }
];

