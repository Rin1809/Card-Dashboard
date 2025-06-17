const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    let { where, params } = buildWhereClause(filters, { tablePrefix: 'v' });
    
    if (!startDate && !endDate) {
        where += (where ? ' AND ' : 'WHERE ') + `v.visit_time > NOW() - INTERVAL '365 day'`;
    }

    try {
        const trendsRes = await pool.query(`
            WITH first_visits AS (
                SELECT 
                    ip_address, 
                    MIN(DATE_TRUNC('day', visit_time)) as first_visit_date
                FROM visits
                GROUP BY ip_address
            )
            SELECT
                DATE_TRUNC('day', v.visit_time)::DATE AS visit_day,
                COUNT(DISTINCT v.ip_address) FILTER (WHERE DATE_TRUNC('day', v.visit_time) = fv.first_visit_date) AS new_visitors,
                COUNT(DISTINCT v.ip_address) FILTER (WHERE DATE_TRUNC('day', v.visit_time) > fv.first_visit_date) AS returning_visitors
            FROM visits v
            JOIN first_visits fv ON v.ip_address = fv.ip_address
            ${where}
            GROUP BY visit_day
            ORDER BY visit_day ASC;
        `, params);

        res.status(200).json({
            trends: trendsRes.rows,
        });
    } catch (error) {
        console.error('API Visitor Trends Error:', error);
        res.status(500).json({ error: 'Loi lay data xu huong khach truy cap.' });
    }
};