import { useState, useEffect, ReactNode } from "react";
import VisitsByTimeChart from "@/charts/VisitsByTimeChart";
import CombinedVisitorTrendChart from "@/charts/CombinedVisitorTrendChart";
import VisitsByTimeOfDayPieChart from "@/charts/VisitsByTimeOfDayPieChart";
import VisitsByHourBarChart from "@/charts/VisitsByHourBarChart";
import { useLanguage } from "@/hooks/useLanguage";

type ViewMode = 'overview' | 'breakdown' | 'distribution';
type Period = 'hour' | 'day' | 'week';
type DistributionView = 'bySession' | 'byHour';

const TimeAnalytics = () => {
    const [view, setView] = useState<ViewMode>('breakdown');
    const [period, setPeriod] = useState<Period>('day');
    const [distributionView, setDistributionView] = useState<DistributionView>('bySession');
    const { t } = useLanguage();
    const [headerExtraControls, setHeaderExtraControls] = useState<ReactNode | null>(null);

    useEffect(() => {
        if (view !== 'breakdown') {
            setHeaderExtraControls(null);
        }
    }, [view]);

    const renderChart = () => {
        switch (view) {
            case 'breakdown':
                return <CombinedVisitorTrendChart setHeaderControls={setHeaderExtraControls} />;
            case 'distribution':
                return distributionView === 'bySession' ? <VisitsByTimeOfDayPieChart /> : <VisitsByHourBarChart />;
            case 'overview':
            default:
                return <VisitsByTimeChart period={period} />;
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="chart-header">
                <h2>{t('charts.timeAnalytics')}</h2>
                <div className="view-switcher">
                    <button onClick={() => setView('overview')} className={view === 'overview' ? 'active' : ''}>
                        {t('buttons.overview')}
                    </button>
                    <button onClick={() => setView('breakdown')} className={view === 'breakdown' ? 'active' : ''}>
                        {t('buttons.analysis')}
                    </button>
                    <button onClick={() => setView('distribution')} className={view === 'distribution' ? 'active' : ''}>
                        {t('buttons.distribution')}
                    </button>
                </div>
                <div className="chart-header-extras">
                    {headerExtraControls}
                </div>
            </div>
            
            {view === 'overview' && (
                <div className="view-switcher sub-switcher">
                    <button onClick={() => setPeriod('hour')} className={period === 'hour' ? 'active small' : 'small'}>
                        {t('buttons.byTime')}
                    </button>
                    <button onClick={() => setPeriod('day')} className={period === 'day' ? 'active small' : 'small'}>
                        {t('buttons.byDay')}
                    </button>
                    <button onClick={() => setPeriod('week')} className={period === 'week' ? 'active small' : 'small'}>
                        {t('buttons.byWeek')}
                    </button>
                </div>
            )}

            {view === 'distribution' && (
                <div className="view-switcher sub-switcher">
                    <button onClick={() => setDistributionView('bySession')} className={distributionView === 'bySession' ? 'active small' : 'small'}>
                        {t('buttons.bySession')}
                    </button>
                    <button onClick={() => setDistributionView('byHour')} className={distributionView === 'byHour' ? 'active small' : 'small'}>
                        {t('buttons.byTime')}
                    </button>
                </div>
            )}

            <div className="analytics-content">
                {renderChart()}
            </div>
        </div>
    );
}

export default TimeAnalytics;