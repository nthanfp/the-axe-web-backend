// Import dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import moment from 'moment-timezone';

// Import modules
import AdminRoutes from './src/routes/AdminRoutes.js';
import AuthRoutes from './src/routes/AuthRoutes.js';
import AccountRoutes from './src/routes/AccountRoutes.js';
import UploadRoutes from './src/routes/UploadFileRoutes.js';
import ToolRoutes from './src/routes/ToolRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Server configuration
moment.tz.setDefault('Asia/Jakarta');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Define routes
app.use('/api/auth', AuthRoutes);
app.use('/api/account', AccountRoutes);
app.use('/api/uploads', UploadRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/tools', ToolRoutes);

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
