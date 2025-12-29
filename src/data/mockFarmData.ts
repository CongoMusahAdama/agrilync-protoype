export interface FieldReport {
    id: string;
    date: string;
    condition: 'Good' | 'Fair' | 'Poor';
    notes: string;
    images: string[];
    agentName: string;
}

export interface Farmer {
    id: string;
    name: string;
    phone: string;
    region: string;
    district: string;
    community: string;
    farmType: 'Crop' | 'Livestock';
    category: string;
    landSize: number;
    experience: number;
    status: 'Pending' | 'Completed' | 'Matched' | 'In Progress';
    lastVisit: string;
    gpsCoordinates?: { lat: number; lng: number };
    idNumber?: string;
    photos: string[];
    investmentMatched: boolean;
    reports: FieldReport[];
    gender?: string;
    investmentAmount?: number;
}

export const mockFarmers: Farmer[] = [
    {
        id: '1',
        name: 'Kwame Mensah',
        phone: '+233 24 123 4567',
        region: 'Ashanti',
        district: 'Kumasi Metro',
        community: 'Bantama',
        farmType: 'Crop',
        category: 'Maize',
        landSize: 5.5,
        experience: 8,
        status: 'Completed',
        lastVisit: '2024-11-28',
        gpsCoordinates: { lat: 6.6666, lng: -1.6163 },
        idNumber: 'GHA-123456789-0',
        photos: ['/farm-photos/farm1.jpg'],
        investmentMatched: true,
        investmentAmount: 15000,
        gender: 'Male',
        reports: [
            {
                id: 'r1',
                date: '2024-11-28',
                condition: 'Good',
                notes: 'Farm is well maintained. Maize crop showing healthy growth.',
                images: [],
                agentName: 'John Doe'
            }
        ]
    },
    {
        id: '2',
        name: 'Akua Boatemaa',
        phone: '+233 55 987 6543',
        region: 'Eastern',
        district: 'Koforidua',
        community: 'Effiduase',
        farmType: 'Livestock',
        category: 'Poultry',
        landSize: 2.0,
        experience: 4,
        status: 'Matched',
        lastVisit: '2024-12-01',
        photos: ['/farm-photos/farm2.jpg'],
        investmentMatched: true,
        investmentAmount: 8000,
        gender: 'Female',
        reports: []
    },
    {
        id: '3',
        name: 'Yaw Osei',
        phone: '+233 20 555 1234',
        region: 'Western',
        district: 'Takoradi Metro',
        community: 'Market Circle',
        farmType: 'Crop',
        category: 'Cocoa',
        landSize: 10.0,
        experience: 15,
        status: 'In Progress',
        lastVisit: '2024-11-25',
        gpsCoordinates: { lat: 4.8967, lng: -1.7575 },
        photos: [],
        investmentMatched: true,
        investmentAmount: 25000,
        gender: 'Male',
        reports: [
            {
                id: 'r2',
                date: '2024-11-25',
                condition: 'Fair',
                notes: 'Some pest issues detected. Recommended treatment applied.',
                images: [],
                agentName: 'Jane Smith'
            }
        ]
    },
    {
        id: '4',
        name: 'Ama Addo',
        phone: '+233 24 789 0123',
        region: 'Greater Accra',
        district: 'Accra Metro',
        community: 'Madina',
        farmType: 'Crop',
        category: 'Vegetables',
        landSize: 1.5,
        experience: 3,
        status: 'Pending',
        lastVisit: '2024-11-20',
        photos: [],
        investmentMatched: false,
        gender: 'Female',
        reports: []
    },
    {
        id: '5',
        name: 'Kofi Antwi',
        phone: '+233 26 444 5678',
        region: 'Volta',
        district: 'Ho Municipal',
        community: 'Hliha',
        farmType: 'Livestock',
        category: 'Goats',
        landSize: 3.0,
        experience: 6,
        status: 'Completed',
        lastVisit: '2024-11-30',
        gpsCoordinates: { lat: 6.6107, lng: 0.4710 },
        idNumber: 'GHA-987654321-0',
        photos: ['/farm-photos/farm5.jpg'],
        investmentMatched: false,
        gender: 'Male',
        reports: []
    },
    {
        id: '6',
        name: 'Abena Takyi',
        phone: '+233 54 321 9876',
        region: 'Central',
        district: 'Cape Coast Metro',
        community: 'Pedu',
        farmType: 'Crop',
        category: 'Cassava',
        landSize: 4.0,
        experience: 10,
        status: 'Matched',
        lastVisit: '2024-11-27',
        photos: ['/farm-photos/farm6.jpg'],
        investmentMatched: true,
        investmentAmount: 12000,
        gender: 'Female',
        reports: []
    },
    {
        id: '7',
        name: 'Kwabena Owusu',
        phone: '+233 27 111 2222',
        region: 'Ashanti',
        district: 'Obuasi Municipal',
        community: 'Tutuka',
        farmType: 'Crop',
        category: 'Maize',
        landSize: 7.5,
        experience: 12,
        status: 'Completed',
        lastVisit: '2024-11-29',
        gpsCoordinates: { lat: 6.2009, lng: -1.6642 },
        photos: [],
        investmentMatched: false,
        gender: 'Male',
        reports: []
    },
    {
        id: '8',
        name: 'Efua Mensah',
        phone: '+233 23 567 8901',
        region: 'Northern',
        district: 'Tamale Municipal',
        community: 'Zogbeli',
        farmType: 'Livestock',
        category: 'Cattle',
        landSize: 20.0,
        experience: 20,
        status: 'In Progress',
        lastVisit: '2024-11-22',
        photos: ['/farm-photos/farm8.jpg'],
        investmentMatched: true,
        investmentAmount: 50000,
        gender: 'Female',
        reports: []
    }
];

export const regions = [
    'Ashanti',
    'Greater Accra',
    'Eastern',
    'Western',
    'Central',
    'Volta',
    'Northern',
    'Upper East',
    'Upper West',
    'Brong-Ahafo'
];

export const farmCategories = {
    Crop: ['Maize', 'Cocoa', 'Cassava', 'Vegetables', 'Rice', 'Yam', 'Plantain'],
    Livestock: ['Poultry', 'Goats', 'Sheep', 'Cattle', 'Pigs', 'Fish']
};
