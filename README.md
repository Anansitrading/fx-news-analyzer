# FX News Analyzer

A comprehensive foreign exchange market data analyzer with integrated news correlation. Monitor FX rates from TradingView and get real-time news updates from Financial Juice with market impact analysis.

![FX News Analyzer](https://img.shields.io/badge/React-18.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Playwright](https://img.shields.io/badge/Playwright-Latest-green)

## 🚀 Features

- **Real-time FX Data**: Live currency pair rates scraped from TradingView
- **Watchlist Management**: Add/remove FX symbols with persistent storage
- **News Integration**: RSS feed from Financial Juice with web scraping
- **Symbol Correlation**: Click any FX pair to see related news
- **Market Impact Analysis**: Automated classification of news impact levels
- **Responsive Design**: Professional financial dashboard UI
- **Auto-updates**: Real-time data refresh every 30 seconds
- **Error Handling**: Comprehensive error boundaries and retry mechanisms

## 📋 Supported FX Pairs

- **Major Pairs**: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD
- **Cross Pairs**: EUR/JPY, GBP/JPY, EUR/GBP, AUD/CAD, GBP/AUD, EUR/AUD
- **Exotic Pairs**: USD/SGD, EUR/CHF, AUD/NZD, NZD/CAD, GBP/CAD, and more

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Data Sources**: TradingView (Playwright scraping), Financial Juice RSS
- **Build Tool**: Vite
- **UI Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Automation**: Playwright for web scraping

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Chrome/Chromium browser (for Playwright)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fx-news-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to `http://localhost:3000` in your browser

## 🔧 Configuration

### TradingView Credentials

The application is pre-configured with TradingView credentials:
- **Email**: anansitrading@gmail.com
- **Password**: Jack0FallTrade$

### Data Sources

- **FX Data**: [TradingView](https://www.tradingview.com)
- **News Feed**: [Financial Juice RSS](https://www.financialjuice.com/feed.ashx?xy=rss)

### Update Intervals

- **Market Data**: 30 seconds (configurable)
- **News Feed**: On demand and auto-refresh

## 📱 Usage

### Getting Started

1. **Initial Load**: The app loads with default major FX pairs
2. **Add Symbols**: Use the watchlist sidebar to add new FX pairs
3. **View Data**: Monitor real-time rates in the main data grid
4. **Read News**: Browse latest financial news in the right panel
5. **Symbol Focus**: Click any FX pair to see symbol-specific news

### Key Features

#### Watchlist Management
- Add symbols using the input field or popular suggestions
- Remove symbols with the trash icon
- Symbols are automatically saved to local storage

#### Market Data Display
- **Bid/Ask Prices**: Real-time pricing with 5-decimal precision
- **Change Indicators**: Color-coded price movements with trend arrows
- **Percentage Change**: Daily percentage change calculations
- **Symbol Selection**: Click rows to view related news

#### News Integration
- **Impact Classification**: HIGH/MEDIUM/LOW market impact levels
- **Symbol Correlation**: News items tagged with relevant FX pairs
- **Time Stamps**: Relative time display (e.g., "2 hours ago")
- **External Links**: Direct links to full articles
- **Content Preview**: Truncated content with key information

### UI Components

- **Header**: Status indicator, last update time, refresh controls
- **Watchlist**: Symbol management, suggestions, statistics
- **Data Grid**: Sortable FX rates table with selection
- **News Panel**: Categorized news with filtering and links

## 🔍 Data Sources & Scraping

### TradingView Integration

The application uses Playwright to scrape data from TradingView:

- **Authentication**: Automated login with provided credentials
- **Data Extraction**: Real-time price data from symbol pages
- **Rate Limiting**: 2-second delays between requests
- **Error Handling**: Retry mechanisms for failed requests

### Financial Juice RSS

- **RSS Parsing**: Automated parsing of XML feed
- **Content Scraping**: Full article content extraction
- **Symbol Detection**: Keyword matching for FX pair correlation
- **Impact Analysis**: Automated market impact classification

### Compliance & Ethics

- **Respectful Scraping**: Appropriate delays and rate limiting
- **Personal Use**: Credentials and data for authorized personal use
- **Error Handling**: Graceful degradation when services are unavailable

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with status
│   ├── Watchlist.tsx   # Symbol management
│   ├── FXDataGrid.tsx  # Market data table
│   ├── NewsPanel.tsx   # News display
│   └── ErrorBoundary.tsx # Error handling
├── services/           # Business logic
│   ├── watchlistService.ts    # Watchlist management
│   ├── tradingViewService.ts  # TradingView scraping
│   └── newsService.ts         # News processing
├── hooks/              # Custom React hooks
│   └── useDataUpdates.ts     # Real-time updates
├── types/              # TypeScript definitions
│   └── index.ts        # Interface definitions
├── utils/              # Utility functions
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - TypeScript type checking

### Development Setup

1. **Hot Reloading**: Vite provides instant updates during development
2. **TypeScript**: Full type safety with strict mode enabled
3. **Debugging**: React DevTools compatible
4. **Error Boundaries**: Development error details in browser

### Code Organization

- **Services**: Encapsulated data access and business logic
- **Components**: Reusable UI components with TypeScript props
- **Hooks**: Custom hooks for shared stateful logic
- **Types**: Comprehensive TypeScript interfaces
- **Utilities**: Helper functions and constants

## 🚀 Deployment

### Build Process

```bash
npm run build
```

### Production Considerations

1. **Environment Variables**: Set up production API keys if needed
2. **Error Monitoring**: Consider integrating error tracking
3. **Performance**: Enable gzip compression for assets
4. **Security**: Ensure secure handling of credentials
5. **Monitoring**: Set up uptime monitoring for data sources

## 🔧 Troubleshooting

### Common Issues

**Data Not Loading**
- Check network connectivity
- Verify TradingView credentials
- Ensure Playwright browsers are installed

**News Feed Empty** 
- Verify RSS feed accessibility
- Check network firewall settings
- Review console for parsing errors

**Performance Issues**
- Reduce update frequency in settings
- Clear browser cache and local storage
- Check system resources during scraping

**Playwright Issues**
- Reinstall browsers: `npx playwright install`
- Update Playwright: `npm update playwright`
- Check system dependencies

### Debug Mode

Enable development mode for detailed error information:
- Set `NODE_ENV=development`
- Check browser console for detailed logs
- Use React DevTools for component inspection

## 📈 Future Enhancements

- [ ] **Historical Data**: Chart integration with historical FX data
- [ ] **Alerts System**: Price and news-based notification system  
- [ ] **Portfolio Tracking**: Integration with trading accounts
- [ ] **Technical Analysis**: Moving averages and technical indicators
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Integration**: Direct broker API connections
- [ ] **Machine Learning**: Predictive analytics and sentiment analysis

## 📄 License

MIT License - Feel free to use and modify for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create a GitHub issue
- Check the troubleshooting section
- Review the console logs for error details

---

**⚠️ Disclaimer**: This tool is for informational purposes only. Not financial advice. Trading foreign exchange carries a high level of risk and may not be suitable for all investors.