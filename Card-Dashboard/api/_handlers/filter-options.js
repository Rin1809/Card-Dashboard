const { pool } = require('../_lib/db.js');

// api moi de lay cac option cho filter
module.exports = async (req, res) => {
    try {
        const countriesPromise = pool.query(`
            SELECT DISTINCT country 
            FROM visits 
            WHERE country IS NOT NULL AND country <> 'N/A' AND country <> '' 
            ORDER BY country;
        `);

        const ispsPromise = pool.query(`
            SELECT DISTINCT isp 
            FROM visits 
            WHERE isp IS NOT NULL AND isp <> 'N/A' AND isp <> '' 
            ORDER BY isp;
        `);

        const osPromise = pool.query(`
            SELECT DISTINCT
                CASE
                    WHEN user_agent ILIKE '%Windows NT 10.0%' THEN 'Windows 10/11'
                    WHEN user_agent ILIKE '%Windows NT 6.3%' THEN 'Windows 8.1'
                    WHEN user_agent ILIKE '%Windows NT 6.2%' THEN 'Windows 8'
                    WHEN user_agent ILIKE '%Windows NT 6.1%' THEN 'Windows 7'
                    WHEN user_agent ILIKE '%Windows%' THEN 'Windows'
                    WHEN user_agent ILIKE '%Android%' THEN 'Android'
                    WHEN user_agent ILIKE '%iPhone OS%' OR user_agent ILIKE '%iPad%' THEN 'iOS'
                    WHEN user_agent ILIKE '%Mac OS X%' THEN 'macOS'
                    WHEN user_agent ILIKE '%Linux%' THEN 'Linux'
                    ELSE 'Khác'
                END AS os
            FROM visits
            WHERE user_agent IS NOT NULL;
        `);

        const browsersPromise = pool.query(`
            SELECT DISTINCT
                CASE
                    WHEN user_agent ILIKE '%Edg/%' THEN 'Edge'
                    WHEN user_agent ILIKE '%Firefox/%' THEN 'Firefox'
                    WHEN user_agent ILIKE '%SamsungBrowser/%' THEN 'Samsung Browser'
                    WHEN user_agent ILIKE '%Chrome/%' AND user_agent NOT ILIKE '%Chromium%' THEN 'Chrome'
                    WHEN user_agent ILIKE '%Safari/%' AND user_agent NOT ILIKE '%Chrome/%' THEN 'Safari'
                    WHEN user_agent ILIKE '%Opera/%' OR user_agent ILIKE '%OPR/%' THEN 'Opera'
                    WHEN user_agent ILIKE '%Trident/%' OR user_agent ILIKE '%MSIE%' THEN 'Internet Explorer'
                    ELSE 'Khác'
                END AS browser
            FROM visits
            WHERE user_agent IS NOT NULL;
        `);

        const [countriesRes, ispsRes, osRes, browsersRes] = await Promise.all([
            countriesPromise,
            ispsPromise,
            osPromise,
            browsersPromise
        ]);

        res.status(200).json({
            countries: countriesRes.rows.map(r => r.country).filter(c => c),
            isps: ispsRes.rows.map(r => r.isp).filter(i => i),
            os: osRes.rows.map(r => r.os).filter(o => o).sort(),
            browsers: browsersRes.rows.map(r => r.browser).filter(b => b).sort(),
        });
    } catch (error) {
        console.error('API Filter Options Error:', error);
        res.status(500).json({ error: 'Loi lay data cho bo loc.' });
    }
};