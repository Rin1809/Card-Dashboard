const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };

    const { where, params } = buildWhereClause(filters, { tablePrefix: 'v' });

    const joinClause = `
        FROM interaction_sessions s
        INNER JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
        ${where}
    `;

    try {
        const durationRes = await pool.query(`
            WITH session_durations AS (
                SELECT 
                    EXTRACT(EPOCH FROM (s.end_time - s.start_time)) as duration_seconds
                ${joinClause}
                AND s.end_time IS NOT NULL AND s.start_time IS NOT NULL AND s.end_time > s.start_time
            )
            SELECT
                CASE
                    WHEN duration_seconds < 10 THEN '0-10s'
                    WHEN duration_seconds < 30 THEN '10-30s'
                    WHEN duration_seconds < 60 THEN '30-60s'
                    WHEN duration_seconds < 300 THEN '1-5m'
                    WHEN duration_seconds < 600 THEN '5-10m'
                    ELSE '10m+'
                END AS category,
                COUNT(*) AS session_count
            FROM session_durations
            GROUP BY category
            ORDER BY MIN(duration_seconds);
        `, params);

        res.status(200).json({
            sessionDurations: durationRes.rows,
        });
    } catch (error) {
        console.error('API Session Duration Error:', error);
        res.status(500).json({ error: 'Loi lay data thoi luong phien.' });
    }
};