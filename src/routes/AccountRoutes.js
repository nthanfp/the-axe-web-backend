import express from 'express';
import { profile } from '../controllers/AuthController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';

const AccountRoutes = express.Router();

// Rute untuk mengambil profil pengguna yang sedang login
AccountRoutes.get('/profile', authenticateToken, profile);

export default AccountRoutes;