const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * Membuat JSON Web Token (JWT) untuk user.
 * @param {number} id - ID dari user.
 * @returns {string} - Token JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token akan valid selama 30 hari
  });
};

/**
 * @desc    Mendaftarkan user baru
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Semua field (username, email, password) wajib diisi.' });
    }

    try {
        const userExists = await User.findOne({
            where: { [Op.or]: [{ email: email }, { username: username }] }
        });
        
        if (userExists) {
            return res.status(400).json({ message: 'Username atau email ini sudah terdaftar.' });
        }

        const user = await User.create({ username, email, password, role: 'user' });

        if (user) {
            res.status(201).json({
                message: 'Registrasi berhasil!',
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: messages.join(' ') });
        }
        console.error("REGISTER SERVER ERROR:", error);
        res.status(500).json({ message: 'Terjadi kesalahan di server. Silakan coba lagi nanti.' });
    }
};

/**
 * @desc    Autentikasi user & mendapatkan token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi.' });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (user && (await user.validPassword(password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Username atau password salah.' });
        }
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Mendapatkan profil user yang sedang login
 * @route   GET /api/user-profile (Contoh)
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User tidak ditemukan.' });
    }
};