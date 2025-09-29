import { useState, useEffect } from 'react';
import { NewsItem, Watchlist as WatchlistType, MarketData } from './types';
import { WatchlistService } from './services/watchlistService';
import { FXApiService } from './services/api/fxApiService';
import { NewsApiService } from './services/api/newsApiService';
import { useDataUpdates } from './hooks/useDataUpdates';
import Watchlist from './components/Watchlist';
import FXDataGrid from './components/FXDataGrid';
import NewsPanel from './components/NewsPanel';
import Header from './components/Header';
import { Activity } from 'lucide-react';

function App() {
  const [watchlist, setWatchlist] = useState<WatchlistType | null>(null);
  const [marketData, setMarketData] = useState<MarketData>({
    fxPairs: [],
    lastUpdated: '',
    status: 'DISCONNECTED'
  });
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Services
  const [watchlistService] = useState(() => WatchlistService.getInstance());
  const [fxApiService] = useState(() => new FXApiService());
  const [newsApiService] = useState(() => new NewsApiService());
  const [autoUpdateEnabled] = useState(true);

  // Real-time data updates
  useDataUpdates({
    enabled: autoUpdateEnabled && !isLoading,
    intervalMs: 30000, // Update every 30 seconds
    onUpdate: async () => {
      if (watchlist) {
        await Promise.all([
          loadMarketData(watchlist.symbols),
          loadNews()
        ]);
      }
    },
    onError: (error) => {
      console.error('Auto-update failed:', error);
      setError(`Auto-update failed: ${error.message}`);
    }
  });

  useEffect(() => {
    initializeApp();
    return () => {
      // Cleanup - no longer needed for API services
    };
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Load watchlist
      const loadedWatchlist = watchlistService.getWatchlist();
      setWatchlist(loadedWatchlist);
      
      // No initialization needed for API services
      
      // Load initial data
      await Promise.all([
        loadMarketData(loadedWatchlist.symbols),
        loadNews()
      ]);
      
      setError(null);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Failed to initialize application. Please refresh to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarketData = async (symbols: string[]) => {
    try {
      setMarketData(prev => ({ ...prev, status: 'CONNECTED' }));
      
      // Use API service to fetch FX data
      const fxData = await fxApiService.getFXData(symbols);
      
      setMarketData({
        fxPairs: fxData,
        lastUpdated: new Date().toISOString(),
        status: 'CONNECTED'
      });
    } catch (err) {
      console.error('Failed to load market data:', err);
      setMarketData(prev => ({ ...prev, status: 'ERROR' }));
      setError('Failed to load market data');
    }
  };

  const loadNews = async () => {
    try {
      const newsItems = await newsApiService.fetchNews();
      setNews(newsItems);
    } catch (err) {
      console.error('Failed to load news:', err);
    }
  };

  const handleAddSymbol = async (symbol: string) => {
    try {
      const success = watchlistService.addSymbol(symbol);
      if (success) {
        const updatedWatchlist = watchlistService.getWatchlist();
        setWatchlist(updatedWatchlist);
        
        // Load data for the new symbol
        const symbolData = await fxApiService.getSingleFXData(symbol);
        if (symbolData) {
          setMarketData(prev => ({
            ...prev,
            fxPairs: [...prev.fxPairs, symbolData],
            lastUpdated: new Date().toISOString()
          }));
        }
      }
    } catch (err) {
      console.error('Failed to add symbol:', err);
      setError(`Failed to add symbol: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    const success = watchlistService.removeSymbol(symbol);
    if (success) {
      const updatedWatchlist = watchlistService.getWatchlist();
      setWatchlist(updatedWatchlist);
      
      // Remove from market data
      setMarketData(prev => ({
        ...prev,
        fxPairs: prev.fxPairs.filter(pair => pair.symbol !== symbol),
        lastUpdated: new Date().toISOString()
      }));
      
      // Clear selection if removing selected symbol
      if (selectedSymbol === symbol) {
        setSelectedSymbol(null);
      }
    }
  };

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol === selectedSymbol ? null : symbol);
  };

  const handleRefreshData = async () => {
    if (!watchlist) return;
    await loadMarketData(watchlist.symbols);
    await loadNews();
  };

  const getNewsForSelectedSymbol = (): NewsItem[] => {
    if (!selectedSymbol) return [];
    return news.filter(item => item.symbols.includes(selectedSymbol));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading FX News Analyzer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        marketStatus={marketData.status}
        lastUpdated={marketData.lastUpdated}
        onRefresh={handleRefreshData}
      />
      
      {error && (
        <div className="mx-4 mt-4 p-4 bg-danger-50 border border-danger-200 rounded-md">
          <p className="text-danger-700">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-danger-600 hover:text-danger-800"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Watchlist Sidebar */}
          <div className="lg:col-span-1">
            <Watchlist
              watchlist={watchlist}
              onAddSymbol={handleAddSymbol}
              onRemoveSymbol={handleRemoveSymbol}
              selectedSymbol={selectedSymbol}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <FXDataGrid
              fxPairs={marketData.fxPairs}
              selectedSymbol={selectedSymbol}
              onSymbolClick={handleSymbolClick}
              lastUpdated={marketData.lastUpdated}
            />
          </div>
          
          {/* News Panel */}
          <div className="lg:col-span-1">
            <NewsPanel
              news={selectedSymbol ? getNewsForSelectedSymbol() : news}
              selectedSymbol={selectedSymbol}
              title={selectedSymbol ? `${selectedSymbol} News` : 'Latest News'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;