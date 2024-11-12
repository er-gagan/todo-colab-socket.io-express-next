// routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/get-user-data', auth, authController.getUserData);

module.exports = router;
