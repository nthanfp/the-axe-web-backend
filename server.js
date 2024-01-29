// Import dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Define routes
// import authRoutes from './src/routes/authRoutes.js';
// app.use('/api/auth', authRoutes);

// Index default
app.use('/', (req, res) => {
  res.status(404).json({ status: 'success', message: 'OK' });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
