const express = require('express');
const assetController = require('../controllers/assetController');
const createCrudRoutes = require('./genericRoutes');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = createCrudRoutes(assetController);

// Exemplo de como proteger todas as rotas de Asset
router.use(protect, authorize('Gerente', 'Funcionário'));

module.exports = router;
