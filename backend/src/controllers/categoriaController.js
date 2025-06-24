const Categoria = require('../models/Categoria');
const createCrudController = require('./genericController');
module.exports = createCrudController(Categoria);
