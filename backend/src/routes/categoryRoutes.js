const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authMiddleware');

// Categories can be fetched by authenticated users
router.use(authenticate);

router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);

module.exports = router;
