const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Função genérica para criar rotas CRUD
const createCrudRoutes = (controller) => {
  const router = express.Router();
  
  router.route('/')
    .get(controller.getAll) // Pode ser público ou protegido, ajuste conforme necessário
    .post(protect, authorize('Gerente', 'Funcionário'), controller.create);

  router.route('/:id')
    .get(controller.getById)
    .put(protect, authorize('Gerente', 'Funcionário'), controller.update)
    .delete(protect, authorize('Gerente'), controller.delete);
    
  return router;
};

module.exports = createCrudRoutes;
