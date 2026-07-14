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

    try {
        // Garantir que as tabelas existem antes de qualquer SELECT/INSERT
        await ensureTablesExist();

        if (req.method === 'GET') {
            // Listar todas as vendas do banco
            const [rows] = await pool.query('SELECT * FROM sales ORDER BY id DESC');
            
            // Formatando os nomes das colunas de snake_case (MySQL) para camelCase (Frontend)
            const formattedSales = rows.map(row => ({
                id: Number(row.id),
                product: row.product,
                price: Number(row.price),
                customer: row.customer,
                contact: row.contact,
                shipping: Number(row.shipping),
                partner: row.partner,
                isCredit: Boolean(row.is_credit),
                dueDate: row.due_date,
                interestRate: Number(row.interest_rate),
                isPaid: Boolean(row.is_paid),
                saleDate: row.sale_date
            }));
            
            res.status(200).json(formattedSales);
        } 
        else if (req.method === 'POST') {
            // Inserir nova venda no MySQL
            const { id, product, price, customer, contact, shipping, partner, isCredit, dueDate, interestRate, isPaid, saleDate } = req.body;
            
            await pool.query(
                `INSERT INTO sales (id, product, price, customer, contact, shipping, partner, is_credit, due_date, interest_rate, is_paid, sale_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    product,
                    price,
                    customer,
                    contact,
                    shipping,
                    partner,
                    isCredit ? 1 : 0,
                    dueDate,
                    interestRate,
                    isPaid ? 1 : 0,
                    saleDate
                ]
            );
            res.status(201).json({ success: true, message: 'Venda registrada no MySQL com sucesso!' });
        } 
        else if (req.method === 'PUT') {
            // Editar venda existente no MySQL
            const { id, product, price, customer, contact, shipping, partner, isCredit, dueDate, interestRate, isPaid, saleDate } = req.body;
            
            await pool.query(
                `UPDATE sales SET 
                    product = ?, 
                    price = ?, 
                    customer = ?, 
                    contact = ?, 
                    shipping = ?, 
                    partner = ?, 
                    is_credit = ?, 
                    due_date = ?, 
                    interest_rate = ?, 
                    is_paid = ?, 
                    sale_date = ?
                 WHERE id = ?`,
                [
                    product,
                    price,
                    customer,
                    contact,
                    shipping,
                    partner,
                    isCredit ? 1 : 0,
                    dueDate,
                    interestRate,
                    isPaid ? 1 : 0,
                    saleDate,
                    id
                ]
            );
            res.status(200).json({ success: true, message: 'Venda atualizada no MySQL!' });
        } 
        else if (req.method === 'DELETE') {
            // Deletar venda no MySQL
            const id = req.query.id;
            
            if (!id) {
                res.status(400).json({ error: 'ID da venda é obrigatório!' });
                return;
            }

            await pool.query('DELETE FROM sales WHERE id = ?', [id]);
            res.status(200).json({ success: true, message: 'Venda excluída do MySQL!' });
        } 
        else {
            res.status(405).json({ error: 'Método não suportado' });
        }
    } catch (err) {
        console.error('Erro na API /api/sales:', err);
        res.status(500).json({ error: 'Falha no banco de dados', details: err.message });
    }
};
