const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };

    const { where, params } = buildWhereClause(filters, { tablePrefix: 'v' });

    const joinClause = `
        FROM interaction_events ie
        INNER JOIN interaction_sessions s ON ie.session_id = s.id
        LEFT JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
        ${where}
    `;

    try {
        const eventTypeCountsRes = await pool.query(
            `SELECT ie.event_type, COUNT(*) as count
             ${joinClause}
             GROUP BY ie.event_type
             ORDER BY count DESC;`,
             params
        );
        
        const viewChangedCountsRes = await pool.query(
            `SELECT ie.details ->> 'currentView' as view, COUNT(*) as count
             ${joinClause}
             AND ie.event_type = 'view_changed'
             GROUP BY view
             ORDER BY count DESC
             LIMIT 10;`,
             params
        );

        res.status(200).json({
            eventTypeCounts: eventTypeCountsRes.rows,
            viewChangedCounts: viewChangedCountsRes.rows,
        });
    } catch (error) {
        console.error('API Interactions Error:', error);
        res.status(500).json({ error: 'Loi lay data interaction.' });
    }
};