const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    const { where, params } = buildWhereClause(filters);

    try {
        const queryRes = await pool.query(`
            SELECT
                EXTRACT(HOUR FROM visit_time AT TIME ZONE 'Asia/Ho_Chi_Minh') as hour,
                COUNT(*) as count
            FROM visits
            ${where}
            GROUP BY hour
            ORDER BY hour ASC;
        `, params);

        res.status(200).json({
            distribution: queryRes.rows,
        });
    } catch (error) {
        console.error('API Visits by Hour Error:', error);
        res.status(500).json({ error: 'Loi lay data phan bo truy cap theo gio.' });
    }
};