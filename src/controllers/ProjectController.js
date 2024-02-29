import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Project from '../models/ProjectModel.js';

// Konfigurasi penyimpanan file menggunakan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'public', 'uploads', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Membuat instance multer
const upload = multer({ storage: storage });

// Controller untuk membuat proyek baru
async function createProject(req, res) {
    const { name, description, external_url } = req.body;
    const status = req.body.status || 'ON';

    // Cek apakah ada file yang diunggah
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'Image file is required' });
    }

    const image_path = path.join('/uploads/images', req.file.filename);

    try {
        const newProject = await Project.create({ name, description, external_url, image_path, status });
        res.status(201).json({ status: 'success', message: 'Project created successfully', data: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mendapatkan semua proyek
async function getAllProjects(req, res) {
    try {
        const projects = await Project.findAll();
        res.status(200).json({ status: 'success', message: 'Projects retrieved successfully', data: projects });
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mendapatkan proyek berdasarkan ID
async function getProjectById(req, res) {
    const projectId = req.params.id;
    try {
        const project = await Project.findByPk(projectId);
        if (project) {
            res.status(200).json({ status: 'success', message: 'Project retrieved successfully', data: project });
        } else {
            res.status(404).json({ status: 'error', message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error getting project by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk memperbarui proyek berdasarkan ID
async function updateProjectById(req, res) {
    const projectId = req.params.id;
    const { name, description, external_url, status } = req.body;

    try {
        let image_path = null;

        // Cek apakah ada file yang diunggah
        if (req.file) {
            image_path = path.join('/uploads/images', req.file.filename);
        } else {
            // Jika tidak ada file yang diunggah, gunakan image_path yang lama
            const project = await Project.findByPk(projectId);
            if (project) {
                image_path = project.image_path;
            }
        }

        const project = await Project.findByPk(projectId);
        if (project) {
            // Hapus file gambar lama jika ada dan ada file baru yang diunggah
            if (project.image_path && req.file) {
                fs.unlinkSync(path.join(process.cwd(), 'public', project.image_path));
            }

            // Update proyek dengan data baru
            await project.update({ name, description, external_url, image_path, status });
            res.status(200).json({ status: 'success', message: 'Project updated successfully', data: project });
        } else {
            res.status(404).json({ status: 'error', message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error updating project by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk menghapus proyek berdasarkan ID
async function deleteProjectById(req, res) {
    const projectId = req.params.id;
    try {
        const project = await Project.findByPk(projectId);
        if (project) {
            await project.destroy();
            res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error deleting project by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

export { createProject, getAllProjects, getProjectById, updateProjectById, deleteProjectById, upload };
