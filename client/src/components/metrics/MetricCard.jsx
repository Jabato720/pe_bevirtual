const MetricCard = ({ 
  label, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  className = ''
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '';
    }
  };

  return (
    <div className={`
      bg-white border border-gray-200 rounded-xl p-6 
      hover:shadow-md hover:-translate-y-1 
      transition-all duration-200
      ${className}
    `}>
      {icon && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
        </div>
      )}
      
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </div>
      
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      
      {change && (
        <div className={`text-sm font-medium ${getChangeColor()}`}>
          <span className="mr-1">{getChangeIcon()}</span>
          {change}
        </div>
      )}
    </div>
  );
};

export default MetricCard;