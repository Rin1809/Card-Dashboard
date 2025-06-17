import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface FilterState {
    startDate: string;
    endDate: string;
    countries: string[];
    isps: string[];
    os: string[];
    browsers: string[];
}

interface FilterContextType {
    filters: FilterState;
    setFilters: Dispatch<SetStateAction<FilterState>>;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialState: FilterState = {
    startDate: '',
    endDate: '',
    countries: [],
    isps: [],
    os: [],
    browsers: [],
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilters] = useState<FilterState>(initialState);

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};