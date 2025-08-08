import React from 'react';

const BracketMetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = 'bg-primary',
  trend,
  trendValue,
  loading = false
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      } else {
        return val.toLocaleString();
      }
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return (
        <svg className="w-3 h-3 ms-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-3 h-3 ms-1" fill="currentColor" viewBox="0 0 20 20" style={{ transform: 'rotate(180deg)' }}>
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`br-metric-card ${colorClass}`}>
        <div className="br-metric-content">
          <div className="d-flex align-items-center w-100">
            <div 
              className="br-metric-icon d-flex align-items-center justify-content-center"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '50%',
                width: '48px',
                height: '48px'
              }}
            >
              <div 
                className="spinner-border spinner-border-sm"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <div className="br-metric-details">
              <div 
                className="bg-light rounded"
                style={{ height: '12px', width: '80px', opacity: 0.3 }}
              />
              <div 
                className="bg-light rounded mt-2"
                style={{ height: '24px', width: '120px', opacity: 0.3 }}
              />
              <div 
                className="bg-light rounded mt-1"
                style={{ height: '10px', width: '100px', opacity: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`br-metric-card ${colorClass}`}>
      <div className="br-metric-content">
        {Icon && <Icon className="br-metric-icon" />}
        <div className="br-metric-details">
          <div className="br-metric-label">{title}</div>
          <h3>{formatValue(value)}</h3>
          <div className="br-metric-subtitle d-flex align-items-center">
            {subtitle}
            {trendValue && (
              <span className="d-flex align-items-center ms-2">
                {getTrendIcon()}
                <span className="tx-11 ms-1">{trendValue}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Optional chart area */}
      <div 
        className="position-absolute bottom-0 start-0 w-100"
        style={{ 
          height: '40px', 
          background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' 
        }}
      />
    </div>
  );
};

// Predefined metric cards for common financial metrics
export const RevenueMetricCard = ({ value, subtitle, trend, trendValue, loading }) => (
  <BracketMetricCard
    title="Ingresos Totales"
    value={value}
    subtitle={subtitle}
    colorClass="bg-success"
    trend={trend}
    trendValue={trendValue}
    loading={loading}
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    )}
  />
);

export const ClientsMetricCard = ({ value, subtitle, trend, trendValue, loading }) => (
  <BracketMetricCard
    title="Total Clientes"
    value={value}
    subtitle={subtitle}
    colorClass="bg-info"
    trend={trend}
    trendValue={trendValue}
    loading={loading}
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    )}
  />
);

export const EbitdaMetricCard = ({ value, subtitle, trend, trendValue, loading }) => (
  <BracketMetricCard
    title="EBITDA"
    value={value}
    subtitle={subtitle}
    colorClass={value >= 0 ? "bg-primary" : "bg-danger"}
    trend={trend}
    trendValue={trendValue}
    loading={loading}
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
  />
);

export const CostsMetricCard = ({ value, subtitle, trend, trendValue, loading }) => (
  <BracketMetricCard
    title="Costes Totales"
    value={value}
    subtitle={subtitle}
    colorClass="bg-warning"
    trend={trend}
    trendValue={trendValue}
    loading={loading}
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    )}
  />
);

export default BracketMetricCard;