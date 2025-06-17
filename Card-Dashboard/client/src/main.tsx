import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { FilterProvider } from './contexts/FilterContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </LanguageProvider>
  </React.StrictMode>,
);