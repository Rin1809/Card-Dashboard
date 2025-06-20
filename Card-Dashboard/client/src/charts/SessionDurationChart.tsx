import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = ['#7dcfff', '#b9f27c', '#ff9e64', '#f7768e', '#e0af68', '#bb9af7'];

const SessionDurationChart = () => {
    const [chartData, setChartData] = useState<any>({ datasets: [] });
    const { t, locale } = useLanguage();
    const { filters } = useFilters();

    useEffect(() => {
        const queryString = buildQueryString(filters);
        fetch(`/api/stats?endpoint=session-duration&${queryString}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.sessionDurations) return;
                const labels = data.sessionDurations.map((d: any) => t(`chartLabels.sessionDuration.${d.category}`));
                const counts = data.sessionDurations.map((d: any) => d.session_count);
                setChartData({
                    labels,
                    datasets: [{
                        label: t('chartLabels.sessions'),
                        data: counts,
                        backgroundColor: chartColors.slice(0, labels.length),
                        borderColor: '#1a1b26',
                        borderWidth: 2,
                    }]
                });
            });
    }, [t, filters]);

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#c0caf5' }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) {
                        const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        label += `${context.parsed.toLocaleString(locale)} (${percentage}%)`;
                    }
                    return label;
                }
            }
        }
      }
    };

    return (
        <div className="chart-container">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default SessionDurationChart;