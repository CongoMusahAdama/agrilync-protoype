require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');
const xss = require('xss');
const cookieParser = require('cookie-parser');

const app = express();

// Disable x-powered-by for security and to avoid conflicts with newer Express versions
app.disable('x-powered-by');

// 1. Initialise CORS early so it handles preflights before any other middleware
const allowedOrigins = [
    'http://localhost:5173', // Vite dev port
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Broaden localhost support for development (handles 5173, 8080, 4200, etc.)
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

        if (isLocalhost || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

// 2. Body Parser early so req.body exists for following middleware
// Higher limit for media/upload routes — videos can be large
app.use('/api/media', express.json({ limit: '500mb' }));
app.use('/api/media', express.urlencoded({ limit: '500mb', extended: true }));
// Default limit for all other routes
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cookieParser());

// 3. Data sanitization against NoSQL query injection
// Only sanitize body to avoid read-only req.query issues in Express 5
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize(req.body);
    next();
});

// 4. XSS sanitization on body only (xss-clean & hpp are incompatible with Express 5)
// They mutate req.query which is a read-only getter in Express 5
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string') {
            // Skip XSS sanitization for base64 / large binary strings (e.g. uploaded images/videos)
            // XSS is irrelevant for binary data and extremely slow on large strings
            if (obj[key].length > 1_000_000 || obj[key].startsWith('data:')) continue;
            obj[key] = xss(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        }
    }
    return obj;
};

app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    next();
});

// 5. Other Security Middleware
app.use(helmet({
    xPoweredBy: false
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all routes
app.use('/api/', limiter);

// Higher restriction for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // strict limit for login attempts
    message: 'Too many login attempts, please try again after 15 minutes'
});
app.use('/api/auth/login', authLimiter);

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
            'GET /api/scheduled-visits/*',
            'GET /api/tasks/*'
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
    app.use('/api/media', require('./routes/media'));
    console.log('✓ Media routes registered');
    app.use('/api/tasks', require('./routes/taskRoutes'));
    console.log('✓ Tasks routes registered');
    app.use('/api/support', require('./routes/supportRoutes'));
    console.log('✓ Support routes registered');
    app.use('/api/consultations', require('./routes/consultationRoutes'));
    console.log('✓ Consultation routes registered');
    app.use('/api/training-deliveries', require('./routes/trainingDeliveryRoutes'));
    console.log('✓ Training Delivery routes registered');
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

// Detailed Error Handler
app.use((err, req, res, next) => {
    console.error('🔴 [SERVER ERROR]:', err.message);
    console.error(err.stack);
    
    // Ensure we don't crash the server trying to send response headers if already sent
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
