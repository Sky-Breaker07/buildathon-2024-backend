const express = require('express');
const router = express.Router();
const authenticateStaff = require('../middleware/authentication');
const { login, resetPassword, updatePassword, getCurrentUser } = require('../controllers/auth');

// Public routes
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Protected routes
router.patch('/update-password', authenticateStaff, updatePassword);
router.get('/current-user', authenticateStaff, getCurrentUser);

module.exports = router;
