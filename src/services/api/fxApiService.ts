// Mock API service for FX data - replace with real API calls
import { FXPair } from '@/types';

export class FXApiService {
  private mockData: FXPair[] = [
    {
      symbol: 'EURUSD',
      name: 'EUR/USD',
      bid: 1.0543,
      ask: 1.0545,
      change: 0.0012,
      changePercent: 0.11,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'GBPUSD',
      name: 'GBP/USD',
      bid: 1.2678,
      ask: 1.2680,
      change: -0.0023,
      changePercent: -0.18,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'USDJPY',
      name: 'USD/JPY',
      bid: 149.32,
      ask: 149.34,
      change: 0.45,
      changePercent: 0.30,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'USDCHF',
      name: 'USD/CHF',
      bid: 0.9012,
      ask: 0.9014,
      change: -0.0008,
      changePercent: -0.09,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'AUDUSD',
      name: 'AUD/USD',
      bid: 0.6543,
      ask: 0.6545,
      change: 0.0015,
      changePercent: 0.23,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'USDCAD',
      name: 'USD/CAD',
      bid: 1.3567,
      ask: 1.3569,
      change: 0.0021,
      changePercent: 0.15,
      timestamp: new Date().toISOString()
    },
    {
      symbol: 'NZDUSD',
      name: 'NZD/USD',
      bid: 0.5987,
      ask: 0.5989,
      change: -0.0011,
      changePercent: -0.18,
      timestamp: new Date().toISOString()
    }
  ];

  async getFXData(symbols: string[]): Promise<FXPair[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for requested symbols with slight variations
    return this.mockData
      .filter(pair => symbols.includes(pair.symbol))
      .map(pair => {
        // Add slight random variations to make it look real
        const variation = (Math.random() - 0.5) * 0.0005;
        return {
          ...pair,
          bid: pair.bid + variation,
          ask: pair.ask + variation,
          timestamp: new Date().toISOString()
        };
      });
  }

  async getSingleFXData(symbol: string): Promise<FXPair | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const pair = this.mockData.find(p => p.symbol === symbol);
    if (pair) {
      // Simulate price changes
      const change = (Math.random() - 0.5) * 0.01;
      return {
        ...pair,
        bid: pair.bid + change,
        ask: pair.ask + change,
        change: change,
        changePercent: (change / pair.bid) * 100,
        timestamp: new Date().toISOString()
      };
    }
    
    // If symbol not in mock data, create a new one
    return {
      symbol,
      name: `${symbol.slice(0, 3)}/${symbol.slice(3, 6)}`,
      bid: 1.0000 + Math.random() * 0.5,
      ask: 1.0002 + Math.random() * 0.5,
      change: (Math.random() - 0.5) * 0.01,
      changePercent: (Math.random() - 0.5) * 2,
      timestamp: new Date().toISOString()
    };
  }
}