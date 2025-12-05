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

// Configure CORS - Allow all origins for mobile app development
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        // Allow all origins for mobile app compatibility
        return callback(null, true);
    },
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
