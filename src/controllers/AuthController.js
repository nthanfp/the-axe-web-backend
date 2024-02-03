import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import User from '../models/UserModel.js';

// Controller untuk registrasi (membuat akun baru)
async function register(req, res) {
    try {
        const { email, password, first_name, last_name, phone } = req.body;

        // Validasi email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ status: 'error', message: 'Invalid email format' });
        }

        // Validasi password
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ status: 'error', message: 'Password should be at least 6 characters long' });
        }

        // Validasi first_name
        if (!first_name) {
            return res.status(400).json({ status: 'error', message: 'First name is required' });
        }

        // Validasi last_name
        if (!last_name) {
            return res.status(400).json({ status: 'error', message: 'Last name is required' });
        }

        // Validasi phone
        if (!phone) {
            return res.status(400).json({ status: 'error', message: 'Phone number is required' });
        }

        // Validasi nomor telepon
        if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
            return res.status(400).json({ status: 'error', message: 'Invalid phone number format' });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered' });
        }

        // Hash password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await User.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            phone
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                uuid: newUser.uuid,
                email: newUser.email
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error', data: error });
    }
}

// Controller untuk login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Bandingkan password yang dimasukkan dengan password di database
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Jika password tidak sesuai
        if (!passwordMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // Buat token JWT
        const token = jwt.sign({ userId: user.uuid }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Perbarui ip_address dan last_login
        const updatedUser = await user.update({
            ip_address: req.ip,
            last_login: new Date(),
        });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                user: updatedUser
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}


async function profile(req, res) {
    try {
        const userId = req.userId;

        // Cari user berdasarkan ID
        const user = await User.findByPk(userId);

        if (user) {
            res.status(200).json({
                status: 'success',
                message: 'Profile retrieved successfully',
                data: {
                    uuid: user.uuid,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    last_login: user.last_login,
                    ip_address: user.ip_address,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

export { register, login, profile };
