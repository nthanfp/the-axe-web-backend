import express from 'express';

import { authenticateToken } from '../middlewares/AuthMiddleware.js';
import { changePassword, profile, updateProfile } from '../controllers/AccountController.js';

const AccountRoutes = express.Router();

// Rute untuk mengambil profil pengguna yang sedang login
AccountRoutes.get('/profile', authenticateToken, profile);
AccountRoutes.post('/profile', authenticateToken, updateProfile);
AccountRoutes.post('/change-password', authenticateToken, changePassword);

export default AccountRoutes;