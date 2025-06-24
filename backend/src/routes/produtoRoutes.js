const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct } = require('../controllers/produtoController');

// Rota para listar todos os produtos (GET /api/produtos)
router.get('/', getAllProducts);

// Rota para criar um novo produto (POST /api/produtos)
router.post('/', createProduct);

module.exports = router;
