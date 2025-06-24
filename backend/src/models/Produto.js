const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome do produto é obrigatório'], trim: true },
  barcode: { type: String, unique: true, sparse: true }, // Permite valores nulos sem quebrar a unicidade
  descricao: { type: String },
  preco: { type: Number, required: [true, 'O preço é obrigatório'], min: [0, 'O preço não pode ser negativo'] },
  quantidade: { type: Number, required: true, default: 0, min: [0, 'A quantidade não pode ser negativa'] },
  categoria: { type: mongoose.Schema.ObjectId, ref: 'Categoria', required: true },
  fornecedor: { type: mongoose.Schema.ObjectId, ref: 'Fornecedor' },
}, { timestamps: true });

module.exports = mongoose.model('Produto', ProdutoSchema);
