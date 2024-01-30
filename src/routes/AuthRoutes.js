import express from 'express';
import { register, login, profile } from '../controllers/AuthController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Rute untuk mengambil profil pengguna yang sedang login
router.get('/profile', authenticateToken, profile);

export default router;
