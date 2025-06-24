const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para GET /api/users/
router.get('/', userController.getAllUsers);

module.exports = router;
