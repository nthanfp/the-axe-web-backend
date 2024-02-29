import express from 'express';
import { createTool, getAllTools, getToolById, updateToolById, deleteToolById } from '../controllers/ToolController.js';
import { authenticateToken, checkAdmin } from '../middlewares/AuthMiddleware.js';

const ToolRoutes = express.Router();

// Rute untuk membuat alat baru
ToolRoutes.post('/', authenticateToken, checkAdmin, createTool);

// Rute untuk mendapatkan semua alat
ToolRoutes.get('/', getAllTools);

// Rute untuk mendapatkan alat berdasarkan ID
ToolRoutes.get('/:id', authenticateToken, checkAdmin, getToolById);

// Rute untuk memperbarui alat berdasarkan ID
ToolRoutes.put('/:id', authenticateToken, checkAdmin, updateToolById);

// Rute untuk menghapus alat berdasarkan ID
ToolRoutes.delete('/:id', authenticateToken, checkAdmin, deleteToolById);

export default ToolRoutes;
