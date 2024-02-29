import express from 'express';
import { createTool, getAllTools, getToolById, updateToolById, deleteToolById } from '../controllers/ToolController.js';
import { authenticateToken, checkAdmin } from '../middlewares/AuthMiddleware.js';

const ToolRoutes = express.Router();

ToolRoutes.get('/', getAllTools);
ToolRoutes.get('/:id', getToolById);

export default ToolRoutes;
