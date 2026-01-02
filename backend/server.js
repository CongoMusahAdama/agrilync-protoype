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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/agents', require('./routes/agentRoutes'));
app.use('/api/farmers', require('./routes/farmerRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/disputes', require('./routes/disputeRoutes'));
app.use('/api/trainings', require('./routes/trainingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/field-visits', require('./routes/fieldVisitRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
