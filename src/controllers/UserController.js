import validator from 'validator';
import { Op } from 'sequelize';

import User from '../models/UserModel.js';

async function createUser(req, res) {
    try {
        const { email, password, first_name, last_name, phone, ip_address } = req.body;

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email is already registered' });
        }

        // Buat pengguna baru jika email belum terdaftar
        const newUser = await User.create({
            email,
            password,
            first_name,
            last_name,
            phone,
            ip_address,
        });

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ status: 'error', message: `Internal Server Error - ${error}` });
    }
}

// Controller untuk mendapatkan semua user
async function getAllUsers(req, res) {
    try {
        const users = await User.findAll();

        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// get smeua user datatables
async function getAllUserDatatables(req, res) {
    try {
        const { draw, start, length, search, order } = req.query;

        // Periksa apakah order telah didefinisikan dengan benar
        if (!order || !Array.isArray(order) || order.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Invalid order parameter' });
        }

        const { column, dir } = order[0];

        // Query untuk pencarian
        const whereCondition = search.value ? {
            [Op.or]: [
                { email: { [Op.like]: `%${search.value}%` } },
                { first_name: { [Op.like]: `%${search.value}%` } },
                { last_name: { [Op.like]: `%${search.value}%` } },
                { phone: { [Op.like]: `%${search.value}%` } },
            ]
        } : {};

        // Jumlah total data tanpa filter
        const totalRecords = await User.count();

        // Jumlah total data dengan filter pencarian
        const filteredRecords = await User.count({ where: whereCondition });

        // Query untuk pengurutan dan pembatasan hasil
        const users = await User.findAll({
            where: whereCondition,
            order: [[column, dir]],
            offset: parseInt(start),
            limit: parseInt(length)
        });

        // Format data sesuai dengan spesifikasi DataTables
        const data = users.map(user => ({
            uuid: user.uuid,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            ip_address: user.ip_address,
            role: user.role,
        }));

        // Response ke DataTables
        res.status(200).json({
            draw: parseInt(draw),
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: data
        });
    } catch (error) {
        console.error('Error getting users for DataTables:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mendapatkan detail user berdasarkan ID
async function getUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);

        if (user) {
            res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: user,
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk mengupdate user berdasarkan ID
async function updateUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);

        if (user) {
            const { email, password, first_name, last_name, phone, ip_address } = req.body;
            await user.update({
                email,
                password,
                first_name,
                last_name,
                phone,
                ip_address,
            });

            res.status(200).json({
                status: 'success',
                message: 'User updated successfully',
                data: user,
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

// Controller untuk menghapus user berdasarkan ID
async function deleteUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);

        if (user) {
            await user.destroy();

            res.status(200).json({
                status: 'success',
                message: 'User deleted successfully',
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user by ID:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

async function validateUserInput(req, res, next) {
    const { email, password, first_name, last_name, phone, ip_address } = req.body;

    // Periksa apakah properti email tersedia dalam req.body
    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    // Validasi email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email format' });
    }

    // Periksa apakah properti password tersedia dalam req.body
    if (!password) {
        return res.status(400).json({ status: 'error', message: 'Password is required' });
    }

    // Validasi password
    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ status: 'error', message: 'Password should be at least 6 characters long' });
    }

    // Periksa apakah properti first_name tersedia dalam req.body
    if (!first_name) {
        return res.status(400).json({ status: 'error', message: 'First name is required' });
    }

    // Validasi nama depan
    if (!validator.isLength(first_name, { min: 1 })) {
        return res.status(400).json({ status: 'error', message: 'First name should not be empty' });
    }

    // Periksa apakah properti last_name tersedia dalam req.body
    if (!last_name) {
        return res.status(400).json({ status: 'error', message: 'Last name is required' });
    }

    // Validasi nama belakang
    if (!validator.isLength(last_name, { min: 1 })) {
        return res.status(400).json({ status: 'error', message: 'Last name should not be empty' });
    }

    // Periksa apakah properti phone tersedia dalam req.body
    if (!phone) {
        return res.status(400).json({ status: 'error', message: 'Phone number is required' });
    }

    // Validasi nomor telepon
    if (!validator.isNumeric(phone)) {
        return res.status(400).json({ status: 'error', message: 'Phone must contain only numbers' });
    }

    next(); // Lanjutkan jika semua properti tersedia dan valid
}


export { validateUserInput, createUser, getAllUsers, getAllUserDatatables, getUserById, updateUserById, deleteUserById };
