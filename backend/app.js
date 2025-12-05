const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const dashboardRoutes = require('./routes/dashboard');
const memberRoutes = require('./routes/members');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');

const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS based on environment
if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin) return callback(null, true);

            // List of allowed origins
            const allowedOrigins = [
                'https://masjid-three.vercel.app',
                'http://localhost:8081', // Expo web
                'http://localhost:19006', // Alternative Expo web port
            ];

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true); // Allow all origins for mobile app compatibility
            }
        },
        credentials: true
    }));
} else {
    // Allow all origins during development to handle various device configurations
    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            // Allow all origins during development
            return callback(null, true);
        },
        credentials: true
    }));
}

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/members', memberRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);

module.exports = app;
