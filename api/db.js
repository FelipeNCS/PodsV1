const mysql = require('mysql2/promise');

const connectionString = process.env.MYSQL_URL;

if (!connectionString) {
    console.error('AVISO: A variável de ambiente MYSQL_URL está ausente!');
}

const pool = mysql.createPool(connectionString || 'mysql://root:JEAjJFODqIddekpJtUmFndQSXWZELTff@localhost:3306/railway');

// Função para inicializar tabelas e administrador padrão
async function initDb() {
    try {
        const connection = await pool.getConnection();
        
        // 1. Criar tabela de administradores
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 2. Criar tabela de vendas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS sales (
                id BIGINT PRIMARY KEY,
                product VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                customer VARCHAR(255) NOT NULL,
                contact VARCHAR(100),
                shipping DECIMAL(10,2) DEFAULT 0.00,
                partner VARCHAR(50) NOT NULL,
                is_credit TINYINT(1) DEFAULT 0,
                due_date VARCHAR(100),
                interest_rate DECIMAL(5,2) DEFAULT 0.00,
                is_paid TINYINT(1) DEFAULT 0,
                sale_date VARCHAR(100) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        // 3. Cadastrar o administrador inicial se a tabela estiver vazia
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM admins');
        if (rows[0].count === 0) {
            await connection.query(
                'INSERT INTO admins (username, password) VALUES (?, ?)',
                ['felipencs', '01102030']
            );
            console.log('Administrador inicial felipencs cadastrado com sucesso!');
        }

        connection.release();
        console.log('Estrutura de tabelas do MySQL verificada.');
    } catch (err) {
        console.error('Falha ao conectar ou inicializar o MySQL na Railway:', err);
    }
}

// Rodar verificação na inicialização
initDb();

module.exports = pool;
