const EntradaEstoque = require('../models/EntradaEstoque');
const Produto = require('../models/Produto');

exports.createEntrada = async (req, res) => {
  const { produto: produtoId, quantidade, precoCusto } = req.body;
  try {
    const produto = await Produto.findById(produtoId);
    if (!produto) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    produto.quantidade += Number(quantidade);
    await produto.save();
    const entrada = await EntradaEstoque.create({ produto: produtoId, quantidade, precoCusto, usuario: req.user.id });
    res.status(201).json({ success: true, data: entrada, message: 'Entrada registrada e estoque atualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao registrar entrada', error: error.message });
  }
};

exports.getAllEntradas = async (req, res) => {
  try {
    const entradas = await EntradaEstoque.find().populate('produto', 'nome').populate('usuario', 'nome');
    res.status(200).json({ success: true, count: entradas.length, data: entradas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};
