// routes/index.js

const express = require('express');
const authRoutes = require('./authRoutes');
const todoRoutes = require('./todoRoutes');
const userRoutes = require('./userRoutes');
const router = express.Router();

// Set up authentication routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// Set up todo routes
router.use('/todos', todoRoutes);

module.exports = router;
