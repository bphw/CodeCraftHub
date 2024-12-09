const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login an existing use
router.post('/login', loginUser);

// Update user profile (protected route)
router.put('/:id', authMiddleware, userController.updateUserProfile);

// Optional: Add more routes for getting user profile, deleting user, etc.
// router.get('/:id', authMiddleware, userController.getUserProfile);
// router.delete('/:id', authMiddleware, userController.

module.exports = router;