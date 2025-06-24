const mongoose = require('mongoose');

const FornecedorSchema = new mongoose.Schema({
  nome: { type: String, required: [true, 'O nome do fornecedor é obrigatório'], trim: true },
  contato: { nome: String, email: String, telefone: String },
  endereco: { rua: String, cidade: String, estado: String, cep: String },
}, { timestamps: true });

module.exports = mongoose.model('Fornecedor', FornecedorSchema);
