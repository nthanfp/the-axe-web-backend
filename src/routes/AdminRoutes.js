import express from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, validateUserInput } from '../controllers/userController.js';
import { authenticateToken, checkAdmin } from '../middlewares/AuthMiddleware.js';
import { createTool, deleteToolById, getAllTools, getToolById, updateToolById } from '../controllers/ToolController.js';

const AdminRoutes = express.Router();

// Manage user
AdminRoutes.post('/users', authenticateToken, checkAdmin, validateUserInput, createUser);
AdminRoutes.get('/users', authenticateToken, checkAdmin, getAllUsers);
AdminRoutes.get('/users/:id', authenticateToken, checkAdmin, getUserById);
AdminRoutes.put('/users/:id', authenticateToken, checkAdmin, updateUserById);
AdminRoutes.delete('/users/:id', authenticateToken, checkAdmin, deleteUserById);

// Rute untuk membuat alat baru
AdminRoutes.post('/tools/', authenticateToken, checkAdmin, createTool);
AdminRoutes.get('/tools/', authenticateToken, checkAdmin, getAllTools);
AdminRoutes.get('/tools/:id', authenticateToken, checkAdmin, getToolById);
AdminRoutes.put('/tools/:id', authenticateToken, checkAdmin, updateToolById);
AdminRoutes.delete('/tools/:id', authenticateToken, checkAdmin, deleteToolById);

export default AdminRoutes;
