const mongoose = require('mongoose');

const SaidaEstoqueSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.ObjectId, ref: 'Produto', required: true },
  quantidade: { type: Number, required: [true, 'A quantidade de saída é obrigatória'], min: [1, 'A quantidade deve ser de no mínimo 1'] },
  motivo: { type: String, enum: ['Venda', 'Ajuste', 'Perda', 'Outro'], required: true },
  dataSaida: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('SaidaEstoque', SaidaEstoqueSchema);
