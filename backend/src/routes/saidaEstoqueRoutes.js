const express = require('express');
const { createSaida, getAllSaidas } = require('../controllers/saidaEstoqueController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(protect, authorize('Gerente', 'Funcionário'));
router.route('/').post(createSaida).get(getAllSaidas);

module.exports = router;
