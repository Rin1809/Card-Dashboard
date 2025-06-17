import { useState, useEffect, useMemo, MouseEvent, ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, ChartOptions, Filler } from 'chart.js';
import { InteractionItem } from 'chart.js';
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { dateLocales } from '@/lib/dateLocales';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale, Filler, annotationPlugin);

interface CombinedVisitorTrendChartProps {
    setHeaderControls: (node: ReactNode | null) => void;
}

const AnnotationManager = ({ annotations, author, onUpdate, t }: any) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const handleDelete = (id: number) => {
        if (!window.confirm(t('annotations.deleteConfirm'))) return;
        fetch('/api/stats?endpoint=annotations', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, author })
        }).then(res => {
            if (res.ok) onUpdate();
        });
    };

    const handleEdit = (anno: any) => {
        setEditingId(anno.id);
        setEditText(anno.text);
    };

    const handleSave = (id: number) => {
        fetch('/api/stats?endpoint=annotations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, text: editText, author })
        }).then(res => {
            if (res.ok) {
                setEditingId(null);
                onUpdate();
            }
        });
    };

    return (
        <ul className="annotation-manage-list">
            {annotations.map((anno: any) => (
                <li key={anno.id}>
                    <div className="annotation-manage-item">
                        <span className="date">{format(new Date(anno.timestamp), 'dd/MM/yyyy')}</span>
                        {editingId === anno.id ? (
                            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                        ) : (
                            <span className="text">{anno.text}</span>
                        )}
                    </div>
                    <div className="actions">
                        {editingId === anno.id ? (
                            <>
                                <button onClick={() => handleSave(anno.id)} className="save">{t('annotations.saveLabel')}</button>
                                <button onClick={() => setEditingId(null)} className="cancel">{t('annotations.cancelLabel')}</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEdit(anno)} className="edit">{t('annotations.editLabel')}</button>
                                <button onClick={() => handleDelete(anno.id)} className="delete">{t('annotations.deleteLabel')}</button>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};


const CombinedVisitorTrendChart = ({ setHeaderControls }: CombinedVisitorTrendChartProps) => {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [loading, setLoading] = useState(true);
  const { t, locale } = useLanguage();
  const { filters } = useFilters();
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotationText, setNewAnnotationText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [annotatorName, setAnnotatorName] = useState('');
  const [isManaging, setIsManaging] = useState(false);

  const fetchAnnotations = () => {
    if (!annotatorName) {
        setAnnotations([]);
        return;
    };
    fetch(`/api/stats?endpoint=annotations&chart_key=visitor-trend&author=${annotatorName}`)
      .then(res => res.json())
      .then(setAnnotations)
      .catch(err => console.error("Loi lay annotations:", err));
  };

  useEffect(() => {
    fetchAnnotations();
  }, [annotatorName]);

  useEffect(() => {
    const controls = (
        <div className="annotation-author-input">
            <input
                type="text"
                value={annotatorName}
                onChange={(e) => setAnnotatorName(e.target.value)}
                placeholder={t('annotations.authorPlaceholder')}
            />
            <button onClick={() => setIsManaging(true)} disabled={!annotatorName || annotations.length === 0}>
                {t('annotations.manageButton')}
            </button>
            <button className="help-btn" title={t('annotations.manageHelp')}>?</button>
        </div>
    );
    setHeaderControls(controls);
    return () => setHeaderControls(null);
  }, [annotatorName, annotations, setHeaderControls, t]);

  useEffect(() => {
    setLoading(true);
    const queryString = buildQueryString(filters);
    
    Promise.all([
      fetch(`/api/stats?endpoint=visits&period=day&${queryString}`).then(res => res.json()),
      fetch(`/api/stats?endpoint=visitor-trends&${queryString}`).then(res => res.json())
    ])
    .then(([visitsData, trendsData]) => {
      if (!visitsData?.byTime || !trendsData?.trends) {
        setLoading(false);
        return;
      }

      const labels = trendsData.trends.map((d: any) => new Date(d.visit_day));
      const newVisitors = trendsData.trends.map((d: any) => d.new_visitors);
      const returningVisitors = trendsData.trends.map((d: any) => d.returning_visitors);
      const totalVisits = visitsData.byTime.map((d: any) => d.count);

      setChartData({
        labels,
        datasets: [
          {
            label: t('chartLabels.totalVisits'), data: totalVisits, borderColor: '#7dcfff',
            backgroundColor: 'rgba(125, 207, 255, 0.2)', yAxisID: 'yTotal', tension: 0.4,
            borderWidth: 3, fill: true, pointRadius: 2, pointBackgroundColor: '#7dcfff', pointHoverRadius: 5,
          },
          {
            label: t('chartLabels.newVisitors'), data: newVisitors, borderColor: '#73daca',
            backgroundColor: 'rgba(115, 218, 202, 0.2)', yAxisID: 'yBreakdown', tension: 0.4,
            borderWidth: 2, fill: false, pointRadius: 2, pointBackgroundColor: '#73daca', pointHoverRadius: 5,
          },
          {
            label: t('chartLabels.returningVisitors'), data: returningVisitors, borderColor: '#bb9af7',
            backgroundColor: 'rgba(187, 154, 247, 0.2)', yAxisID: 'yBreakdown', tension: 0.4,
            borderWidth: 2, fill: false, pointRadius: 2, pointBackgroundColor: '#bb9af7', pointHoverRadius: 5,
          }
        ]
      });
      setLoading(false);
    })
    .catch(error => {
        console.error("Loi fetch combined trend:", error);
        setLoading(false);
    });
  }, [filters]);

  const handleAddAnnotation = () => {
    if (!newAnnotationText.trim() || !annotatorName.trim()) return;
    const timestamp = selectedDate ? selectedDate.toISOString() : new Date().toISOString();

    fetch('/api/stats?endpoint=annotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart_key: 'visitor-trend', text: newAnnotationText, timestamp, author: annotatorName })
    })
    .then(res => res.json())
    .then(() => {
        setNewAnnotationText('');
        setSelectedDate(null);
        fetchAnnotations();
    });
  };

  const handleChartClick = (_event: MouseEvent<HTMLCanvasElement>, elements: InteractionItem[], chart: ChartJS) => {
    if (elements.length > 0) {
        const { index } = elements[0];
        const date = new Date(chart.data.labels?.[index] as any);
        if (date && !isNaN(date.getTime())) {
            setSelectedDate(date);
        }
    }
  };

  const chartAnnotations = useMemo(() => {
    return annotations.reduce((acc, anno: any, index) => {
      acc[`line-${index}`] = {
        type: 'line',
        scaleID: 'x',
        value: new Date(anno.timestamp).getTime(),
        borderColor: '#f7768e',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: anno.text,
          display: true,
          position: 'start',
          backgroundColor: 'rgba(247, 118, 142, 0.8)',
          borderRadius: 4,
          font: { size: 10 },
          padding: 4
        }
      };
      return acc;
    }, {} as { [key: string]: AnnotationOptions });
  }, [annotations]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    onClick: (_event: any, elements: InteractionItem[], chart: ChartJS) => {
        handleChartClick(_event, elements, chart);
    },
    scales: {
      x: {
        type: 'time', time: { unit: 'day' }, adapters: { date: { locale: dateLocales[locale] } },
        ticks: { color: '#c0caf5' }, grid: { color: 'rgba(192, 202, 245, 0.1)' }
      },
      yTotal: {
        type: 'linear', position: 'left', beginAtZero: true, ticks: { color: '#7dcfff', stepSize: 1 },
        grid: { color: 'rgba(192, 202, 245, 0.1)' },
        title: { display: true, text: t('chartLabels.totalVisits'), color: '#7dcfff' }
      },
      yBreakdown: {
        type: 'linear', position: 'right', beginAtZero: true, ticks: { color: '#c0caf5', stepSize: 1 },
        grid: { drawOnChartArea: false },
        title: { display: true, text: t('buttons.analysis'), color: '#c0caf5' }
      }
    },
    plugins: {
      legend: { position: 'bottom', labels: { color: '#c0caf5' } },
      tooltip: {
        backgroundColor: 'rgba(26, 27, 38, 0.9)', titleFont: { size: 14 },
        bodyFont: { size: 12 }, padding: 10, boxPadding: 4,
      },
      annotation: {
        annotations: chartAnnotations
      }
    }
  };

  if (loading) return <p>{t('loading')}</p>;

  return (
    <div className='chart-container-vertical'>
        {isManaging && (
            <div className="annotation-manage-modal-overlay" onClick={() => setIsManaging(false)}>
                <div className="annotation-manage-modal-content" onClick={e => e.stopPropagation()}>
                    <h3>{t('annotations.managementTitle')} - <span className="author-name">{annotatorName}</span></h3>
                    <AnnotationManager annotations={annotations} author={annotatorName} onUpdate={fetchAnnotations} t={t} />
                </div>
            </div>
        )}
        <div className="chart-area">
            <Line data={chartData} options={options} />
        </div>
        <div className="annotation-form">
            <div className='annotation-input-group'>
              {selectedDate && (
                <div className="annotation-target-display">
                  <span>{t('annotations.annotatingFor')} <strong>{format(selectedDate, 'dd/MM/yyyy')}</strong></span>
                  <button onClick={() => setSelectedDate(null)} title={t('annotations.resetSelection')}>×</button>
                </div>
              )}
              <input
                  type="text"
                  value={newAnnotationText}
                  onChange={(e) => setNewAnnotationText(e.target.value)}
                  placeholder={
                    selectedDate
                    ? t('annotations.placeholderForDate', { date: format(selectedDate, 'dd/MM/yyyy') })
                    : t('annotations.placeholder')
                  }
                  disabled={!annotatorName}
              />
            </div>
            <button onClick={handleAddAnnotation} disabled={!annotatorName || !newAnnotationText}>
                {t('annotations.add')}
            </button>
        </div>
    </div>
    );
};

export default CombinedVisitorTrendChart;