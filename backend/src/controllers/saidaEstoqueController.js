const SaidaEstoque = require('../models/SaidaEstoque');
const Produto = require('../models/Produto');

exports.createSaida = async (req, res) => {
  const { produto: produtoId, quantidade, motivo } = req.body;
  try {
    const produto = await Produto.findById(produtoId);
    if (!produto) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    if (produto.quantidade < quantidade) {
      return res.status(400).json({ success: false, message: 'Quantidade em estoque insuficiente.' });
    }
    produto.quantidade -= Number(quantidade);
    await produto.save();
    const saida = await SaidaEstoque.create({ produto: produtoId, quantidade, motivo, usuario: req.user.id });
    res.status(201).json({ success: true, data: saida, message: 'Saída registrada e estoque atualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao registrar saída', error: error.message });
  }
};

exports.getAllSaidas = async (req, res) => {
  try {
    const saidas = await SaidaEstoque.find().populate('produto', 'nome').populate('usuario', 'nome');
    res.status(200).json({ success: true, count: saidas.length, data: saidas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};
