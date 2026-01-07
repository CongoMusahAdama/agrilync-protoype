require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrilync';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('AgriLync Agent API is running...');
});

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'AgriLync API is running',
        timestamp: new Date().toISOString()
    });
});

// Route info endpoint (no auth required) - for debugging
app.get('/api/routes', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Available API routes',
        routes: [
            'GET /api/health',
            'GET /api/routes',
            'GET /api/dashboard/test',
            'GET /api/dashboard/summary (auth required)',
            'POST /api/dashboard/refresh (auth required)',
            'POST /api/auth/login',
            'GET /api/agents/*',
            'GET /api/farmers/*',
            'GET /api/farms/*',
            'GET /api/matches/*',
            'GET /api/disputes/*',
            'GET /api/trainings/*',
            'GET /api/notifications/*',
            'GET /api/activities/*',
            'GET /api/field-visits/*',
            'GET /api/reports/*',
            'GET /api/opportunities/*',
            'GET /api/super-admin/*',
            'GET /api/scheduled-visits/*'
        ],
        timestamp: new Date().toISOString()
    });
});

// Routes
try {
    console.log('Registering routes...');
    app.use('/api/auth', require('./routes/authRoutes'));
    console.log('✓ Auth routes registered');
    app.use('/api/agents', require('./routes/agentRoutes'));
    console.log('✓ Agent routes registered');
    app.use('/api/farmers', require('./routes/farmerRoutes'));
    console.log('✓ Farmer routes registered');
    app.use('/api/farms', require('./routes/farmRoutes'));
    console.log('✓ Farm routes registered');
    app.use('/api/matches', require('./routes/matchRoutes'));
    console.log('✓ Match routes registered');
    app.use('/api/disputes', require('./routes/disputeRoutes'));
    console.log('✓ Dispute routes registered');
    app.use('/api/trainings', require('./routes/trainingRoutes'));
    console.log('✓ Training routes registered');
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    console.log('✓ Notification routes registered');
    app.use('/api/activities', require('./routes/activityRoutes'));
    console.log('✓ Activity routes registered');
    app.use('/api/field-visits', require('./routes/fieldVisitRoutes'));
    console.log('✓ Field visit routes registered');
    app.use('/api/reports', require('./routes/reportRoutes'));
    console.log('✓ Report routes registered');
    
    // Register dashboard routes with explicit error handling
    try {
        const dashboardRoutes = require('./routes/dashboardRoutes');
        app.use('/api/dashboard', dashboardRoutes);
        console.log('✓ Dashboard routes registered successfully');
    } catch (dashboardError) {
        console.error('✗ Error loading dashboard routes:', dashboardError);
        throw dashboardError;
    }
    
    app.use('/api/opportunities', require('./routes/opportunityRoutes'));
    console.log('✓ Opportunity routes registered');
    app.use('/api/super-admin', require('./routes/superAdminRoutes'));
    console.log('✓ Super admin routes registered');
    app.use('/api/scheduled-visits', require('./routes/scheduledVisitRoutes'));
    console.log('✓ Scheduled visit routes registered');
    console.log('✓ All routes registered successfully');
} catch (error) {
    console.error('✗ Error registering routes:', error);
    console.error('✗ Error stack:', error.stack);
    process.exit(1);
}

// 404 handler for API routes - catch all unmatched /api routes
app.use(/^\/api\/.*/, (req, res) => {
    console.log(`[404] API route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `API route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            '/api/health',
            '/api/dashboard/test',
            '/api/auth/login',
            '/api/dashboard/summary'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
