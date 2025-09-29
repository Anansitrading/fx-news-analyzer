import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { FXPair } from '@/types';

export interface TradingViewCredentials {
  email: string;
  password: string;
}

export class TradingViewService {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private isAuthenticated = false;
  private credentials: TradingViewCredentials;

  constructor(credentials: TradingViewCredentials) {
    this.credentials = credentials;
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: false, // Set to true for production
        args: ['--no-sandbox', '--disable-dev-shm-usage']
      });
      
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      this.page = await this.context.newPage();
      
      // Set up request interception to monitor API calls
      await this.page.route('**/pine-facade/**', route => {
        console.log('API call intercepted:', route.request().url());
        route.continue();
      });
      
    } catch (error) {
      console.error('Failed to initialize TradingView service:', error);
      throw error;
    }
  }

  async authenticate(): Promise<boolean> {
    if (!this.page) {
      throw new Error('TradingView service not initialized');
    }

    try {
      await this.page.goto('https://www.tradingview.com/accounts/signin/', {
        waitUntil: 'networkidle'
      });

      // Handle cookie consent if present
      try {
        await this.page.click('button[data-name="agree-all"]', { timeout: 5000 });
      } catch {
        // Cookie consent might not appear
      }

      // Wait for login form
      await this.page.waitForSelector('input[name="username"]');
      
      // Fill in credentials
      await this.page.fill('input[name="username"]', this.credentials.email);
      await this.page.fill('input[name="password"]', this.credentials.password);
      
      // Click login button
      await this.page.click('button[type="submit"]');
      
      // Wait for either successful login or error
      try {
        await this.page.waitForURL('https://www.tradingview.com/', { timeout: 30000 });
        this.isAuthenticated = true;
        console.log('Successfully authenticated with TradingView');
        return true;
      } catch (error) {
        console.error('Authentication failed:', error);
        return false;
      }
      
    } catch (error) {
      console.error('Error during authentication:', error);
      return false;
    }
  }

  async getFXData(symbol: string): Promise<FXPair | null> {
    if (!this.page) {
      throw new Error('TradingView service not initialized');
    }

    try {
      const url = `https://www.tradingview.com/symbols/${symbol}/`;
      await this.page.goto(url, { waitUntil: 'networkidle' });

      // Wait for the price data to load
      await this.page.waitForSelector('[data-symbol-short]', { timeout: 10000 });

      // Extract price information
      const priceData = await this.page.evaluate(() => {
        // Try multiple selectors for price data
        const priceSelectors = [
          '[data-field="last_price"]',
          '.tv-symbol-price-quote__value',
          '[class*="last-JWoJqCpY"]'
        ];

        let price = null;
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            price = parseFloat(element.textContent?.replace(/[^0-9.-]/g, '') || '0');
            break;
          }
        }

        // Try to get change information
        const changeSelectors = [
          '[data-field="change"]',
          '[class*="change-JWoJqCpY"]',
          '.tv-symbol-price-quote__change'
        ];

        let change = 0;
        let changePercent = 0;
        
        for (const selector of changeSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const changeText = element.textContent || '';
            change = parseFloat(changeText.replace(/[^0-9.-]/g, '') || '0');
            break;
          }
        }

        // Try to get percentage change
        const percentSelectors = [
          '[data-field="change_percent"]',
          '[class*="changePercent-JWoJqCpY"]'
        ];

        for (const selector of percentSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const percentText = element.textContent || '';
            changePercent = parseFloat(percentText.replace(/[^0-9.-]/g, '') || '0');
            break;
          }
        }

        return {
          price,
          change,
          changePercent,
          timestamp: new Date().toISOString()
        };
      });

      if (priceData.price) {
        return {
          symbol: symbol,
          name: this.formatSymbolName(symbol),
          bid: priceData.price - 0.0001, // Approximate bid
          ask: priceData.price + 0.0001, // Approximate ask
          change: priceData.change,
          changePercent: priceData.changePercent,
          timestamp: priceData.timestamp
        };
      }

      return null;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleFXData(symbols: string[]): Promise<FXPair[]> {
    const results: FXPair[] = [];
    
    for (const symbol of symbols) {
      try {
        const data = await this.getFXData(symbol);
        if (data) {
          results.push(data);
        }
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to get data for ${symbol}:`, error);
      }
    }
    
    return results;
  }

  private formatSymbolName(symbol: string): string {
    // Convert EURUSD to EUR/USD format
    const base = symbol.slice(0, 3);
    const quote = symbol.slice(3, 6);
    return `${base}/${quote}`;
  }

  async searchSymbol(query: string): Promise<string[]> {
    if (!this.page) {
      throw new Error('TradingView service not initialized');
    }

    try {
      await this.page.goto('https://www.tradingview.com/');
      
      // Click on search
      await this.page.click('[data-name="header-symbol-search"]');
      
      // Type in search query
      await this.page.fill('input[data-role="search"]', query);
      await this.page.waitForTimeout(1000);
      
      // Extract search results
      const results = await this.page.$$eval(
        '[data-role="search-result"]',
        elements => elements
          .slice(0, 5)
          .map(el => el.textContent?.split(' ')[0] || '')
          .filter(symbol => symbol.length === 6)
      );
      
      return results;
    } catch (error) {
      console.error('Error searching symbols:', error);
      return [];
    }
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    
    this.isAuthenticated = false;
  }

  isReady(): boolean {
    return this.browser !== null && this.page !== null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}