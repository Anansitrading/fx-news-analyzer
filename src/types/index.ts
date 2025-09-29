export interface FXPair {
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  timestamp: string;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  source: string;
  url: string;
  symbols: string[];
  marketImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  tags: string[];
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketData {
  fxPairs: FXPair[];
  lastUpdated: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export interface AppState {
  watchlist: Watchlist;
  marketData: MarketData;
  news: NewsItem[];
  selectedSymbol: string | null;
  isLoading: boolean;
  error: string | null;
}