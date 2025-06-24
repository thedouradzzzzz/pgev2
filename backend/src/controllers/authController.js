const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===================================================================================
// == CORREÇÃO APLICADA AQUI: Código completo e funcional para registrar usuário   ==
// ===================================================================================
const registerUser = async (req, res) => {
  // O 'role' recebido do frontend será 'Gerente', 'Funcionário', etc.
  const { name, email, password, role } = req.body;

  // 1. Validação básica dos dados recebidos
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Todos os campos (nome, email, senha, cargo) são obrigatórios.' });
  }

  // 2. Mapa de tradução para converter o cargo do frontend para o formato do banco
  const roleMap = {
    'Gerente': 'admin',
    'Funcionário': 'user'
    // Adicione outras traduções se necessário
  };
  
  // Traduz o cargo ou usa 'user' como padrão se o cargo não for reconhecido
  const roleParaBanco = roleMap[role] || 'user';

  try {
    // 3. Verificar se o email já está em uso para evitar duplicados
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Este email já está cadastrado.' });
    }

    // 4. Criptografar a senha antes de salvar no banco (MUITO IMPORTANTE)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Inserir o novo usuário na tabela 'users' USANDO O CARGO TRADUZIDO
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, roleParaBanco] // <<-- CORREÇÃO APLICADA AQUI
    );

    // 6. Preparar o objeto do novo usuário para retornar (sem a senha)
    const newUser = {
      id: result.insertId,
      name: name,
      email: email,
      role: roleParaBanco // <<-- Retornando o cargo correto do banco
    };

    // 7. Enviar a resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      data: newUser
    });

  } catch (error) {
    console.error('ERRO NO SERVIDOR AO REGISTRAR USUÁRIO:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor ao tentar registrar o usuário.' });
  }
};

// --- FUNÇÃO DE LOGIN (EXISTENTE) ---
const loginUser = async (req, res) => {
  console.log('\n--- [DEBUG] INICIANDO TENTATIVA DE LOGIN ---');
  try {
    const { email, password } = req.body;
    console.log(`[DEBUG] Recebido do frontend: email='${email}', password='${password}'`);

    if (!email || !password) {
      console.log('[DEBUG] ERRO: Email ou senha não fornecidos.');
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    console.log(`[DEBUG] Buscando usuário no banco de dados com email: ${email}`);
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      console.log('[DEBUG] RESULTADO: Usuário não encontrado no banco de dados.');
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    const user = users[0];
    console.log('[DEBUG] Usuário encontrado no BD:', user);
    console.log('[DEBUG] Senha do BD (hash):', user.password);
    console.log('[DEBUG] Comparando a senha fornecida com o hash do BD...');

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[DEBUG] Resultado da comparação (isMatch):', isMatch);

    if (!isMatch) {
      console.log('[DEBUG] RESULTADO: Senhas não conferem.');
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
    }

    console.log('[DEBUG] SUCESSO: Login válido. Gerando token JWT...');
    const payload = { id: user.id, name: user.name, role: user.role };
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.json({
      success: true,
      token: `Bearer ${token}`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('[DEBUG] ERRO CATASTRÓFICO NO TRY-CATCH:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao fazer login', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
