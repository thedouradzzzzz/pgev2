const Descriptor = require('../models/Descriptor');
const createCrudController = require('./genericController');
module.exports = createCrudController(Descriptor);
