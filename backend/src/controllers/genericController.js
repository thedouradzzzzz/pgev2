// Função genérica para criar controllers CRUD
const createCrudController = (Model) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find();
      res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item não encontrado' });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Erro ao criar item', error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item não encontrado' });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Erro ao atualizar item', error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item não encontrado' });
      }
      res.status(200).json({ success: true, message: 'Item deletado' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
    }
  },
});

module.exports = createCrudController;
