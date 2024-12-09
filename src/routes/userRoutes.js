const express = require('express'); // Import the express library
const router = express.Router(); // Create a new router instance
const userController = require('../controllers/userController'); // Import user controller
const authMiddleware = require('../middlewares/authMiddleware'); // Import authentication middleware

// Route for user registration
router.post('/register', userController.registerUser);

// Route for user login
router.post('/login', userController.loginUser);

// Route for updating user profile by user ID (protected by authentication)
router.put('/:userId', authMiddleware, userController.updateUserProfile);

// Export the router to be used in the main app
module.exports = router;