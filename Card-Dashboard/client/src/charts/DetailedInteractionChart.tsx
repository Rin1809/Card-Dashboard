import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, ChartOptions, ChartDataset } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { dateLocales } from '@/lib/dateLocales';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler);

interface DetailedInteractionChartProps {
    type: 'about-subsections' | 'gallery-hotspots' | 'guestbook-trends';
}

const DetailedInteractionChart = ({ type }: DetailedInteractionChartProps) => {
    const [chartData, setChartData] = useState<any>({ datasets: [] });
    const { t, locale } = useLanguage();
    const { filters } = useFilters();

    const chartConfig = {
      'about-subsections': { type: 'bar' as const, label: t('chartLabels.viewedSection'), color: '#b9f27c' },
      'gallery-hotspots': { type: 'bar' as const, label: t('chartLabels.viewedImage'), color: '#ff9e64' },
      'guestbook-trends': { type: 'line' as const, label: t('chartLabels.submittedEntry'), color: '#f7768e' },
    };
    
    const config = chartConfig[type];

    useEffect(() => {
        const queryString = buildQueryString(filters);
        fetch(`/api/stats?endpoint=detailed-interactions&type=${type}&${queryString}`)
            .then(res => res.json())
            .then(apiResponse => {
                if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
                    setChartData({ labels: [], datasets: [] });
                    return;
                }

                let processedData = apiResponse.data;

                if (type === 'about-subsections' || type === 'gallery-hotspots') {
                    processedData = apiResponse.data.filter((d: any) => d.item && d.item !== 'N/A');
                }

                const counts = processedData.map((d: any) => d.count);
                let labels;
                
                if (type === 'guestbook-trends') {
                    labels = processedData.map((d: any) => d.date ? new Date(d.date) : null)
                                          .filter((d: Date | null) => d && !isNaN(d.getTime()));
                } else if (type === 'gallery-hotspots') {
                    labels = processedData.map((d: any) => {
                       const imageNumber = parseInt(d.item, 10);
                       return !isNaN(imageNumber) ? `${t('chartLabels.image')} ${imageNumber + 1}` : d.item;
                    });
                } else {
                    labels = processedData.map((d: any) => d.item);
                }

                const baseDataset = {
                    label: config.label,
                    data: counts,
                    backgroundColor: `${config.color}80`,
                    borderColor: config.color,
                    borderWidth: 2,
                    tension: 0.3,
                };
                
                let dataset: ChartDataset<typeof config.type>;

                if (config.type === 'line') {
                    dataset = { ...baseDataset, fill: true };
                } else {
                    dataset = baseDataset;
                }
                
                setChartData({ labels, datasets: [dataset] });
            });
    }, [type, t, filters, locale]);

    const options: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: config.type === 'bar' ? 'y' : 'x',
      scales: {
          x: { 
            type: config.type === 'line' ? 'time' : 'linear',
            time: config.type === 'line' ? { unit: 'day' } : undefined,
            adapters: config.type === 'line' ? { date: { locale: dateLocales[locale] } } : undefined,
            ticks: { color: '#c0caf5' },
            grid: { color: 'rgba(192, 202, 245, 0.1)' }
          },
          y: { 
            type: config.type === 'bar' ? 'category' : 'linear',
            beginAtZero: true,
            ticks: { color: '#c0caf5' },
            grid: { color: 'rgba(192, 202, 245, 0.1)' }
          }
      },
      plugins: {
        legend: { display: false }
      }
    };

    const ChartComponent = config.type === 'line' ? Line : Bar;

    return (
        <div className="chart-container">
            <ChartComponent data={chartData} options={options} />
        </div>
    );
};

export default DetailedInteractionChart;