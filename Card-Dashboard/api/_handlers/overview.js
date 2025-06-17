const { pool, buildWhereClause } = require('../_lib/db.js');

const getInteractionJoin = (where, params) => {
    const joinWhere = where.replace(/WHERE/g, 'AND');
    const baseQuery = `
        FROM interaction_events ie
        INNER JOIN interaction_sessions s ON ie.session_id = s.id
        LEFT JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
    `;
    return {
        query: `${baseQuery} ${where.replace(/visit_time/g, 'v.visit_time').replace(/country/g, 'v.country').replace(/isp/g, 'v.isp').replace(/user_agent/g, 'v.user_agent')}`,
        params,
    };
};

const getSessionJoin = (where, params) => {
    const joinWhere = where.replace(/WHERE/g, 'AND');
    const baseQuery = `
        FROM interaction_sessions s
        LEFT JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
    `;
    return {
        query: `${baseQuery} ${where.replace(/visit_time/g, 'v.visit_time').replace(/country/g, 'v.country').replace(/isp/g, 'v.isp').replace(/user_agent/g, 'v.user_agent')}`,
        params,
    };
};


module.exports = async (req, res) => {
  const { startDate, endDate, countries, isps, os, browsers } = req.query;
  const filters = { startDate, endDate, countries, isps, os, browsers };
  
  const { where, params } = buildWhereClause(filters);

  try {
    const totalVisitsPromise = pool.query(`SELECT COUNT(*) FROM visits ${where};`, params);
    const uniqueVisitorsPromise = pool.query(`SELECT COUNT(DISTINCT ip_address) FROM visits ${where};`, params);
    
    const interactionJoin = getInteractionJoin(where, params);
    const sessionJoin = getSessionJoin(where, params);
    
    const totalInteractionsPromise = pool.query(`SELECT COUNT(ie.id) ${interactionJoin.query}`, interactionJoin.params);
    const totalSessionsPromise = pool.query(`SELECT COUNT(s.id) ${sessionJoin.query}`, sessionJoin.params);
    const avgSessionDurationPromise = pool.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (s.end_time - s.start_time))) as avg_duration 
        ${sessionJoin.query}
        AND s.end_time IS NOT NULL AND s.start_time IS NOT NULL AND (s.end_time > s.start_time)
        AND EXTRACT(EPOCH FROM (s.end_time - s.start_time)) < 86400;
    `, sessionJoin.params);

    const singleInteractionSessionsPromise = pool.query(`
      SELECT COUNT(*) FROM (
        SELECT ie.session_id
        ${interactionJoin.query}
        GROUP BY ie.session_id
        HAVING COUNT(ie.id) = 1
      ) AS single_interaction_sessions;
    `, interactionJoin.params);

    const [
        totalVisitsRes,
        uniqueVisitorsRes,
        totalInteractionsRes,
        totalSessionsRes,
        avgSessionDurationRes,
        singleInteractionSessionsRes
    ] = await Promise.all([
        totalVisitsPromise,
        uniqueVisitorsPromise,
        totalInteractionsPromise,
        totalSessionsPromise,
        avgSessionDurationPromise,
        singleInteractionSessionsPromise
    ]);

    const totalSessions = parseInt(totalSessionsRes.rows[0].count, 10);
    const singleInteractionSessions = parseInt(singleInteractionSessionsRes.rows[0].count, 10);
    const bounceRate = totalSessions > 0 ? (singleInteractionSessions / totalSessions) * 100 : 0;

    const overview = {
      totalVisits: parseInt(totalVisitsRes.rows[0].count, 10),
      uniqueVisitors: parseInt(uniqueVisitorsRes.rows[0].count, 10),
      totalInteractions: parseInt(totalInteractionsRes.rows[0].count, 10),
      totalSessions: totalSessions,
      avgSessionDuration: avgSessionDurationRes.rows[0].avg_duration ? parseFloat(avgSessionDurationRes.rows[0].avg_duration).toFixed(1) : 0,
      bounceRate: parseFloat(bounceRate.toFixed(1)),
    };

    res.status(200).json(overview);
  } catch (error) {
    console.error('API Overview Error:', error);
    res.status(500).json({ error: 'Loi lay data overview.' });
  }
};