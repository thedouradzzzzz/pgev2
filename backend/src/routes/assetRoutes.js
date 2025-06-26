const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Importando todas as funções, incluindo a nova 'importAssets'
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  importAssets 
} = require('../controllers/assetController');

// Configuração do Multer para upload de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rotas de CRUD existentes
router.get('/', protect, getAllAssets);
router.get('/:id', protect, getAssetById);
router.post('/', protect, authorize('admin'), createAsset);
router.put('/:id', protect, authorize('admin'), updateAsset);
router.delete('/:id', protect, authorize('admin'), deleteAsset);

// Nova rota para importação de CSV
router.post('/import', protect, authorize('admin'), upload.single('file'), importAssets);

module.exports = router;
