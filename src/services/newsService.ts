import RSSParser from 'rss-parser';
import { NewsItem } from '@/types';
import { chromium, Browser, BrowserContext } from 'playwright';

interface RSSItem {
  title?: string;
  content?: string;
  contentSnippet?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  categories?: string[];
}

export class NewsService {
  private rssParser: RSSParser<any, RSSItem>;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private readonly RSS_URL = 'https://www.financialjuice.com/feed.ashx?xy=rss';

  // FX symbol keywords for news correlation
  private readonly FX_KEYWORDS = {
    'EURUSD': ['EUR/USD', 'EURUSD', 'euro', 'dollar', 'ECB', 'Fed', 'European Central Bank', 'Federal Reserve'],
    'GBPUSD': ['GBP/USD', 'GBPUSD', 'pound', 'sterling', 'dollar', 'Bank of England', 'BoE', 'Fed'],
    'USDJPY': ['USD/JPY', 'USDJPY', 'dollar', 'yen', 'Bank of Japan', 'BoJ', 'Fed'],
    'USDCHF': ['USD/CHF', 'USDCHF', 'dollar', 'franc', 'Swiss National Bank', 'SNB', 'Fed'],
    'AUDUSD': ['AUD/USD', 'AUDUSD', 'aussie', 'dollar', 'Reserve Bank of Australia', 'RBA', 'Fed'],
    'USDCAD': ['USD/CAD', 'USDCAD', 'dollar', 'loonie', 'Bank of Canada', 'BoC', 'Fed'],
    'NZDUSD': ['NZD/USD', 'NZDUSD', 'kiwi', 'dollar', 'Reserve Bank of New Zealand', 'RBNZ', 'Fed'],
    'EURJPY': ['EUR/JPY', 'EURJPY', 'euro', 'yen', 'ECB', 'Bank of Japan', 'BoJ'],
    'GBPJPY': ['GBP/JPY', 'GBPJPY', 'pound', 'yen', 'Bank of England', 'BoE', 'Bank of Japan'],
    'EURGBP': ['EUR/GBP', 'EURGBP', 'euro', 'pound', 'ECB', 'Bank of England', 'BoE']
  };

  // Market impact keywords
  private readonly HIGH_IMPACT_KEYWORDS = [
    'central bank', 'interest rate', 'rate cut', 'rate hike', 'monetary policy',
    'inflation', 'GDP', 'unemployment', 'non-farm payrolls', 'CPI', 'PPI',
    'FOMC', 'Federal Reserve', 'ECB', 'crisis', 'recession', 'war', 'sanctions'
  ];

  private readonly MEDIUM_IMPACT_KEYWORDS = [
    'trade', 'employment', 'manufacturing', 'retail sales', 'housing',
    'industrial production', 'consumer confidence', 'business sentiment'
  ];

  constructor() {
    this.rssParser = new RSSParser();
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
    } catch (error) {
      console.error('Failed to initialize News service:', error);
      throw error;
    }
  }

  async fetchRSSNews(): Promise<NewsItem[]> {
    try {
      const feed = await this.rssParser.parseURL(this.RSS_URL);
      const newsItems: NewsItem[] = [];

      for (const item of feed.items.slice(0, 20)) { // Get latest 20 items
        if (item.title && item.link) {
          const newsItem = await this.processNewsItem(item);
          if (newsItem) {
            newsItems.push(newsItem);
          }
        }
      }

      return newsItems;
    } catch (error) {
      console.error('Error fetching RSS news:', error);
      return [];
    }
  }

  private async processNewsItem(item: RSSItem): Promise<NewsItem | null> {
    try {
      const content = await this.scrapeFullArticle(item.link!);
      
      const newsItem: NewsItem = {
        id: this.generateNewsId(item.link!),
        title: item.title || '',
        content: content || item.contentSnippet || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: 'Financial Juice',
        url: item.link || '',
        symbols: this.extractRelevantSymbols(item.title + ' ' + content),
        marketImpact: this.determineMarketImpact(item.title + ' ' + content),
        tags: item.categories || []
      };

      return newsItem;
    } catch (error) {
      console.error('Error processing news item:', error);
      return null;
    }
  }

  private async scrapeFullArticle(url: string): Promise<string> {
    if (!this.context) {
      return '';
    }

    try {
      const page = await this.context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

      // Extract article content - this selector may need adjustment based on site structure
      const content = await page.evaluate(() => {
        const contentSelectors = [
          '.entry-content',
          '.article-content',
          '.post-content',
          'article p',
          '.content p'
        ];

        for (const selector of contentSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            return Array.from(elements)
              .map(el => el.textContent)
              .join(' ')
              .trim();
          }
        }

        return '';
      });

      await page.close();
      return content;
    } catch (error) {
      console.error('Error scraping article:', error);
      return '';
    }
  }

  private extractRelevantSymbols(text: string): string[] {
    const relevantSymbols: string[] = [];
    const lowerText = text.toLowerCase();

    for (const [symbol, keywords] of Object.entries(this.FX_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          if (!relevantSymbols.includes(symbol)) {
            relevantSymbols.push(symbol);
          }
          break;
        }
      }
    }

    return relevantSymbols;
  }

  private determineMarketImpact(text: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const lowerText = text.toLowerCase();

    // Check for high impact keywords
    for (const keyword of this.HIGH_IMPACT_KEYWORDS) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return 'HIGH';
      }
    }

    // Check for medium impact keywords
    for (const keyword of this.MEDIUM_IMPACT_KEYWORDS) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return 'MEDIUM';
      }
    }

    return 'LOW';
  }

  private generateNewsId(url: string): string {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  async getNewsForSymbol(symbol: string): Promise<NewsItem[]> {
    const allNews = await this.fetchRSSNews();
    return allNews.filter(news => news.symbols.includes(symbol));
  }

  async searchNews(query: string): Promise<NewsItem[]> {
    const allNews = await this.fetchRSSNews();
    const lowerQuery = query.toLowerCase();
    
    return allNews.filter(news => 
      news.title.toLowerCase().includes(lowerQuery) ||
      news.content.toLowerCase().includes(lowerQuery)
    );
  }

  // Get news that might impact multiple symbols
  async getCrossPairNews(): Promise<NewsItem[]> {
    const allNews = await this.fetchRSSNews();
    return allNews.filter(news => 
      news.symbols.length > 1 || 
      news.marketImpact === 'HIGH'
    );
  }

  // Get today's most impactful news
  async getTodayHighImpactNews(): Promise<NewsItem[]> {
    const allNews = await this.fetchRSSNews();
    const today = new Date().toDateString();
    
    return allNews.filter(news => {
      const newsDate = new Date(news.publishedAt).toDateString();
      return newsDate === today && news.marketImpact === 'HIGH';
    });
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}