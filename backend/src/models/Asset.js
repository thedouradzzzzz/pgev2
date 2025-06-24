const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  responsavel: { type: mongoose.Schema.ObjectId, ref: 'User' },
  localizacao: { type: String },
  // Adicione outros campos que façam sentido para "Ativos"
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
