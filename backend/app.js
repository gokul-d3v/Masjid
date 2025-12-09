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

// Configure CORS - Allow all origins including mobile apps and web apps
app.use(cors({
    origin: [
        "https://masjid-three.vercel.app",  // Web frontend
        "https://masjidapp--c9hak4oafw.expo.app",  // Expo mobile app
        "exp://*",  // Expo development
        "https://exp.host",  // Expo hosting
        "http://localhost:8081", // Mobile app development
        "*"
    ],
    credentials: true
}));


app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/members', memberRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);

module.exports = app;
