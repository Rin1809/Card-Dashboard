import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IspDistributionChart = () => {
    const [chartData, setChartData] = useState<any>({ datasets: [] });
    const { t } = useLanguage();
    const { filters } = useFilters();

    useEffect(() => {
        const queryString = buildQueryString(filters);
        fetch(`/api/stats?endpoint=isp-distribution&${queryString}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.ispDistribution) return;
                
                const labels = data.ispDistribution.map((d: any) => d.isp);
                const counts = data.ispDistribution.map((d: any) => d.count);
                
                setChartData({
                    labels,
                    datasets: [{
                        label: t('chartLabels.visits'),
                        data: counts,
                        backgroundColor: '#ff9e64',
                        borderColor: '#d47a46',
                        borderWidth: 1,
                    }]
                });
            });
    }, [t, filters]);

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
          x: { 
            ticks: { color: '#c0caf5', stepSize: 1 },
            grid: { color: 'rgba(192, 202, 245, 0.1)' }
          },
          y: { 
            ticks: { color: '#c0caf5' },
            grid: { color: 'rgba(192, 202, 245, 0.1)' }
          }
      },
      plugins: {
        legend: { display: false },
        title: { display: false }
      }
    };

    return (
        <div className="chart-container">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default IspDistributionChart;