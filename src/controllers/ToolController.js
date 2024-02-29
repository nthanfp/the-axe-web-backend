import Tool from '../models/ToolModel.js';
import validator from 'validator';

// Validasi data alat
async function validateToolData(name, slug, description) {
    const errors = [];

    if (!name || !slug || !description) {
        errors.push('All fields are required');
    } else {
        if (!validator.isLength(name, { min: 1, max: 255 })) {
            errors.push('Name must be between 1 and 255 characters');
        }

        if (!validator.isLength(slug, { min: 1, max: 255 })) {
            errors.push('Slug must be between 1 and 255 characters');
        }

        if (!validator.isLength(description, { min: 1, max: 525 })) {
            errors.push('Description must be between 1 and 525 characters');
        }
    }

    return errors;
}


// Controller untuk membuat alat baru
async function createTool(req, res) {
    const { name, slug, description } = req.body;

    console.log(req.body);

    // Validasi data alat
    const validationErrors = validateToolData(name, slug, description);
    if (validationErrors.length > 0) {
        return res.status(400).json({ status: 'error', message: validationErrors.join(', ') });
    }

    try {
        const newTool = await Tool.create({ name, slug, description });
        res.status(201).json({ status: 'success', message: 'Tool created successfully', data: newTool });
    } catch (error) {
        console.error('Error creating tool:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mendapatkan semua alat
async function getAllTools(req, res) {
    try {
        const tools = await Tool.findAll();
        res.status(200).json({ status: 'success', message: 'Tools retrieved successfully', data: tools });
    } catch (error) {
        console.error('Error getting tools:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mendapatkan alat berdasarkan ID
async function getToolById(req, res) {
    const toolId = req.params.id;
    try {
        const tool = await Tool.findByPk(toolId);
        if (tool) {
            res.status(200).json({ status: 'success', message: 'Tool retrieved successfully', data: tool });
        } else {
            res.status(404).json({ status: 'error', message: 'Tool not found' });
        }
    } catch (error) {
        console.error('Error getting tool by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk memperbarui alat berdasarkan ID
async function updateToolById(req, res) {
    const toolId = req.params.id;
    const { name, slug, description } = req.body;

    // Validasi data alat
    const validationErrors = validateToolData(name, slug, description);
    if (validationErrors.length > 0) {
        return res.status(400).json({ status: 'error', message: validationErrors.join(', ') });
    }

    try {
        const tool = await Tool.findByPk(toolId);
        if (tool) {
            await tool.update({ name, slug, description });
            res.status(200).json({ status: 'success', message: 'Tool updated successfully', data: tool });
        } else {
            res.status(404).json({ status: 'error', message: 'Tool not found' });
        }
    } catch (error) {
        console.error('Error updating tool by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk menghapus alat berdasarkan ID
async function deleteToolById(req, res) {
    const toolId = req.params.id;
    try {
        const tool = await Tool.findByPk(toolId);
        if (tool) {
            await tool.destroy();
            res.status(200).json({ status: 'success', message: 'Tool deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', message: 'Tool not found' });
        }
    } catch (error) {
        console.error('Error deleting tool by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

export { createTool, getAllTools, getToolById, updateToolById, deleteToolById };
