const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { period = 'hour', startDate, endDate, countries, isps, os, browsers } = req.query;

    if (!['hour', 'day', 'week', 'month'].includes(period)) {
        return res.status(400).json({ error: 'Thoi gian ko hop le.' });
    }
    
    let interval;
    let groupBy = `DATE_TRUNC($1, visit_time)`;
    let dateFilterClause = '';

    switch (period) {
        case 'hour': interval = `72 hour`; break;
        case 'day': interval = `30 day`; break;
        case 'week': interval = `26 week`; break;
        case 'month': interval = `12 month`; break;
    }
    
    if (!startDate && !endDate) {
        dateFilterClause = `visit_time > NOW() - INTERVAL '${interval}'`;
    }
    
    const filters = { startDate, endDate, countries, isps, os, browsers };
    
    try {
        // query theo thoi gian, $1 la period, filter params bat dau tu $2
        const { where: timeWhere, params: timeParams } = buildWhereClause(filters, { startIndex: 2 });
        let finalTimeWhere = timeWhere;
        if (dateFilterClause) {
            finalTimeWhere += (timeWhere ? ' AND ' : 'WHERE ') + dateFilterClause;
        }
        const byTimeQuery = `
            SELECT ${groupBy} AS date, COUNT(*) AS count
            FROM visits
            ${finalTimeWhere}
            GROUP BY date
            ORDER BY date ASC;`;
        
        const visitsByTimeRes = await pool.query(byTimeQuery, [period, ...timeParams]);

        // query theo quoc gia, query nay ko co period, params bat dau tu $1
        const { where: countryWhere, params: countryParams } = buildWhereClause(filters);
        const countryFilter = `country IS NOT NULL AND country <> 'N/A' AND country <> 'Local'`;
        const finalCountryWhere = countryWhere ? `${countryWhere} AND ${countryFilter}` : `WHERE ${countryFilter}`;

        const byCountryQuery = `
            SELECT country, COUNT(*) AS count
            FROM visits
            ${finalCountryWhere}
            GROUP BY country
            ORDER BY count DESC
            LIMIT 10;`;

        const visitsByCountryRes = await pool.query(byCountryQuery, countryParams);

        res.status(200).json({
            byTime: visitsByTimeRes.rows,
            byCountry: visitsByCountryRes.rows,
        });
    } catch (error) {
        console.error('API Visits Error:', error);
        res.status(500).json({ error: 'Loi lay data visit.' });
    }
};