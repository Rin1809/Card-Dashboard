import { useContext } from 'react';
import { FilterContext } from '@/contexts/FilterContext';

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

export const buildQueryString = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', new Date(filters.endDate).toISOString().split('T')[0] + 'T23:59:59.999Z');
    if (filters.countries?.length) params.append('countries', filters.countries.join(','));
    if (filters.isps?.length) params.append('isps', filters.isps.join(','));
    if (filters.os?.length) params.append('os', filters.os.join(','));
    if (filters.browsers?.length) params.append('browsers', filters.browsers.join(','));
    return params.toString();
};