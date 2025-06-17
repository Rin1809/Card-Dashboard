import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useLanguage } from '@/hooks/useLanguage';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartColors = [
    '#bb9af7', '#7dcfff', '#73daca', '#b9f27c', '#ff9e64',
    '#f7768e', '#e0af68', '#9ece6a', '#c0caf5', '#2ac3de',
    '#565f89', '#ffc777', '#f4a3a3', '#a7c7e7', '#87ceeb',
    '#98fb98', '#f0e68c', '#dda0dd', '#ffb6c1', '#b0e0e6'
];

interface VisitorData {
  ip_address: string;
  visit_count: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const TopIPDistributionChart = () => {
    const [chartData, setChartData] = useState<any>({ datasets: [] });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isFading, setIsFading] = useState(false);
    const { t, locale } = useLanguage();
    const { filters } = useFilters();

    useEffect(() => {
      setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        setLoading(true);
        const limit = 8;
        const queryString = buildQueryString(filters);
        
        fetch(`/api/stats?endpoint=top-visitors&page=${currentPage}&limit=${limit}&sort=random&${queryString}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.topVisitors || data.topVisitors.length === 0) {
                    setChartData({ datasets: [] });
                    setPagination(data.pagination || null); 
                } else {
                    const visitors: VisitorData[] = data.topVisitors;
                    const labels = visitors.map((d: VisitorData) => d.ip_address);
                    const counts = visitors.map((d: VisitorData) => d.visit_count);
                    
                    setChartData({
                        labels,
                        datasets: [{
                            label: t('tables.visitCount'),
                            data: counts,
                            backgroundColor: chartColors.slice(0, labels.length),
                            borderColor: '#1a1b26',
                            borderWidth: 2,
                        }]
                    });
                    setPagination(data.pagination);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Loi fetch top visitors:", err);
                setLoading(false);
            });
    }, [t, locale, currentPage, filters]);

    useEffect(() => {
        if (!loading) {
            setIsFading(false);
        }
    }, [loading]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages) || newPage === currentPage || isFading) {
            return;
        }
        setIsFading(true);
        setTimeout(() => {
            setCurrentPage(newPage);
        }, 250);
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
          duration: 500
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#c0caf5', font: { size: 10 }, padding: 15 }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) {
                        const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                        label += `${context.parsed.toLocaleString(locale)} (${percentage}%)`;
                    }
                    return label;
                }
            }
        }
      }
    };
    
    return (
        <div className="table-container-wrapper">
            <div className={`chart-container-fade ${isFading ? 'fading' : ''}`}>
                {loading ? (
                    <p>{t('loading')}</p>
                ) : (!chartData.labels || chartData.labels.length === 0) ? (
                    <p>{t('noData')}</p>
                ) : (
                    <Pie data={chartData} options={options} />
                )}
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isFading}>
                        {`< ${t('buttons.previous')}`}
                    </button>
                    <span>
                        {`${t('buttons.page')} ${currentPage} / ${pagination.totalPages}`}
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages || isFading}>
                        {`${t('buttons.next')} >`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopIPDistributionChart;