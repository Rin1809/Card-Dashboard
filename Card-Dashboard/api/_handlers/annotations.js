const { pool } = require('../_lib/db.js');

const handleGet = async (req, res) => {
    const { chart_key, author } = req.query;
    if (!chart_key || !author) {
        return res.status(400).json({ error: 'Thieu chart_key hoac author' });
    }
    try {
        const result = await pool.query(
            `SELECT * FROM chart_annotations WHERE chart_key = $1 AND author = $2 ORDER BY timestamp DESC`,
            [chart_key, author]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('API Annotations (GET) Error:', error);
        res.status(500).json({ error: 'Loi lay data annotations.' });
    }
};

const handlePost = async (req, res) => {
    const { chart_key, text, timestamp, author } = req.body;
    if (!chart_key || !text || !author) {
        return res.status(400).json({ error: 'Thieu chart_key, text, hoac author' });
    }
    const finalTimestamp = timestamp || new Date().toISOString();

    try {
        const result = await pool.query(
            `INSERT INTO chart_annotations (chart_key, text, timestamp, author) VALUES ($1, $2, $3, $4) RETURNING *`,
            [chart_key, text, finalTimestamp, author]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('API Annotations (POST) Error:', error);
        res.status(500).json({ error: 'Loi tao annotation.' });
    }
};

// xu ly sua
const handlePut = async (req, res) => {
    const { id, text, author } = req.body;
    if (!id || !text || !author) {
        return res.status(400).json({ error: 'Thieu id, text, hoac author' });
    }
    try {
        const result = await pool.query(
            `UPDATE chart_annotations SET text = $1 WHERE id = $2 AND author = $3 RETURNING *`,
            [text, id, author]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ko tim thay annotation hoac ko co quyen sua.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('API Annotations (PUT) Error:', error);
        res.status(500).json({ error: 'Loi cap nhat annotation.' });
    }
};

// xu ly xoa
const handleDelete = async (req, res) => {
    const { id, author } = req.body;
     if (!id || !author) {
        return res.status(400).json({ error: 'Thieu id hoac author' });
    }
    try {
        const result = await pool.query(
            'DELETE FROM chart_annotations WHERE id = $1 AND author = $2 RETURNING *',
            [id, author]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ko tim thay annotation hoac ko co quyen xoa.' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('API Annotations (DELETE) Error:', error);
        res.status(500).json({ error: 'Loi xoa annotation.' });
    }
};

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        return handleGet(req, res);
    }
    if (req.method === 'POST') {
        return handlePost(req, res);
    }
    if (req.method === 'PUT') {
        return handlePut(req, res);
    }
    if (req.method === 'DELETE') {
        return handleDelete(req, res);
    }
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
};