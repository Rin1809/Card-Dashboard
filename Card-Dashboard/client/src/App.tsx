import { useState, useEffect } from 'react';
import './App.css';
import StatCard from '@/components/StatCard';
import VisitorAnalytics from '@/components/VisitorAnalytics';
import TimeAnalytics from '@/components/TimeAnalytics';
import InteractionAnalytics from './components/InteractionAnalytics';
import DistributionAnalytics from './components/DistributionAnalytics';
import PlatformAnalytics from './components/PlatformAnalytics';
import ActivityByTimeChart from './charts/ActivityByTimeChart';
import DetailedInteractionAnalytics from './components/DetailedInteractionAnalytics';
import BotAnalysisChart from './charts/BotAnalysisChart';
import LiveStat from './components/LiveStat';
import BounceRateTrendChart from './charts/BounceRateTrendChart';
import { useLanguage } from './hooks/useLanguage';
import { Locale } from './lib/translations';
import { useFilters, buildQueryString } from './hooks/useFilters';
import FilterBar from './components/FilterBar';

interface OverviewStats {
  totalVisits: number;
  uniqueVisitors: number;
  totalInteractions: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.418-5.523A2 2 0 018.135 5h7.73a2 2 0 011.681 1.16l4.418 5.523a1.012 1.012 0 010 .639l-4.418 5.523A2 2 0 0115.865 19h-7.73a2 2 0 01-1.681-1.16z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const InteractionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const BounceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.75A2.25 2.25 0 0115.75 4.5h2.25m-7.5 0h7.5M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

function App() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const { t, locale, setLocale } = useLanguage();
  const { filters } = useFilters();

  useEffect(() => {
    const queryString = buildQueryString(filters);
    fetch(`/api/stats?endpoint=overview&${queryString}`)
      .then(res => res.json())
      .then(data => setOverview(data))
      .catch(err => console.error("Loi lay overview:", err));
  }, [filters]);

  const overviewCards = [
    { key: 'totalVisits', icon: <EyeIcon />, unit: undefined },
    { key: 'uniqueVisitors', icon: <UsersIcon />, unit: undefined },
    { key: 'totalInteractions', icon: <InteractionIcon />, unit: undefined },
    { key: 'avgSessionDuration', icon: <ClockIcon />, unit: t('overview.unitSeconds') },
    { key: 'bounceRate', icon: <BounceIcon />, unit: '%' },
  ];

  const mainColumnCharts = [
      { key: 'timeAnalytics', component: <TimeAnalytics /> },
      { key: 'visitorAnalytics', component: <VisitorAnalytics /> },
      { key: 'activityHeatmap', component: <ActivityByTimeChart /> },
      { key: 'bounceRateTrend', component: <BounceRateTrendChart /> }
  ];

  const sidebarCharts = [
      { key: 'interactionAnalytics', component: <InteractionAnalytics /> },
      { key: 'platformAnalytics', component: <PlatformAnalytics /> },
      { key: 'geoNetworkAnalytics', component: <DistributionAnalytics /> },
      { key: 'detailedInteractions', component: <DetailedInteractionAnalytics /> },
      { key: 'botAnalysis', component: <BotAnalysisChart /> }
  ];

  return (
    <div className="dashboard-container">
      <header>
        <div className="header-content">
          <div className="header-left">
            <div className="header-title">
              <img src="/icon.ico" alt="Mizuki Icon" className="header-icon" />
              <h1>{t('appTitle')}</h1>
            </div>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <LiveStat />
              <a href="https://rins.space/" target="_blank" rel="noopener noreferrer" className="visit-site-btn">
                <LinkIcon />
                <span>Go Card</span>
              </a>
              <div className="language-selector">
                <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                  <option value="vi">Vietnamese</option>
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section>
          <FilterBar />
        </section>
        <section className="overview-grid">
          {overviewCards.map((card, index) => (
            <StatCard
              key={card.key}
              title={t(`overview.${card.key}`)}
              value={overview ? overview[card.key as keyof OverviewStats] : undefined}
              unit={card.unit}
              icon={card.icon}
              style={{ animationDelay: `${250 + index * 100}ms` }}
            />
          ))}
        </section>
        
        <div className="main-content">
          <div className="main-column">
              <div className="chart-wrapper" style={{ animationDelay: `${500}ms` }}>
                  <TimeAnalytics />
              </div>
            {mainColumnCharts.slice(1).map((chart, index) => (
                <div 
                    className="chart-wrapper" 
                    key={chart.key} 
                    style={{ animationDelay: `${650 + index * 150}ms` }}>
                    <h2>{t(`charts.${chart.key}`)}</h2>
                    {chart.component}
                </div>
            ))}
          </div>
          <div className="sidebar-column">
             {sidebarCharts.map((chart, index) => (
                <div 
                    className="chart-wrapper" 
                    key={chart.key} 
                    style={{ animationDelay: `${600 + index * 150}ms` }}>
                    <h2>{t(`charts.${chart.key}`)}</h2>
                    {chart.component}
                </div>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}

export default App;