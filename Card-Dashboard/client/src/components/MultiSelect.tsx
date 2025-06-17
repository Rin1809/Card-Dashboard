import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface MultiSelectProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

const MultiSelect = ({ label, options, selected, onChange }: MultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const displayLabel = selected.length > 0
        ? `${selected.length} ${t('filters.selected')}`
        : `${t('filters.all')} ${label}`;

    return (
        <div className="multiselect-container" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="multiselect-button">
                <span className="multiselect-label">{displayLabel}</span>
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
            </button>
            {isOpen && (
                <div className="multiselect-dropdown">
                    {options.map(option => (
                        <label key={option} className="multiselect-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleSelect(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;