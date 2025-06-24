const Fornecedor = require('../models/Fornecedor');
const createCrudController = require('./genericController');
module.exports = createCrudController(Fornecedor);
