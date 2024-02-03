import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import User from '../models/UserModel.js';

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

async function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const { first_name, last_name, phone } = req.body;

        // Cari user berdasarkan ID
        const user = await User.findByPk(userId);

        if (user) {
            // Validasi data yang diperlukan
            if (!first_name && !last_name && !phone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'At least one field (first_name, last_name, phone) must be provided for update',
                });
            }

            // Update data profil
            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            user.phone = phone || user.phone;

            // Simpan perubahan
            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'Profile updated successfully',
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
        console.error('Error updating user profile:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}

async function changePassword(req, res) {
    try {
        const user_id = req.userId;
        const { current_password, new_password, confirm_password } = req.body;

        // Cari user berdasarkan ID
        const user = await User.findByPk(user_id);

        if (user) {
            // Validasi kolom yang diperlukan diisi
            if (!current_password || !new_password || !confirm_password) {
                return res.status(400).json({ status: 'error', message: 'All fields are required' });
            }
            
            // Validasi kata sandi saat ini
            const passwordMatch = await bcrypt.compare(current_password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ status: 'error', message: 'Current password is incorrect' });
            }

            // Validasi kata sandi baru
            if (!validator.isLength(new_password, { min: 6 })) {
                return res.status(400).json({ status: 'error', message: 'New password should be at least 6 characters long' });
            }

            // Validasi konfirmasi kata sandi
            if (new_password !== confirm_password) {
                return res.status(400).json({ status: 'error', message: 'New password and confirm password do not match' });
            }

            // Hash kata sandi baru sebelum disimpan
            const hashedNewPassword = await bcrypt.hash(new_password, 10);

            // Update kata sandi
            user.password = hashedNewPassword;

            // Simpan perubahan
            await user.save();

            res.status(200).json({
                status: 'success',
                message: 'Password changed successfully',
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
}


export { profile, updateProfile, changePassword };
