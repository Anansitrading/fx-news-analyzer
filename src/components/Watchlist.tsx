import React, { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { Watchlist as WatchlistType } from '@/types';
import { WatchlistService } from '@/services/watchlistService';

interface WatchlistProps {
  watchlist: WatchlistType | null;
  onAddSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
  selectedSymbol: string | null;
}

const Watchlist: React.FC<WatchlistProps> = ({
  watchlist,
  onAddSymbol,
  onRemoveSymbol,
  selectedSymbol
}) => {
  const [newSymbol, setNewSymbol] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const watchlistService = WatchlistService.getInstance();
  const popularSymbols = watchlistService.getPopularSymbols();

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim()) {
      onAddSymbol(newSymbol.trim().toUpperCase());
      setNewSymbol('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onAddSymbol(symbol);
    setShowSuggestions(false);
  };

  const availableSuggestions = popularSymbols.filter(symbol => 
    !watchlist?.symbols.includes(symbol)
  );

  if (!watchlist) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{watchlist.name}</h2>
        <Star className="h-5 w-5 text-yellow-400 fill-current" />
      </div>

      <form onSubmit={handleAddSymbol} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Add symbol (e.g., EURUSD)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onFocus={() => setShowSuggestions(true)}
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </form>

      {showSuggestions && availableSuggestions.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-2">Popular symbols:</p>
          <div className="flex flex-wrap gap-1">
            {availableSuggestions.slice(0, 8).map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleSuggestionClick(symbol)}
                className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {symbol}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSuggestions(false)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Hide suggestions
          </button>
        </div>
      )}

      <div className="space-y-2">
        {watchlist.symbols.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No symbols in watchlist. Add some to get started!
          </p>
        ) : (
          watchlist.symbols.map((symbol) => (
            <div
              key={symbol}
              className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                selectedSymbol === symbol
                  ? 'bg-primary-100 border border-primary-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span 
                className={`font-mono text-sm ${
                  selectedSymbol === symbol 
                    ? 'text-primary-700 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {symbol}
              </span>
              <button
                onClick={() => onRemoveSymbol(symbol)}
                className="p-1 text-gray-400 hover:text-danger-600 focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-1 rounded"
                title="Remove symbol"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {watchlist.symbols.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{watchlist.symbols.length} symbols</span>
            <span>Updated {new Date(watchlist.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;