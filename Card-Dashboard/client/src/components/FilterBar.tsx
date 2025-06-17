import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { type FilterState } from '@/contexts/FilterContext';
import { useFilters } from '@/hooks/useFilters';
import MultiSelect from './MultiSelect';

interface FilterOptions {
    countries: string[];
    isps: string[];
    os: string[];
    browsers: string[];
}

const FilterBar = () => {
    const { t } = useLanguage();
    const { setFilters } = useFilters();
    const [localFilters, setLocalFilters] = useState<FilterState>({
        startDate: '', endDate: '', countries: [], isps: [], os: [], browsers: []
    });
    const [options, setOptions] = useState<FilterOptions>({
        countries: [], isps: [], os: [], browsers: []
    });

    useEffect(() => {
        fetch('/api/stats?endpoint=filter-options')
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.error("Loi lay filter options:", err));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (name: keyof FilterState, selectedOptions: string[]) => {
        setLocalFilters(prev => ({ ...prev, [name]: selectedOptions }));
    };
    
    const applyFilters = () => {
        setFilters(localFilters);
    };

    const resetFilters = () => {
        const initialFilters = { startDate: '', endDate: '', countries: [], isps: [], os: [], browsers: [] };
        setLocalFilters(initialFilters);
        setFilters(initialFilters);
    };

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label>{t('filters.dateRange')}</label>
                <input type="date" name="startDate" value={localFilters.startDate} onChange={handleInputChange} />
                <span>-</span>
                <input type="date" name="endDate" value={localFilters.endDate} onChange={handleInputChange} />
            </div>

            <MultiSelect
                label={t('filters.country')}
                options={options.countries}
                selected={localFilters.countries}
                onChange={(selected) => handleMultiSelectChange('countries', selected)}
            />
            <MultiSelect
                label={t('filters.isp')}
                options={options.isps}
                selected={localFilters.isps}
                onChange={(selected) => handleMultiSelectChange('isps', selected)}
            />
            <MultiSelect
                label={t('filters.os')}
                options={options.os}
                selected={localFilters.os}
                onChange={(selected) => handleMultiSelectChange('os', selected)}
            />
            <MultiSelect
                label={t('filters.browser')}
                options={options.browsers}
                selected={localFilters.browsers}
                onChange={(selected) => handleMultiSelectChange('browsers', selected)}
            />

            <div className="filter-actions">
                <button onClick={applyFilters} className="apply-btn">{t('filters.apply')}</button>
                <button onClick={resetFilters} className="reset-btn">{t('filters.reset')}</button>
            </div>
        </div>
    );
};

export default FilterBar;