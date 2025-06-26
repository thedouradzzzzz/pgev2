const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProductQuantity } = require('../controllers/produtoController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', protect, getAllProducts);
router.post('/', protect, authorize('admin'), createProduct);
router.patch('/:id/quantity', protect, updateProductQuantity);

module.exports = router;
