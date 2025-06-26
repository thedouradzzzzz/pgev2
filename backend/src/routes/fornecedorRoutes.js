const express = require('express');
const router = express.Router();

const { 
    getAllFornecedores, 
    createFornecedor,
    updateFornecedor, // <-- IMPORTADO
    deleteFornecedor 
} = require('../controllers/fornecedorController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Protege todas as rotas abaixo, exigindo login e cargo 'admin'
router.use(protect, authorize('admin'));

router.route('/')
    .get(getAllFornecedores)
    .post(createFornecedor);

router.route('/:id')
    .put(updateFornecedor) // <-- ADICIONADO
    .delete(deleteFornecedor);

module.exports = router;
