import { useState, useEffect, useRef } from "react";
import TopVisitorsTable from "./TopVisitorsTable";
import VisitorTrendChart from "@/charts/VisitorTrendChart";
import TopIPDistributionChart from "@/charts/TopIPDistributionChart";
import VisitorJourneyModal from "./VisitorJourneyModal";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDistanceToNow } from 'date-fns';
import { dateLocales } from '@/lib/dateLocales';

type ViewMode = 'pie' | 'trend' | 'table';

interface Suggestion {
  ip_address: string;
  visit_count: number;
  last_visit: string;
}

const VisitorAnalytics = () => {
    const [view, setView] = useState<ViewMode>('pie');
    const { t, locale } = useLanguage();
    
    // state cho modal
    const [journeyIp, setJourneyIp] = useState<string | null>(null);

    // state cho input ip moi
    const [ipInput, setIpInput] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
    const suggestionBoxRef = useRef<HTMLDivElement>(null);


    // fetch goi y
    useEffect(() => {
        if (ipInput.length > 2) {
            const handler = setTimeout(() => {
                fetch(`/api/stats?endpoint=top-visitors&searchIp=${ipInput}&limit=5`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.topVisitors) {
                            setSuggestions(data.topVisitors);
                            setIsSuggestionsVisible(true);
                        }
                    });
            }, 300); // debounce
            return () => clearTimeout(handler);
        } else {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
        }
    }, [ipInput]);
    
    // an box goi y khi click ra ngoai
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleIpClick = (ip: string) => {
        setJourneyIp(ip);
    };

    const handleSuggestionClick = (ip: string) => {
        setIpInput(ip);
        setIsSuggestionsVisible(false);
        setJourneyIp(ip);
    };
    
    const handleViewJourney = () => {
        if (ipInput.trim()) {
            setJourneyIp(ipInput.trim());
        }
    };

    const renderView = () => {
        switch (view) {
            case 'trend':
                return <VisitorTrendChart />;
            case 'table':
                return <TopVisitorsTable onIpClick={handleIpClick} />;
            case 'pie':
            default:
                return <TopIPDistributionChart />;
        }
    }

    return (
        <div className="analytics-wrapper">
            <div ref={suggestionBoxRef} className="ip-journey-form">
                <input 
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    onFocus={() => ipInput && suggestions.length > 0 && setIsSuggestionsVisible(true)}
                    placeholder={t('journey.searchPlaceholder')}
                />
                <button onClick={handleViewJourney}>{t('journey.viewJourney')}</button>
                {isSuggestionsVisible && suggestions.length > 0 && (
                    <ul className="ip-suggestions">
                        {suggestions.map(s => (
                            <li key={s.ip_address} className="suggestion-item" onClick={() => handleSuggestionClick(s.ip_address)}>
                                <span className="suggestion-ip">{s.ip_address}</span>
                                <span className="suggestion-details">
                                    {s.visit_count} {t('tables.visitCount_short')} - {formatDistanceToNow(new Date(s.last_visit), { addSuffix: true, locale: dateLocales[locale] })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="view-switcher">
                <button onClick={() => setView('pie')} className={view === 'pie' ? 'active' : ''}>
                    {t('buttons.ipDistribution')}
                </button>
                <button onClick={() => setView('trend')} className={view === 'trend' ? 'active' : ''}>
                    {t('buttons.trend')}
                </button>
                <button onClick={() => setView('table')} className={view === 'table' ? 'active' : ''}>
                    {t('buttons.ranking')}
                </button>
            </div>
            <div className="analytics-content">
                {renderView()}
            </div>
            {journeyIp && (
                <VisitorJourneyModal ip={journeyIp} onClose={() => setJourneyIp(null)} />
            )}
        </div>
    );
}

export default VisitorAnalytics;