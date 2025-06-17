const { pool } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { ip } = req.query;

    if (!ip) {
        return res.status(400).json({ error: 'Thieu dia chi IP' });
    }

    try {
        const sessionsRes = await pool.query(`
            SELECT 
                s.id, 
                s.start_time, 
                s.end_time,
                (SELECT COUNT(*) FROM interaction_events ie WHERE ie.session_id = s.id) as event_count
            FROM interaction_sessions s
            WHERE s.ip_address = $1
            ORDER BY s.start_time DESC
            LIMIT 50;
        `, [ip]);

        res.status(200).json({
            sessions: sessionsRes.rows,
        });

    } catch (error) {
        console.error('API Sessions by IP Error:', error);
        res.status(500).json({ error: 'Loi lay danh sach phien.' });
    }
};