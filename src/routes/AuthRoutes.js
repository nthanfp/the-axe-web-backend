import express from 'express';
import { register, login, profile } from '../controllers/AuthController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', register);
AuthRoutes.post('/login', login);

// Rute untuk mengambil profil pengguna yang sedang login
AuthRoutes.get('/profile', authenticateToken, profile);

export default AuthRoutes;
