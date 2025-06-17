const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DB_FATAL_ERROR: DATABASE_URL is not set.');
}

const poolConfig = {
  connectionString,
};

if (process.env.NODE_ENV === 'production' && connectionString && (connectionString.includes('neon.tech') || connectionString.includes('aws.neon.tech'))) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err, client) => {
  console.error('DB_POOL_ERROR: Loi bat ngo', { error: err.message });
});

// helper build query, nhan object option
function buildWhereClause(filters, { tablePrefix = '', startIndex = 1 } = {}) {
    const conditions = [];
    const params = [];
    let paramIndex = startIndex;

    const prefix = tablePrefix ? `${tablePrefix}.` : '';

    if (filters.startDate) {
        conditions.push(`${prefix}visit_time >= $${paramIndex++}`);
        params.push(filters.startDate);
    }
    if (filters.endDate) {
        conditions.push(`${prefix}visit_time <= $${paramIndex++}`);
        params.push(filters.endDate);
    }
    if (filters.countries && filters.countries.length > 0) {
        conditions.push(`${prefix}country = ANY($${paramIndex++}::text[])`);
        params.push(filters.countries.split(','));
    }
    if (filters.isps && filters.isps.length > 0) {
        conditions.push(`${prefix}isp = ANY($${paramIndex++}::text[])`);
        params.push(filters.isps.split(','));
    }

    const osParamValues = [];
    if (filters.os && filters.os.length > 0) {
        const osList = filters.os.split(',');
        const osConditions = osList.map(osName => {
            if (osName === 'Windows 10/11') return `${prefix}user_agent ILIKE '%Windows NT 10.0%'`;
            if (osName === 'Windows 7') return `${prefix}user_agent ILIKE '%Windows NT 6.1%'`;
            if (osName === 'Windows') return `(${prefix}user_agent ILIKE '%Windows%' AND ${prefix}user_agent NOT ILIKE '%Windows NT%')`;
            if (osName === 'iOS') return `(${prefix}user_agent ILIKE '%iPhone OS%' OR ${prefix}user_agent ILIKE '%iPad%')`;
            if (osName === 'macOS') return `${prefix}user_agent ILIKE '%Mac OS X%'`;
            if (osName === 'Android') return `${prefix}user_agent ILIKE '%Android%'`;
            if (osName === 'Linux') return `${prefix}user_agent ILIKE '%Linux%'`;
            osParamValues.push(`%${osName}%`);
            return `${prefix}user_agent ILIKE $${paramIndex + osParamValues.length - 1}`;
        });
        conditions.push(`(${osConditions.join(' OR ')})`);
        paramIndex += osParamValues.length;
    }

    const browserParamValues = [];
    if (filters.browsers && filters.browsers.length > 0) {
        const browserList = filters.browsers.split(',');
        const browserConditions = browserList.map(browserName => {
             if (browserName === 'Chrome') return `(${prefix}user_agent ILIKE '%Chrome/%' AND ${prefix}user_agent NOT ILIKE '%Chromium%')`;
             if (browserName === 'Safari') return `(${prefix}user_agent ILIKE '%Safari/%' AND ${prefix}user_agent NOT ILIKE '%Chrome/%')`;
             if (browserName === 'Edge') return `${prefix}user_agent ILIKE '%Edg/%'`;
             if (browserName === 'Firefox') return `${prefix}user_agent ILIKE '%Firefox/%'`;
             browserParamValues.push(`%${browserName}%`);
             return `${prefix}user_agent ILIKE $${paramIndex + browserParamValues.length -1}`;
        });
         conditions.push(`(${browserConditions.join(' OR ')})`);
    }

    const finalParams = [...params, ...osParamValues, ...browserParamValues];

    if (conditions.length === 0) {
        return { where: '', params: [], paramIndex: 1 };
    }

    return {
        where: `WHERE ${conditions.join(' AND ')}`,
        params: finalParams,
    };
}


module.exports = { pool, buildWhereClause };