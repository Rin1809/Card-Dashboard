import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { dateLocales } from '@/lib/dateLocales';
import { useFilters, buildQueryString } from '@/hooks/useFilters';

interface TopVisitor {
  ip_address: string;
  visit_count: number;
  last_visit: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

interface TopVisitorsTableProps {
  onIpClick: (ip: string) => void;
}

const TopVisitorsTable = ({ onIpClick }: TopVisitorsTableProps) => {
  const [visitors, setVisitors] = useState<TopVisitor[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const { t, locale } = useLanguage();
  const { filters } = useFilters();

  useEffect(() => {
    // reset trang khi filter
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    const limit = 20;
    const queryString = buildQueryString(filters);
    fetch(`/api/stats?endpoint=top-visitors&page=${currentPage}&limit=${limit}&${queryString}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.topVisitors) {
          setVisitors(data.topVisitors);
          setPagination(data.pagination);
        } else {
          setVisitors([]);
          setPagination(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Loi lay top visitors:", err);
        setLoading(false);
      });
  }, [currentPage, filters]);

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

  const renderContent = () => {
    if (loading && visitors.length === 0) {
      return <p>{t('loading')}</p>;
    }
    if (visitors.length === 0) {
      return <p>{t('noData')}</p>;
    }
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('tables.ipAddress')}</th>
              <th>{t('tables.visitCount')}</th>
              <th>{t('tables.lastVisit')}</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.ip_address} onClick={() => onIpClick(visitor.ip_address)} style={{ cursor: 'pointer' }}>
                <td><code>{visitor.ip_address}</code></td>
                <td>{visitor.visit_count.toLocaleString(locale)}</td>
                <td>
                  {formatDistanceToNow(new Date(visitor.last_visit), {
                    addSuffix: true,
                    locale: dateLocales[locale]
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="table-container-wrapper">
      <div className={`chart-container-fade ${isFading ? 'fading' : ''}`}>
        {renderContent()}
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

export default TopVisitorsTable;