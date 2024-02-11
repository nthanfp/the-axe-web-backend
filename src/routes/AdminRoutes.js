import express from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById, validateUserInput } from '../controllers/userController.js';
import { authenticateToken, checkAdmin } from '../middlewares/AuthMiddleware.js';

const AdminRoutes = express.Router();

// Manage user
AdminRoutes.post('/users', authenticateToken, checkAdmin, validateUserInput, createUser);
AdminRoutes.get('/users', authenticateToken, checkAdmin, getAllUsers);
AdminRoutes.get('/users/:id', authenticateToken, checkAdmin, getUserById);
AdminRoutes.put('/users/:id', authenticateToken, checkAdmin, updateUserById);
AdminRoutes.delete('/users/:id', authenticateToken, checkAdmin, deleteUserById);

export default AdminRoutes;
