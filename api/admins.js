const { pool, ensureTablesExist } = require('./db');

module.exports = async (req, res) => {
    // Configurações de CORS para Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { action } = req.query;

    try {
        // Garantir que as tabelas existem antes de fazer qualquer SELECT/INSERT
        await ensureTablesExist();

        if (req.method === 'POST') {
            if (action === 'login') {
                // Lógica de Autenticação do Administrador no MySQL
                const { username, password } = req.body;
                
                const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
                
                if (rows.length > 0 && rows[0].password === password) {
                    res.status(200).json({ success: true, message: 'Login efetuado com sucesso!' });
                } else {
                    res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' });
                }
            } 
            else if (action === 'register') {
                // Registrar novo Administrador no MySQL
                const { username, password } = req.body;
                
                if (!username || !password || password.length < 6) {
                    res.status(400).json({ success: false, message: 'Dados insuficientes ou senha muito curta!' });
                    return;
                }

                // Verificar duplicação de nome de usuário
                const [existsRows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
                if (existsRows.length > 0) {
                    res.status(409).json({ success: false, message: 'Este nome de usuário já está cadastrado!' });
                    return;
                }

                // Cadastrar no banco de dados
                await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password]);
                res.status(201).json({ success: true, message: 'Novo administrador cadastrado com sucesso no MySQL!' });
            } 
            else {
                res.status(400).json({ error: 'Ação inválida!' });
            }
        } 
        else {
            res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (err) {
        console.error('Erro na API /api/admins:', err);
        res.status(500).json({ error: 'Falha no banco de dados do Vercel', details: err.message });
    }
};
