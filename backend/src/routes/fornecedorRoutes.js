const fornecedorController = require('../controllers/fornecedorController');
const createCrudRoutes = require('./genericRoutes');
module.exports = createCrudRoutes(fornecedorController);
