// Mock API service for news data - replace with real API calls
import { NewsItem } from '@/types';

export class NewsApiService {
  private mockNews: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Fed Signals Potential Rate Cut in Q2 2025',
      content: 'Federal Reserve officials indicated they may consider rate cuts in the second quarter of 2025 as inflation shows signs of cooling. Markets reacted positively to the dovish stance.',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/1',
      symbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
      marketImpact: 'HIGH',
      tags: ['Fed', 'Interest Rates', 'Monetary Policy']
    },
    {
      id: 'news-2',
      title: 'ECB Maintains Hawkish Stance Despite Growth Concerns',
      content: 'The European Central Bank reiterated its commitment to fighting inflation, suggesting rates will remain elevated for longer than previously expected.',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/2',
      symbols: ['EURUSD', 'EURGBP', 'EURJPY'],
      marketImpact: 'HIGH',
      tags: ['ECB', 'Europe', 'Inflation']
    },
    {
      id: 'news-3',
      title: 'UK Retail Sales Beat Expectations',
      content: 'British retail sales rose more than expected in the latest month, suggesting consumer resilience despite economic headwinds.',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/3',
      symbols: ['GBPUSD', 'EURGBP', 'GBPJPY'],
      marketImpact: 'MEDIUM',
      tags: ['UK', 'Retail Sales', 'Economic Data']
    },
    {
      id: 'news-4',
      title: 'Bank of Japan Hints at Policy Normalization',
      content: 'BoJ officials suggested they may begin unwinding ultra-loose monetary policy if wage growth continues to accelerate.',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/4',
      symbols: ['USDJPY', 'EURJPY', 'GBPJPY'],
      marketImpact: 'HIGH',
      tags: ['BoJ', 'Japan', 'Monetary Policy']
    },
    {
      id: 'news-5',
      title: 'Australian Employment Data Mixed',
      content: 'Australia reported mixed employment figures with job creation slowing but unemployment rate remaining steady.',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/5',
      symbols: ['AUDUSD', 'AUDNZD', 'AUDJPY'],
      marketImpact: 'LOW',
      tags: ['Australia', 'Employment', 'Economic Data']
    },
    {
      id: 'news-6',
      title: 'Oil Prices Surge on Supply Concerns',
      content: 'Crude oil prices jumped as OPEC+ members signaled potential production cuts, impacting commodity currencies.',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/6',
      symbols: ['USDCAD', 'NZDUSD', 'AUDUSD'],
      marketImpact: 'MEDIUM',
      tags: ['Oil', 'Commodities', 'OPEC']
    },
    {
      id: 'news-7',
      title: 'Swiss Franc Gains as Safe Haven Demand Rises',
      content: 'The Swiss franc strengthened against major currencies as geopolitical tensions increased safe haven demand.',
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
      source: 'Financial Juice',
      url: 'https://example.com/news/7',
      symbols: ['USDCHF', 'EURCHF', 'GBPCHF'],
      marketImpact: 'MEDIUM',
      tags: ['Switzerland', 'Safe Haven', 'Geopolitics']
    }
  ];

  async fetchNews(): Promise<NewsItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock news with current timestamps
    return this.mockNews.map(news => ({
      ...news,
      // Keep relative time but update to current
      publishedAt: news.publishedAt
    }));
  }

  async getNewsForSymbol(symbol: string): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.mockNews.filter(news => news.symbols.includes(symbol));
  }

  async searchNews(query: string): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const lowerQuery = query.toLowerCase();
    return this.mockNews.filter(news => 
      news.title.toLowerCase().includes(lowerQuery) ||
      news.content.toLowerCase().includes(lowerQuery) ||
      news.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}