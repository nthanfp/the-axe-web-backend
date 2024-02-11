import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Middleware untuk verifikasi token JWT dan periksa peran pengguna
async function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized - No token provided' });
    }

    try {
        const cleanedToken = token.replace(/^Bearer\s/, '');
        const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded);
        console.log('UUID: ', decoded.userId);

        req.userId = decoded.userId;

        // Cek apakah user masih ada di database
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token (1)' });
        }

        // Periksa peran pengguna
        if (user.role === 'ADMIN') {
            req.isAdmin = true;
            next(); // Jika pengguna adalah ADMIN, lanjutkan dengan middleware berikutnya
        } else if (user.role === 'MEMBER') {
            req.isAdmin = false;
            next(); // Jika pengguna adalah MEMBER, lanjutkan dengan middleware berikutnya
        } else {
            return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid role' });
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token (2)', error });
    }
}

// Middleware untuk memeriksa apakah pengguna adalah ADMIN
async function checkAdmin(req, res, next) {
    if (req.isAdmin) {
        next(); // Jika pengguna adalah ADMIN, lanjutkan dengan middleware berikutnya
    } else {
        res.status(401).json({ status: 'error', message: 'Unauthorized - Access denied, Admin role required' });
    }
}

// Middleware untuk memeriksa apakah pengguna adalah MEMBER
async function checkMember(req, res, next) {
    if (!req.isAdmin) {
        next(); // Jika pengguna adalah MEMBER, lanjutkan dengan middleware berikutnya
    } else {
        res.status(401).json({ status: 'error', message: 'Unauthorized - Access denied, Member role required' });
    }
}

export { authenticateToken, checkAdmin, checkMember };