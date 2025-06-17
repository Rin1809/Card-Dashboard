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
        const langRes = await pool.query(`
            SELECT
                ie.details ->> 'language' as language,
                COUNT(*) as count
            ${joinClause}
            AND ie.event_type = 'language_selected'
            GROUP BY language
            ORDER BY count DESC;
        `, params);

        res.status(200).json({
            languageDistribution: langRes.rows,
        });
    } catch (error) {
        console.error('API Language Distribution Error:', error);
        res.status(500).json({ error: 'Loi lay data phan bo ngon ngu.' });
    }
};