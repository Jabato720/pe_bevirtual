const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { pool } = require('../config/database-pg');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name, company_name } = req.body;

  try {
    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Validate required fields
    if (!email || !password || !company_name) {
      return res.status(400).json({ msg: 'Email, password y nombre de empresa son obligatorios' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, name, company_name) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, name, company_name]
    );

    const userId = newUser.rows[0].id;

    // Create JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET no configurado' });
    }

    const payload = {
      user: {
        id: userId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Enviar token también como cookie httpOnly
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });
        
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Create JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT_SECRET no configurado' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Enviar token también como cookie httpOnly
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });
        
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, company_name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;