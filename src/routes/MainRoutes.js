// routes.js
import express from 'express';
import { register, login, profile } from './controllers/AuthController.js';
import { changePassword, profile as accountProfile, updateApiKey, updateProfile } from './controllers/AccountController.js';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, validateUserInput } from './controllers/UserController.js';
import { uploadImages, uploadVideos } from './controllers/UploadFileController.js';
import { authenticateToken, checkAdmin } from './middlewares/AuthMiddleware.js';

const AppRoutes = express.Router();

// Authentication routes
AppRoutes.post('/auth/register', register);
AppRoutes.post('/auth/login', login);
AppRoutes.get('/auth/profile', authenticateToken, profile);

// Account routes
AppRoutes.get('/account/profile', authenticateToken, accountProfile);
AppRoutes.post('/account/profile', authenticateToken, updateProfile);
AppRoutes.post('/account/change-password', authenticateToken, changePassword);
AppRoutes.post('/account/update-api-key', authenticateToken, updateApiKey);

// Admin routes
AppRoutes.post('/admin/users', authenticateToken, checkAdmin, validateUserInput, createUser);
AppRoutes.get('/admin/users', authenticateToken, checkAdmin, getAllUsers);
AppRoutes.get('/admin/users/:id', authenticateToken, checkAdmin, getUserById);
AppRoutes.put('/admin/users/:id', authenticateToken, checkAdmin, updateUserById);
AppRoutes.delete('/admin/users/:id', authenticateToken, checkAdmin, deleteUserById);

// Upload routes
AppRoutes.post('/uploads/images', authenticateToken, uploadImages);
AppRoutes.post('/uploads/videos', authenticateToken, uploadVideos);

export default AppRoutes;
