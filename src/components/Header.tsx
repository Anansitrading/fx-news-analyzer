import React from 'react';
import { RefreshCw, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  marketStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastUpdated: string;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ marketStatus, lastUpdated, onRefresh }) => {
  const getStatusInfo = () => {
    switch (marketStatus) {
      case 'CONNECTED':
        return {
          icon: CheckCircle,
          text: 'Connected',
          className: 'text-success-600'
        };
      case 'ERROR':
        return {
          icon: AlertCircle,
          text: 'Error',
          className: 'text-danger-600'
        };
      default:
        return {
          icon: Activity,
          text: 'Disconnected',
          className: 'text-gray-400'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <header className=\"bg-white shadow-sm border-b\">
      <div className=\"container mx-auto px-4 py-4\">
        <div className=\"flex items-center justify-between\">
          <div className=\"flex items-center space-x-3\">
            <h1 className=\"text-2xl font-bold text-gray-900\">FX News Analyzer</h1>
            <div className={`flex items-center space-x-1 ${statusInfo.className}`}>
              <StatusIcon className=\"h-4 w-4\" />
              <span className=\"text-sm font-medium\">{statusInfo.text}</span>
            </div>
          </div>
          
          <div className=\"flex items-center space-x-4\">
            {lastUpdated && (
              <div className=\"text-sm text-gray-500\">
                Last updated: {format(new Date(lastUpdated), 'MMM d, HH:mm:ss')}
              </div>
            )}
            
            <button
              onClick={onRefresh}
              className=\"flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2\"
            >
              <RefreshCw className=\"h-4 w-4\" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;