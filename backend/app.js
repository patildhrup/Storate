const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const storeRoutes = require('./src/routes/storeRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Store Rating Management API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
