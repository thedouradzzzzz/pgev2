const express = require('express');
const router = express.Router();

const { 
    getAllCategorias, 
    createCategoria,
    updateCategoria, // <-- IMPORTADO
    deleteCategoria 
} = require('../controllers/categoriaController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Protege todas as rotas abaixo, exigindo login e cargo 'admin'
router.use(protect, authorize('admin'));

router.route('/')
    .get(getAllCategorias)
    .post(createCategoria);

router.route('/:id')
    .put(updateCategoria) // <-- ADICIONADO
    .delete(deleteCategoria);

module.exports = router;
