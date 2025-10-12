const express = require('express');
const router = express.Router();
// Import the model instead of the driver
const graphModel = require('../models/graphModel'); 
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register route - NOW USES THE MODEL
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'name, email, password and role are required' });
    }

    try {
        // Step 1: Check if user exists using the model
        const existingUser = await graphModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const pwHash = await hashPassword(password);
        const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        // Step 2: Create the new user using the model
        const createdUser = await graphModel.createNode(label, { name, email, password: pwHash });

        res.json({ id: createdUser.email, name: createdUser.name, email: createdUser.email, role: label });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login route - NOW USES THE MODEL
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    try {
        // Step 1: Find the user by email using the model
        const user = await graphModel.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Step 2: Compare passwords
        const ok = await comparePassword(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Step 3: Sign the token
        const payload = { email: user.email, name: user.name, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, user: payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Protected endpoint: get me - NOW USES THE MODEL
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
    // req.user is set by auth middleware
    const { email } = req.user;
    try {
        const user = await graphModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Exclude password from the response
        res.json({ user: { email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;