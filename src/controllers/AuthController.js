import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Controller untuk registrasi (membuat akun baru)
async function register(req, res) {
    try {
        const { email, password } = req.body;

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
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: newUser,
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { token },
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
          data: user,
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
