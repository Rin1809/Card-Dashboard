const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    const { where, params } = buildWhereClause(filters);
    
    const botClause = `
        (user_agent ILIKE '%bot%'
        OR user_agent ILIKE '%crawler%'
        OR user_agent ILIKE '%spider%')
    `;

    const finalWhere = where ? `${where} AND ${botClause}` : `WHERE ${botClause}`;

    try {
        const botRes = await pool.query(`
            SELECT
                CASE
                    WHEN user_agent ILIKE '%bot%' THEN 'Generic Bot'
                    WHEN user_agent ILIKE '%crawler%' THEN 'Crawler'
                    WHEN user_agent ILIKE '%spider%' THEN 'Spider'
                    WHEN user_agent ILIKE '%Googlebot%' THEN 'Googlebot'
                    WHEN user_agent ILIKE '%AhrefsBot%' THEN 'AhrefsBot'
                    WHEN user_agent ILIKE '%SemrushBot%' THEN 'SemrushBot'
                    WHEN user_agent ILIKE '%Bingbot%' THEN 'Bingbot'
                    WHEN user_agent ILIKE '%YandexBot%' THEN 'YandexBot'
                    ELSE 'Khác'
                END AS bot_type,
                COUNT(*) as count
            FROM visits
            ${finalWhere}
            GROUP BY bot_type
            ORDER BY count DESC;
        `, params);

        res.status(200).json({
            botDistribution: botRes.rows,
        });
    } catch (error) {
        console.error('API Bot Analysis Error:', error);
        res.status(500).json({ error: 'Loi lay data phan tich bot.' });
    }
};