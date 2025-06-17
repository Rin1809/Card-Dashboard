import React, { useState, useEffect, useRef } from 'react';

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  unit?: string;
  icon: React.ReactNode;
  style?: React.CSSProperties;
}

function StatCard({ title, value, unit, icon, style }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('...');
  const frameRef = useRef<number>();

  useEffect(() => {
    // huy animation trc do
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // xu ly value ko phai so
    if (typeof value !== 'number' || isNaN(value)) {
      setDisplayValue(String(value ?? '...'));
      return;
    }

    const startValue = 0;
    const duration = 1200;
    let startTime: number | null = null;
    
    // hieu ung dem so
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const current = startValue + (value * percentage);
      
      const isFloat = value % 1 !== 0;
      const formattedValue = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
      setDisplayValue(formattedValue);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value.toLocaleString());
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value]);


  return (
    <div className="stat-card" style={style}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">
          {displayValue}
          {unit && <span className="stat-unit">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default StatCard;