import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, ChartOptions, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { dateLocales } from '@/lib/dateLocales';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

interface VisitsByTimeChartProps {
  period: 'hour' | 'day' | 'week';
}

const VisitsByTimeChart = ({ period }: VisitsByTimeChartProps) => {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const { t, locale } = useLanguage();
  const { filters } = useFilters();

  useEffect(() => {
    const queryString = buildQueryString(filters);
    fetch(`/api/stats?endpoint=visits&period=${period}&${queryString}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.byTime) return;
        const labels = data.byTime.map((d: any) => new Date(d.date));
        const visitCounts = data.byTime.map((d: any) => d.count);
        setChartData({
          labels,
          datasets: [{
            label: `${t('chartLabels.visits')} ${t(`chartLabels.period.${period}`)}`,
            data: visitCounts,
            borderColor: 'rgb(137, 180, 250)',
            backgroundColor: 'rgba(137, 180, 250, 0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: (context: any) => {
                return context.chart.data.labels.length <= 50 ? 2 : 0;
            },
            pointBackgroundColor: 'rgb(137, 180, 250)',
            pointHoverRadius: 5,
          }]
        });
      });
  }, [period, t, filters]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        type: 'time', 
        time: { 
            unit: period as 'hour' | 'day' | 'week' | 'month',
            tooltipFormat: period === 'hour' ? 'dd/MM HH:mm' : 'dd/MM/yyyy'
        },
        adapters: { date: { locale: dateLocales[locale] } },
        ticks: { color: '#c0caf5' },
        grid: { color: 'rgba(192, 202, 245, 0.1)' }
      },
      y: { 
        ticks: { color: '#c0caf5', stepSize: 1 },
        grid: { color: 'rgba(192, 202, 245, 0.1)' },
        beginAtZero: true
      }
    },
    plugins: {
      legend: { labels: { color: '#c0caf5' } }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default VisitsByTimeChart;