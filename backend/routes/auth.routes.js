const express = require('express');
const router = express.Router();
const { users } = require('../data/store');

// Step 1: User Registration
router.post('/register', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    age: null,
    standard: null,
    hasCompletedAssessment: false,
    results: null
  };

  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Step 2: Student Profile Capture
router.post('/profile', (req, res) => {
  const { email, age, standard } = req.body;

  if (!email || !age || !standard) {
    return res.status(400).json({ error: 'Email, age, and standard are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.age = age;
  user.standard = standard;

  return res.status(200).json({ message: 'Profile captured successfully', user });
});

// Get User Profile
router.get('/:email', (req, res) => {
  const user = users.find(u => u.email === req.params.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user });
});

module.exports = router;

