const express = require('express');
const router = express.Router();
const driver = require('../config/neo4j');
const { hashPassword, comparePassword } = require('../utils/hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password and role are required' });
  }

  const session = driver.session();
  try {
    // Check if user exists
    const check = await session.run(
      'MATCH (u {email: $email}) RETURN u LIMIT 1',
      { email }
    );
    if (check.records.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const pwHash = await hashPassword(password);
    const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(); // Faculty, Student, Staff, Alumni

    const result = await session.run(
      `CREATE (u:${label} {name: $name, email: $email, password: $password}) RETURN u`,
      { name, email, password: pwHash }
    );

    const created = result.records[0].get('u').properties;
    res.json({ id: created.email, name: created.name, email: created.email, role: label });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await session.close();
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (u {email: $email}) RETURN labels(u) AS labels, u.password AS password, u.name AS name LIMIT 1',
      { email }
    );
    if (result.records.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const record = result.records[0];
    const pwHash = record.get('password');
    const name = record.get('name');
    const labels = record.get('labels');
    const role = labels && labels.length ? labels[0] : 'User';

    const ok = await comparePassword(password, pwHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ email, name, role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { email, name, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await session.close();
  }
});

// Protected endpoint: get me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  // req.user is set by auth middleware
  const { email } = req.user;
  const session = driver.session();
  try {
    const result = await session.run('MATCH (u {email: $email}) RETURN u, labels(u) AS labels LIMIT 1', { email });
    if (result.records.length === 0) return res.status(404).json({ error: 'User not found' });
    const node = result.records[0].get('u').properties;
    const labels = result.records[0].get('labels');
    res.json({ user: { email: node.email, name: node.name, role: labels[0] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    await session.close();
  }
});

module.exports = router;