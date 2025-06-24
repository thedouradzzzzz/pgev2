const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome da categoria é obrigatório'], unique: true, trim: true },
  descricao: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Categoria', CategoriaSchema);
