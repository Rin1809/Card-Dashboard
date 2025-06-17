const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    const { sort, startDate, endDate, countries, isps, os, browsers, searchIp } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };

    let { where, params } = buildWhereClause(filters);

    // xu ly search ip
    if (searchIp) {
        where += (where ? ' AND ' : 'WHERE ') + `ip_address ILIKE $${params.length + 1}`;
        params.push(`${searchIp}%`);
    }

    const orderByClause = sort === 'random'
        ? 'ORDER BY RANDOM()'
        : 'ORDER BY visit_count DESC, last_visit DESC';

    try {
        const query = `
            SELECT
                ip_address,
                COUNT(*) AS visit_count,
                MAX(visit_time) as last_visit
            FROM visits
            ${where}
            GROUP BY ip_address
            ${orderByClause}
            LIMIT $${params.length + 1} OFFSET $${params.length + 2};
        `;
        const queryParams = [...params, limit, offset];
        const topVisitorsRes = await pool.query(query, queryParams);
        
        // chi dem total khi ko phai search
        let totalCount = 0;
        let totalPages = 0;
        if (!searchIp) {
            const countQuery = `SELECT COUNT(DISTINCT ip_address) as total_count FROM visits ${where};`;
            const totalCountRes = await pool.query(countQuery, params.slice(0, params.length - (searchIp ? 1 : 0) ));
            totalCount = parseInt(totalCountRes.rows[0].total_count, 10);
            totalPages = Math.ceil(totalCount / limit);
        } else {
            totalCount = topVisitorsRes.rows.length;
            totalPages = 1;
        }

        const responseData = {
            topVisitors: topVisitorsRes.rows,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages
            }
        };
        res.status(200).json(responseData);

    } catch (error) {
        res.status(500).json({ error: 'Loi lay data khach truy cap thuong xuyen.' });
    }
};