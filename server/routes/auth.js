const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { db } = require('../config/database');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Error del servidor' });
      }

      if (user) {
        return res.status(400).json({ msg: 'El usuario ya existe' });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name],
        function(err) {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Error del servidor' });
          }

          const userId = this.lastID;

          // Create JWT
          const payload = {
            user: {
              id: userId
            }
          };

          if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'JWT_SECRET no configurado' });
          }

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Aumentar a 7 días
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
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Error del servidor' });
      }

      if (!user) {
        return res.status(400).json({ msg: 'Credenciales inválidas' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Credenciales inválidas' });
      }

      // Create JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ msg: 'JWT_SECRET no configurado' });
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }, // Aumentar a 7 días
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
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
  db.get('SELECT id, email, name, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Error del servidor' });
    }

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(user);
  });
});

module.exports = router;
