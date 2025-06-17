const { pool } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res.status(400).json({ error: 'Thieu sessionId' });
    }

    try {
        const eventsRes = await pool.query(
            `SELECT id, event_time, event_type, details
             FROM interaction_events
             WHERE session_id = $1
             ORDER BY event_time ASC`,
            [sessionId]
        );

        res.status(200).json({
            events: eventsRes.rows,
        });

    } catch (error) {
        console.error('API Session Details Error:', error);
        res.status(500).json({ error: 'Loi lay chi tiet phien.' });
    }
};