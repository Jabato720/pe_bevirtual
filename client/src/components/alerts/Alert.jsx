const Alert = ({ 
  type = 'info', // 'success', 'warning', 'danger', 'info'
  title,
  children,
  className = ''
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAlertIcon = () => {
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
    <div className={`
      border rounded-lg p-4 mb-6
      ${getAlertStyles()}
      ${className}
    `}>
      <div className="flex items-center space-x-3">
        <span className="text-lg font-semibold">{getAlertIcon()}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;