const express = require('express');
const descriptorController = require('../controllers/descriptorController');
const createCrudRoutes = require('./genericRoutes');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = createCrudRoutes(descriptorController);

// Exemplo de como proteger todas as rotas de Descriptor
router.use(protect, authorize('Gerente'));

module.exports = router;
