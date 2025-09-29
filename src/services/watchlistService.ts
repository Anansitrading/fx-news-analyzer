import { Watchlist } from '@/types';

const WATCHLIST_STORAGE_KEY = 'fx-analyzer-watchlist';

// Default FX pairs to include in the watchlist
const DEFAULT_SYMBOLS = [
  'EURUSD',
  'GBPUSD', 
  'USDJPY',
  'USDCHF',
  'AUDUSD',
  'USDCAD',
  'NZDUSD'
];

export class WatchlistService {
  private static instance: WatchlistService;
  private watchlist: Watchlist;

  private constructor() {
    this.watchlist = this.loadWatchlist();
  }

  static getInstance(): WatchlistService {
    if (!WatchlistService.instance) {
      WatchlistService.instance = new WatchlistService();
    }
    return WatchlistService.instance;
  }

  private loadWatchlist(): Watchlist {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error);
    }

    // Return default watchlist if nothing stored or error occurred
    return this.createDefaultWatchlist();
  }

  private createDefaultWatchlist(): Watchlist {
    return {
      id: 'default',
      name: 'My Watchlist',
      symbols: DEFAULT_SYMBOLS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private saveWatchlist(): void {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(this.watchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage:', error);
    }
  }

  getWatchlist(): Watchlist {
    return { ...this.watchlist };
  }

  getSymbols(): string[] {
    return [...this.watchlist.symbols];
  }

  addSymbol(symbol: string): boolean {
    const upperSymbol = symbol.toUpperCase();
    
    // Check if symbol already exists
    if (this.watchlist.symbols.includes(upperSymbol)) {
      return false;
    }

    // Validate FX pair format (basic validation)
    if (!this.isValidFXSymbol(upperSymbol)) {
      throw new Error('Invalid FX symbol format');
    }

    this.watchlist.symbols.push(upperSymbol);
    this.watchlist.updatedAt = new Date().toISOString();
    this.saveWatchlist();
    return true;
  }

  removeSymbol(symbol: string): boolean {
    const upperSymbol = symbol.toUpperCase();
    const index = this.watchlist.symbols.indexOf(upperSymbol);
    
    if (index === -1) {
      return false;
    }

    this.watchlist.symbols.splice(index, 1);
    this.watchlist.updatedAt = new Date().toISOString();
    this.saveWatchlist();
    return true;
  }

  hasSymbol(symbol: string): boolean {
    return this.watchlist.symbols.includes(symbol.toUpperCase());
  }

  clearWatchlist(): void {
    this.watchlist.symbols = [];
    this.watchlist.updatedAt = new Date().toISOString();
    this.saveWatchlist();
  }

  resetToDefault(): void {
    this.watchlist = this.createDefaultWatchlist();
    this.saveWatchlist();
  }

  updateWatchlistName(name: string): void {
    this.watchlist.name = name;
    this.watchlist.updatedAt = new Date().toISOString();
    this.saveWatchlist();
  }

  private isValidFXSymbol(symbol: string): boolean {
    // Basic validation for FX pair symbols (6 characters, all letters)
    const fxRegex = /^[A-Z]{6}$/;
    return fxRegex.test(symbol);
  }

  // Get popular FX symbols for suggestions
  getPopularSymbols(): string[] {
    return [
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
      'EURJPY', 'GBPJPY', 'EURGBP', 'AUDCAD', 'GBPAUD', 'EURAUD', 'USDSGD',
      'EURCHF', 'AUDNZD', 'NZDCAD', 'GBPCAD', 'GBPCHF', 'CADCHF', 'AUDJPY',
      'NZDJPY', 'CHFJPY', 'EURNZD', 'AUDCHF', 'NZDUSD', 'CADJPY'
    ];
  }
}