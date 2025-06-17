const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    let { where, params } = buildWhereClause(filters);
    
    const cityFilter = `city IS NOT NULL AND city <> 'N/A' AND city <> '' AND country IS NOT NULL AND country <> 'N/A'`;
    const finalWhere = where ? `${where} AND ${cityFilter}` : `WHERE ${cityFilter}`;

    try {
        const cityRes = await pool.query(`
            SELECT 
                city, 
                country,
                COUNT(*) AS count
            FROM visits
            ${finalWhere}
            GROUP BY city, country
            ORDER BY count DESC
            LIMIT 15;
        `, params);

        res.status(200).json({
            cityDistribution: cityRes.rows,
        });
    } catch (error) {
        console.error('API City Distribution Error:', error);
        res.status(500).json({ error: 'Loi lay data phan bo thanh pho.' });
    }
};