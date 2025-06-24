const Asset = require('../models/Asset');
const createCrudController = require('./genericController');
module.exports = createCrudController(Asset);
