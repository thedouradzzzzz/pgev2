const categoriaController = require('../controllers/categoriaController');
const createCrudRoutes = require('./genericRoutes');
module.exports = createCrudRoutes(categoriaController);
