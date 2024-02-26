import express from 'express';

import { uploadImages, uploadVideos } from '../controllers/UploadFileController.js';
import { authenticateToken } from '../middlewares/AuthMiddleware.js';

const UploadRoutes = express.Router();

UploadRoutes.post('/images', authenticateToken, uploadImages);
UploadRoutes.post('/videos', uploadVideos);

export default UploadRoutes;