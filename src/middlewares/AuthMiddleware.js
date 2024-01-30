import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Middleware untuk verifikasi token JWT
async function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        // Cek apakah user masih ada di database
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token' });
        }

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ status: 'error', message: 'Unauthorized - Invalid token', error });
    }
}

export { authenticateToken };
