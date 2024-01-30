import User from '../models/UserModel.js';

// Controller untuk membuat user baru
async function createUser(req, res) {
    try {
        const { email, password, first_name, last_name, phone, ip_address } = req.body;
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
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
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

export { createUser, getAllUsers, getUserById, updateUserById, deleteUserById };
