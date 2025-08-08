const StatusBadge = ({ 
  status, 
  type = 'success', // 'success', 'warning', 'danger', 'info'
  children 
}) => {
  const getStatusStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'danger':
        return '✗';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <span className={`
      inline-flex items-center space-x-1 px-3 py-1 rounded-full 
      text-xs font-medium border
      ${getStatusStyles()}
    `}>
      <span>{getStatusIcon()}</span>
      <span>{children || status}</span>
    </span>
  );
};

export default StatusBadge;