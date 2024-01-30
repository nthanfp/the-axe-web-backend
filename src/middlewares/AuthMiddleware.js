import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Middleware untuk verifikasi token JWT
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

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token (2)', error });
    }
}

export { authenticateToken };
