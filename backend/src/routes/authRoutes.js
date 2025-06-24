const express = require('express');
const router = express.Router();
// Importa as duas funções agora
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser); // Adiciona a nova rota

module.exports = router;
