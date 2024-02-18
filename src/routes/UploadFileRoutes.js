import express from 'express';

import { uploadImages, uploadVideos } from '../controllers/UploadFileController.js';

const UploadRoutes = express.Router();

UploadRoutes.post('/images', uploadImages);
UploadRoutes.post('/videos', uploadVideos);

export default UploadRoutes;