const express = require('express');
const router = express.Router();
const { createLog, getAllLogs } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');

// Todas as rotas de log são protegidas e requerem um token válido
router.use(protect);

router.route('/')
  .post(createLog)
  .get(getAllLogs);

module.exports = router;
