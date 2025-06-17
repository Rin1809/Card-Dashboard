import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { format, formatDistance } from 'date-fns';
import { dateLocales } from '@/lib/dateLocales';

interface JourneyModalProps {
    ip: string;
    onClose: () => void;
}

interface Session {
    id: number;
    start_time: string;
    end_time: string;
    event_count: number;
}

interface InteractionEvent {
    id: number;
    event_time: string;
    event_type: string;
    details: any;
}

const VisitorJourneyModal = ({ ip, onClose }: JourneyModalProps) => {
    const { t, locale } = useLanguage();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activeSession, setActiveSession] = useState<Session | null>(null);
    const [events, setEvents] = useState<InteractionEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/stats?endpoint=sessions-by-ip&ip=${ip}`)
            .then(res => res.json())
            .then(data => {
                setSessions(data.sessions || []);
                if (data.sessions && data.sessions.length > 0) {
                    handleSessionClick(data.sessions[0]);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => console.error("Loi lay ds phien:", err));
    }, [ip]);

    const handleSessionClick = (session: Session) => {
        setLoading(true);
        setActiveSession(session);
        fetch(`/api/stats?endpoint=session-details&sessionId=${session.id}`)
            .then(res => res.json())
            .then(data => {
                setEvents(data.events || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Loi lay chi tiet phien:", err);
                setLoading(false);
            });
    };

    const formatEventDetails = (event: InteractionEvent) => {
        const { event_type, details } = event;
        
        // fix loi o day
        let parsedDetails;
        if (typeof details === 'string') {
            try {
                parsedDetails = JSON.parse(details);
            } catch (e) {
                console.error("Loi parse JSON:", e, "Data:", details);
                parsedDetails = {}; 
            }
        } else {
            parsedDetails = details || {};
        }

        switch(event_type) {
            case 'language_selected':
                return t('journey.eventType.language_selected', { lang: parsedDetails.language.toUpperCase() });
            case 'view_changed':
                return t('journey.eventType.view_changed', { prev: parsedDetails.previousView, curr: parsedDetails.currentView });
            case 'about_subsection_viewed':
                return t('journey.eventType.about_subsection_viewed', { curr: parsedDetails.currentSubSection });
            case 'gallery_image_viewed':
                return t('journey.eventType.gallery_image_viewed', { index: parsedDetails.imageIndex + 1, action: parsedDetails.action });
            case 'guestbook_entry_viewed':
                 return t('journey.eventType.guestbook_entry_viewed', { snippet: parsedDetails.messageSnippet });
            case 'guestbook_entry_submitted':
                return t('journey.eventType.guestbook_entry_submitted', { name: parsedDetails.name, snippet: parsedDetails.messageSnippet });
            default:
                return t('journey.eventType.unknown', { type: event_type });
        }
    };

    const getSessionDuration = (start: string, end: string) => {
        if (!end) return 'N/A';
        return formatDistance(new Date(end), new Date(start), { locale: dateLocales[locale] });
    };

    return (
        <div className="journey-modal-overlay" onClick={onClose}>
            <div className="journey-modal-content" onClick={e => e.stopPropagation()}>
                <div className="journey-modal-header">
                    <h3>{t('journey.modalTitle', { ip: `<code>${ip}</code>` }).split(/<code>|<\/code>/).map((text, i) => i % 2 !== 0 ? <code key={i}>{text}</code> : text)}</h3>
                    <button onClick={onClose} className="journey-modal-close-btn">×</button>
                </div>
                <div className="journey-modal-body">
                    <div className="sessions-list">
                        <h4 className='sessions-list-title'>{t('journey.selectSession')}</h4>
                        {sessions.map(s => (
                            <div key={s.id} className={`session-item ${activeSession?.id === s.id ? 'active' : ''}`} onClick={() => handleSessionClick(s)}>
                                <p className="time">{t('journey.start')}: {format(new Date(s.start_time), 'dd/MM/yyyy HH:mm:ss')}</p>
                                <p className="details">
                                    {t('journey.duration')}: {getSessionDuration(s.start_time, s.end_time)} | {s.event_count} {t('journey.events')}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="timeline-container">
                        <h4 className="timeline-title">{t('journey.eventLog')}</h4>
                        {loading ? <p>{t('loading')}</p> :
                            events.length === 0 ? <p>{t('journey.noEvents')}</p> :
                            <ul className="timeline">
                                {events.map(event => (
                                    <li key={event.id} className="timeline-item">
                                        <p className="timeline-time">{format(new Date(event.event_time), 'HH:mm:ss')}</p>
                                        <p className="timeline-event" dangerouslySetInnerHTML={{ __html: formatEventDetails(event).replace(/`([^`]+)`/g, '<code>$1</code>') }} />
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorJourneyModal;