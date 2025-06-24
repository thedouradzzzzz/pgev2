const express = require('express');
const { createEntrada, getAllEntradas } = require('../controllers/entradaEstoqueController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect, authorize('Gerente', 'Funcionário'));
router.route('/').post(createEntrada).get(getAllEntradas);

module.exports = router;
