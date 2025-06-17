const { pool, buildWhereClause } = require('../_lib/db.js');

module.exports = async (req, res) => {
    const { type, startDate, endDate, countries, isps, os, browsers } = req.query;
    const filters = { startDate, endDate, countries, isps, os, browsers };

    const { where, params } = buildWhereClause(filters, { tablePrefix: 'v' });

    // dieu kien join de filter
    const joinClause = `
        FROM interaction_events ie
        INNER JOIN interaction_sessions s ON ie.session_id = s.id
        LEFT JOIN visits v ON s.ip_address = v.ip_address AND s.start_time = v.visit_time
        ${where}
    `;

    try {
        let query;
        switch (type) {
            case 'about-subsections':
                query = `
                    SELECT details ->> 'currentSubSection' as item, COUNT(*) as count
                    ${joinClause}
                    AND ie.event_type = 'about_subsection_viewed' AND ie.details ->> 'currentSubSection' <> 'N/A'
                    GROUP BY item
                    ORDER BY count DESC
                    LIMIT 10;
                `;
                break;
            case 'gallery-hotspots':
                query = `
                    SELECT details ->> 'imageIndex' as item, COUNT(*) as count
                    ${joinClause}
                    AND ie.event_type = 'gallery_image_viewed'
                    GROUP BY item
                    ORDER BY count DESC
                    LIMIT 10;
                `;
                break;
            case 'guestbook-trends':
                query = `
                    SELECT DATE_TRUNC('day', event_time AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE AS date, COUNT(*) AS count
                    ${joinClause}
                    AND ie.event_type = 'guestbook_entry_submitted'
                    GROUP BY date
                    ORDER BY date ASC;
                `;
                break;
            default:
                return res.status(400).json({ error: 'Loai tuong tac khong hop le.' });
        }
        
        const queryResult = await pool.query(query, params);
        res.status(200).json({ data: queryResult.rows });

    } catch (error) {
        console.error(`API Detailed Interactions Error (type: ${type}):`, error);
        res.status(500).json({ error: `Loi lay data cho loai tuong tac: ${type}` });
    }
};