const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    createProduct, 
    updateProductQuantity,
    deleteProduct // <-- IMPORTADO
} = require('../controllers/produtoController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllProducts);
router.post('/', protect, authorize('admin'), createProduct);
router.patch('/:id/quantity', protect, updateProductQuantity);
router.delete('/:id', protect, authorize('admin'), deleteProduct); // <-- ROTA ADICIONADA

module.exports = router;
