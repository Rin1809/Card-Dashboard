const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    let { where, params } = buildWhereClause(filters);

    const ispFilter = `isp IS NOT NULL AND isp <> 'N/A' AND isp <> ''`;
    const finalWhere = where ? `${where} AND ${ispFilter}` : `WHERE ${ispFilter}`;

    try {
        const ispRes = await pool.query(`
            SELECT 
                isp, 
                COUNT(*) AS count
            FROM visits
            ${finalWhere}
            GROUP BY isp
            ORDER BY count DESC
            LIMIT 15;
        `, params);

        res.status(200).json({
            ispDistribution: ispRes.rows,
        });
    } catch (error) {
        console.error('API ISP Distribution Error:', error);
        res.status(500).json({ error: 'Loi lay data phan bo ISP.' });
    }
};