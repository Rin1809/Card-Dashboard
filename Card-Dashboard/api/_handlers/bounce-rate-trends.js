const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    let { where, params } = buildWhereClause(filters, { tablePrefix: 'v' });
    
    if (!startDate && !endDate) {
        where += (where ? ' AND ' : 'WHERE ') + `v.visit_time > NOW() - INTERVAL '30 day'`;
    }

    try {
        const trendsRes = await pool.query(`
            WITH daily_sessions AS (
                SELECT 
                    DATE_TRUNC('day', s.start_time AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE AS day,
                    s.id as session_id
                FROM interaction_sessions s
                LEFT JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
                ${where}
            ),
            event_counts AS (
                SELECT 
                    session_id,
                    COUNT(*) as event_count
                FROM interaction_events
                WHERE session_id IN (SELECT session_id FROM daily_sessions)
                GROUP BY session_id
            ),
            daily_bounce_stats AS (
                SELECT
                    ds.day,
                    COUNT(ds.session_id) as total_sessions,
                    COUNT(ds.session_id) FILTER (WHERE ec.event_count = 1) as bounced_sessions
                FROM daily_sessions ds
                JOIN event_counts ec ON ds.session_id = ec.session_id
                GROUP BY ds.day
            )
            SELECT
                day,
                (bounced_sessions::DECIMAL / total_sessions * 100) as bounce_rate
            FROM daily_bounce_stats
            WHERE total_sessions > 0
            ORDER BY day ASC;
        `, params);

        res.status(200).json({
            trends: trendsRes.rows,
        });
    } catch (error) {
        console.error('API Bounce Rate Trends Error:', error);
        res.status(500).json({ error: 'Loi lay data xu huong ty le thoat.' });
    }
};