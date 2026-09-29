const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../validators/authValidator');

// Public routes
router.post('/register', validateRequest(validateRegisterInput), authController.register);
router.post('/login', validateRequest(validateLoginInput), authController.login);
router.post('/guest', authController.guestLogin);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/seed-demo', authenticate, authController.seedDemo);

module.exports = router;
