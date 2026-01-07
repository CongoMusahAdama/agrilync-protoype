// Mock data for localhost development when backend is not available

// Check if we're on localhost
export const isLocalhost = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
};

// Mock dashboard summary data
export const getMockDashboardSummary = () => ({
    success: true,
    data: {
        agent: {
            id: 'mock-agent-id',
            name: 'Test Agent',
            email: 'test@agrilync.com',
            agentId: 'AGENT001',
            region: 'Greater Accra',
            role: 'agent',
            status: 'active',
        },
        stats: {
            farmersOnboarded: 45,
            activeFarms: 32,
            investorMatches: 18,
            pendingDisputes: 3,
            reportsThisMonth: 12,
            trainingsAttended: 5,
        },
        farmers: [
            {
                _id: 'f1',
                id: 'f1',
                name: 'Kwame Mensah',
                status: 'verified',
                region: 'Greater Accra',
                district: 'Accra',
                community: 'Madina',
                farmType: 'Crop',
                contact: '+233501234567',
                profilePicture: null,
            },
            {
                _id: 'f2',
                id: 'f2',
                name: 'Abena Osei',
                status: 'verified',
                region: 'Ashanti',
                district: 'Kumasi',
                community: 'Adum',
                farmType: 'Livestock',
                contact: '+233502345678',
                profilePicture: null,
            },
            {
                _id: 'f3',
                id: 'f3',
                name: 'John Baah',
                status: 'pending',
                region: 'Eastern',
                district: 'Koforidua',
                community: 'New Juaben',
                farmType: 'Crop',
                contact: '+233503456789',
                profilePicture: null,
            },
        ],
        farms: [
            {
                _id: 'farm1',
                id: 'farm1',
                name: 'Mensah Maize Farm',
                farmer: {
                    _id: 'f1',
                    name: 'Kwame Mensah',
                    region: 'Greater Accra',
                    community: 'Madina',
                    farmType: 'Crop',
                },
                location: {
                    region: 'Greater Accra',
                    district: 'Accra',
                    community: 'Madina',
                },
                crop: 'Maize',
                status: 'active',
                nextVisit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                _id: 'farm2',
                id: 'farm2',
                name: 'Osei Poultry Farm',
                farmer: {
                    _id: 'f2',
                    name: 'Abena Osei',
                    region: 'Ashanti',
                    community: 'Adum',
                    farmType: 'Livestock',
                },
                location: {
                    region: 'Ashanti',
                    district: 'Kumasi',
                    community: 'Adum',
                },
                crop: 'Poultry',
                status: 'active',
                nextVisit: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        notifications: [
            {
                _id: 'n1',
                id: 'n1',
                type: 'alert',
                title: 'New Farmer Registration',
                message: 'Kwame Mensah has registered and needs verification',
                read: false,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                _id: 'n2',
                id: 'n2',
                type: 'update',
                title: 'Farm Visit Scheduled',
                message: 'Scheduled visit for Mensah Maize Farm tomorrow',
                read: false,
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
                _id: 'n3',
                id: 'n3',
                type: 'alert',
                title: 'Dispute Reported',
                message: 'New dispute reported by Abena Osei',
                read: true,
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        matches: [
            {
                _id: 'm1',
                id: 'm1',
                farmer: {
                    _id: 'f1',
                    name: 'Kwame Mensah',
                },
                investor: 'Agrifund Capital',
                status: 'active',
                approvalStatus: 'approved',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                _id: 'm2',
                id: 'm2',
                farmer: {
                    _id: 'f2',
                    name: 'Abena Osei',
                },
                investor: 'GreenGrowth Partners',
                status: 'pending',
                approvalStatus: 'pending',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        activities: [
            {
                _id: 'a1',
                id: 'a1',
                type: 'farmer_registered',
                description: 'Kwame Mensah registered',
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
                _id: 'a2',
                id: 'a2',
                type: 'farm_visit',
                description: 'Visited Mensah Maize Farm',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        disputes: [
            {
                _id: 'd1',
                id: 'd1',
                farmer: {
                    _id: 'f2',
                    name: 'Abena Osei',
                    region: 'Ashanti',
                },
                investor: 'GreenGrowth Partners',
                type: 'payment',
                severity: 'medium',
                status: 'Pending',
                dateLogged: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                region: 'Ashanti',
                description: 'Payment delay issue',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        pendingQueue: [
            {
                _id: 'pq1',
                id: 'pq1',
                name: 'John Baah',
                status: 'pending',
                region: 'Eastern',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ],
        trainings: [
            {
                _id: 't1',
                id: 't1',
                title: 'Modern Farming Techniques',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                location: 'Accra',
                status: 'upcoming',
            },
        ],
        myTrainings: [],
        timestamp: new Date().toISOString(),
    },
});

// Mock farmers list
export const getMockFarmers = () => ({
    success: true,
    data: [
        {
            _id: 'f1',
            id: 'f1',
            name: 'Kwame Mensah',
            status: 'verified',
            region: 'Greater Accra',
            district: 'Accra',
            community: 'Madina',
            farmType: 'Crop',
            contact: '+233501234567',
        },
        {
            _id: 'f2',
            id: 'f2',
            name: 'Abena Osei',
            status: 'verified',
            region: 'Ashanti',
            district: 'Kumasi',
            community: 'Adum',
            farmType: 'Livestock',
            contact: '+233502345678',
        },
    ],
});

// Mock field visits
export const getMockFieldVisits = () => ({
    success: true,
    data: [],
});

// Mock reports
export const getMockReports = () => ({
    success: true,
    data: [],
});

// Mock scheduled visits
export const getMockScheduledVisits = () => ({
    success: true,
    data: [],
});

// Mock notifications - returns array directly
export const getMockNotifications = () => [
    {
        _id: 'n1',
        id: 'n1',
        type: 'alert',
        title: 'New Farmer Registration',
        message: 'Kwame Mensah has registered and needs verification',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'n2',
        id: 'n2',
        type: 'update',
        title: 'Farm Visit Scheduled',
        message: 'Scheduled visit for Mensah Maize Farm tomorrow',
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: 'n3',
        id: 'n3',
        type: 'alert',
        title: 'Dispute Reported',
        message: 'New dispute reported by Abena Osei',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Get mock response based on URL
export const getMockResponse = (url: string, method: string = 'GET') => {
    if (!isLocalhost()) {
        return null; // Only return mocks on localhost
    }

    const path = url.replace(/^.*\/api/, '');

    switch (path) {
        case '/dashboard/summary':
            return { data: getMockDashboardSummary() };
        case '/farmers':
            return { data: getMockFarmers() };
        case '/field-visits':
            return { data: getMockFieldVisits() };
        case '/reports/agent':
            return { data: getMockReports() };
        case '/scheduled-visits':
            return { data: getMockScheduledVisits() };
        case '/notifications':
            return { data: getMockNotifications() }; // Returns array directly
        case '/agents/profile':
            return {
                data: {
                    id: 'mock-agent-id',
                    name: 'Test Agent',
                    email: 'test@agrilync.com',
                    agentId: 'AGENT001',
                    hasChangedPassword: true,
                    isVerified: true,
                    verificationStatus: 'verified',
                    region: 'Greater Accra',
                    contact: '+233501234567',
                    role: 'agent',
                    status: 'active',
                },
            };
        default:
            return null;
    }
};

export default { getMockResponse, isLocalhost, getMockNotifications };
