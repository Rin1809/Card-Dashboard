const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const overviewHandler = require('./_handlers/overview.js');
const visitsHandler = require('./_handlers/visits.js');
const interactionsHandler = require('./_handlers/interactions.js');
const topVisitorsHandler = require('./_handlers/top-visitors.js');
const visitorDistributionHandler = require('./_handlers/visitor-distribution.js');
const visitorTrendsHandler = require('./_handlers/visitor-trends.js');
const ispDistributionHandler = require('./_handlers/isp-distribution.js');
const sessionDurationHandler = require('./_handlers/session-duration.js');
const platformDistributionHandler = require('./_handlers/platform-distribution.js');
const activityByTimeHandler = require('./_handlers/activity-by-time.js');
const languageDistributionHandler = require('./_handlers/language-distribution.js');
const cityDistributionHandler = require('./_handlers/city-distribution.js');
const detailedInteractionsHandler = require('./_handlers/detailed-interactions.js');
const botAnalysisHandler = require('./_handlers/bot-analysis.js');
const liveVisitorsHandler = require('./_handlers/live-visitors.js');
const bounceRateTrendsHandler = require('./_handlers/bounce-rate-trends.js');
const visitsByTimeOfDayHandler = require('./_handlers/visits-by-time-of-day.js');
const visitsByHourHandler = require('./_handlers/visits-by-hour.js');
const filterOptionsHandler = require('./_handlers/filter-options.js');
const sessionsByIpHandler = require('./_handlers/sessions-by-ip.js');
const sessionDetailsHandler = require('./_handlers/session-details.js');
const annotationsHandler = require('./_handlers/annotations.js');

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

const run = (handler) => (req, res) => {
    if (!req.socket) {
        req.socket = { remoteAddress: '::1' };
    }
    handler(req, res);
};

// Route
app.get('/api/stats/overview', run(overviewHandler));
app.get('/api/stats/visits', run(visitsHandler));
app.get('/api/stats/interactions', run(interactionsHandler));
app.get('/api/stats/top-visitors', run(topVisitorsHandler));
app.get('/api/stats/visitor-distribution', run(visitorDistributionHandler));
app.get('/api/stats/visitor-trends', run(visitorTrendsHandler));
app.get('/api/stats/isp-distribution', run(ispDistributionHandler));
app.get('/api/stats/session-duration', run(sessionDurationHandler));
app.get('/api/stats/platform-distribution', run(platformDistributionHandler));
app.get('/api/stats/activity-by-time', run(activityByTimeHandler));
app.get('/api/stats/language-distribution', run(languageDistributionHandler));
app.get('/api/stats/city-distribution', run(cityDistributionHandler));
app.get('/api/stats/detailed-interactions', run(detailedInteractionsHandler));
app.get('/api/stats/bot-analysis', run(botAnalysisHandler));
app.get('/api/stats/live-visitors', run(liveVisitorsHandler));
app.get('/api/stats/bounce-rate-trends', run(bounceRateTrendsHandler));
app.get('/api/stats/visits-by-time-of-day', run(visitsByTimeOfDayHandler));
app.get('/api/stats/visits-by-hour', run(visitsByHourHandler));
app.get('/api/stats/filter-options', run(filterOptionsHandler));
app.get('/api/stats/sessions-by-ip', run(sessionsByIpHandler));
app.get('/api/stats/session-details', run(sessionDetailsHandler));
app.get('/api/stats/annotations', run(annotationsHandler));
app.post('/api/stats/annotations', run(annotationsHandler));

app.get('/', (req, res) => {
  res.send('Mizuki Dashboard API Server (Local) is running! ✨');
});

app.listen(port, () => {
  console.log(`🚀 API server (local) dang chay tai http://localhost:${port}`);
});