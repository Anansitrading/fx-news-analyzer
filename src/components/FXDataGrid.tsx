import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { FXPair } from '@/types';
import { format } from 'date-fns';

interface FXDataGridProps {
  fxPairs: FXPair[];
  selectedSymbol: string | null;
  onSymbolClick: (symbol: string) => void;
  lastUpdated: string;
}

const FXDataGrid: React.FC<FXDataGridProps> = ({
  fxPairs,
  selectedSymbol,
  onSymbolClick,
  lastUpdated
}) => {
  const formatPrice = (price: number): string => {
    return price.toFixed(5);
  };

  const formatChange = (change: number): string => {
    return change >= 0 ? `+${change.toFixed(5)}` : change.toFixed(5);
  };

  const formatChangePercent = (changePercent: number): string => {
    return `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-success-600';
    if (change < 0) return 'text-danger-600';
    return 'text-gray-500';
  };

  if (fxPairs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">FX Market Data</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No FX data available</p>
          <p className="text-sm text-gray-400 mt-2">Add symbols to your watchlist to see market data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">FX Market Data</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated {format(new Date(lastUpdated), 'HH:mm:ss')}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid/Ask
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fxPairs.map((pair) => (
                <tr
                  key={pair.symbol}
                  onClick={() => onSymbolClick(pair.symbol)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSymbol === pair.symbol
                      ? 'bg-primary-50 border-l-4 border-primary-500'
                      : ''
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span 
                          className={`font-mono text-sm font-medium ${
                            selectedSymbol === pair.symbol 
                              ? 'text-primary-700' 
                              : 'text-gray-900'
                          }`}
                        >
                          {pair.symbol}
                        </span>
                      </div>
                      <div className="ml-2">
                        <span className="text-xs text-gray-500">{pair.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="text-sm font-mono">
                      <div className="text-gray-900">{formatPrice(pair.bid)}</div>
                      <div className="text-xs text-gray-500">{formatPrice(pair.ask)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className={`flex items-center justify-end space-x-1 ${getChangeColor(pair.change)}`}>
                      {getChangeIcon(pair.change)}
                      <span className="text-sm font-mono">
                        {formatChange(pair.change)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className={`text-sm font-semibold ${getChangeColor(pair.changePercent)}`}>
                      {formatChangePercent(pair.changePercent)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Click on a symbol to view related news • Real-time data from TradingView
      </div>
    </div>
  );
};

export default FXDataGrid;