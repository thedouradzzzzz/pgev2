const pool = require('../config/database');

const getAllCategorias = async (req, res) => {
    try {
        const [categorias] = await pool.query('SELECT * FROM categorias ORDER BY name ASC');
        res.json({ success: true, data: categorias });
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ success: false, message: 'Erro no servidor ao buscar categorias.' });
    }
};

const createCategoria = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Nome da categoria é obrigatório.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO categorias (name, description) VALUES (?, ?)',
            [name, description || null]
        );
        console.log(`LOG: Categoria '${name}' (ID: ${result.insertId}) criada pelo usuário ID: ${req.user.id}`);
        
        const [[newCategoria]] = await pool.query('SELECT * FROM categorias WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, data: newCategoria });
    } catch (error) {
        console.error("Erro ao criar categoria:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Já existe uma categoria com este nome.' });
        }
        res.status(500).json({ success: false, message: 'Erro ao criar categoria.' });
    }
};

const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'O nome da categoria é obrigatório.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE categorias SET name = ?, description = ? WHERE id = ?',
            [name, description || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
        }

        console.log(`LOG: Categoria '${name}' (ID: ${id}) atualizada pelo usuário ID: ${req.user.id}`);

        const [[updatedCategoria]] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        res.json({ success: true, data: updatedCategoria });
    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Já existe uma categoria com este nome.' });
        }
        res.status(500).json({ success: false, message: 'Erro no servidor ao atualizar categoria.' });
    }
};

const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const [[categoria]] = await pool.query('SELECT name FROM categorias WHERE id = ?', [id]);
        if (!categoria) {
            return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });
        }
        await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
        
        console.log(`LOG: Categoria '${categoria.name}' (ID: ${id}) deletada pelo usuário ID: ${req.user.id}`);
        
        res.json({ success: true, message: 'Categoria deletada com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        
        // CORREÇÃO: Captura o erro específico de chave estrangeira
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ success: false, message: 'Não é possível excluir. Esta categoria está sendo usada por um ou mais produtos.' });
        }
        
        res.status(500).json({ success: false, message: 'Erro no servidor ao deletar categoria.' });
    }
};

module.exports = {
    getAllCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
