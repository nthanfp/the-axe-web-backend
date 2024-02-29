import express from 'express';

import { getAllProjects, getProjectById } from '../controllers/ProjectController.js';

const ProjectRoutes = express.Router();

ProjectRoutes.get('/', getAllProjects);
ProjectRoutes.get('/:id', getProjectById);

export default ProjectRoutes;
