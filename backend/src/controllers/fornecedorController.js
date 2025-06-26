const pool = require('../config/database');

const getAllFornecedores = async (req, res) => {
    try {
        const [fornecedores] = await pool.query('SELECT * FROM fornecedores ORDER BY name ASC');
        res.json({ success: true, data: fornecedores });
    } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        res.status(500).json({ success: false, message: 'Erro no servidor ao buscar fornecedores.' });
    }
};

const createFornecedor = async (req, res) => {
    const { name, contact_info } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Nome do fornecedor é obrigatório.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO fornecedores (name, contact_info) VALUES (?, ?)',
            [name, contact_info || null]
        );
        console.log(`LOG: Fornecedor '${name}' (ID: ${result.insertId}) criado pelo usuário ID: ${req.user.id}`);
        
        const [[newFornecedor]] = await pool.query('SELECT * FROM fornecedores WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newFornecedor });
    } catch (error) {
        console.error("Erro ao criar fornecedor:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Já existe um fornecedor com este nome.' });
        }
        res.status(500).json({ success: false, message: 'Erro ao criar fornecedor.' });
    }
};

// FUNÇÃO ADICIONADA
const updateFornecedor = async (req, res) => {
    const { id } = req.params;
    const { name, contact_info } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'O nome do fornecedor é obrigatório.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE fornecedores SET name = ?, contact_info = ? WHERE id = ?',
            [name, contact_info || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado.' });
        }

        console.log(`LOG: Fornecedor '${name}' (ID: ${id}) atualizado pelo usuário ID: ${req.user.id}`);

        const [[updatedFornecedor]] = await pool.query('SELECT * FROM fornecedores WHERE id = ?', [id]);
        res.json({ success: true, data: updatedFornecedor });
    } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Já existe um fornecedor com este nome.' });
        }
        res.status(500).json({ success: false, message: 'Erro no servidor ao atualizar fornecedor.' });
    }
};

const deleteFornecedor = async (req, res) => {
    const { id } = req.params;
    try {
        const [[fornecedor]] = await pool.query('SELECT name FROM fornecedores WHERE id = ?', [id]);
        if (!fornecedor) {
            return res.status(404).json({ success: false, message: 'Fornecedor não encontrado.' });
        }

        await pool.query('DELETE FROM fornecedores WHERE id = ?', [id]);
        
        console.log(`LOG: Fornecedor '${fornecedor.name}' (ID: ${id}) deletado pelo usuário ID: ${req.user.id}`);

        res.json({ success: true, message: 'Fornecedor deletado com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar fornecedor:", error);
        res.status(500).json({ success: false, message: 'Erro no servidor ao deletar fornecedor.' });
    }
};

module.exports = {
    getAllFornecedores,
    createFornecedor,
    updateFornecedor, // FUNÇÃO EXPORTADA
    deleteFornecedor
};
