# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FX News Analyzer is a React TypeScript application that provides real-time foreign exchange market data with integrated financial news analysis. The app scrapes TradingView for FX rates and correlates them with RSS news from Financial Juice.

## Development Commands

### Core Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production (TypeScript compile + Vite build)
npm run preview      # Preview production build
npm run lint         # TypeScript type checking (no ESLint configured)
```

### Playwright Setup (Required for data scraping)
```bash
npx playwright install              # Install browsers (required for TradingView scraping)
npx playwright install chromium     # Install only Chromium if needed
```

### Development Server
- **Port**: 3000 (configured in vite.config.ts)
- **Host**: Available on all network interfaces
- **Hot reload**: Enabled via Vite

## Architecture Overview

### Service Layer Architecture
The application follows a service-oriented architecture with three main services that handle external data sources:

1. **TradingViewService** (`src/services/tradingViewService.ts`)
   - Uses Playwright to scrape FX data from TradingView
   - Handles authentication with hardcoded credentials
   - Manages browser lifecycle and rate limiting (2-second delays)
   - Extracts real-time price data with change indicators

2. **NewsService** (`src/services/newsService.ts`) 
   - Fetches RSS feed from Financial Juice
   - Scrapes full article content using Playwright
   - Implements intelligent symbol correlation using keyword matching
   - Classifies market impact levels (HIGH/MEDIUM/LOW)

3. **WatchlistService** (`src/services/watchlistService.ts`)
   - Singleton pattern for watchlist management
   - Persistent storage using localStorage
   - Validates FX symbol format (6-character pairs)

### Data Flow Pattern
- **useDataUpdates Hook**: Central hook for real-time updates every 30 seconds
- **State Management**: React useState with lifting state up to App.tsx
- **Error Boundaries**: Comprehensive error handling with user feedback
- **Symbol Correlation**: Click any FX pair to see related news filtered by keyword matching

### Component Structure
```
src/
├── components/              # React components
│   ├── Header.tsx          # Status indicator and refresh controls  
│   ├── Watchlist.tsx       # Symbol management sidebar
│   ├── FXDataGrid.tsx      # Main data table with selection
│   ├── NewsPanel.tsx       # News display with impact classification
│   └── ErrorBoundary.tsx   # Error handling wrapper
├── services/               # Business logic layer
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript interfaces
└── App.tsx                # Main app with service coordination
```

## Key Technical Concepts

### Web Scraping Architecture
Both TradingViewService and NewsService use Playwright with:
- **Headless browsing**: Set to `false` for TradingView (debugging), `true` for NewsService
- **Rate limiting**: 2-second delays between TradingView requests
- **User agent spoofing**: Chrome Linux user agent for both services
- **Error resilience**: Try/catch blocks with graceful degradation

### Authentication Handling
- TradingView credentials are hardcoded in App.tsx (anansitrading@gmail.com)
- Authentication state is managed in TradingViewService
- Auto-reauthentication on failed requests

### Symbol Correlation System
NewsService implements intelligent FX symbol correlation:
- **Keyword mapping**: Each FX pair has associated keywords (central banks, currency names)
- **Impact classification**: THREE levels based on keyword analysis
- **Cross-pair news**: Identifies news affecting multiple currency pairs

### Real-time Updates
- **useDataUpdates hook**: Manages 30-second update intervals
- **Update coordination**: Both market data and news updated together
- **Conflict prevention**: Prevents overlapping updates with `isUpdating` flag

## Development Guidelines

### Service Development
When modifying services, maintain the existing patterns:
- Services are initialized once in App.tsx
- All services implement `initialize()` and `close()` methods
- Error handling should not break the application flow
- Rate limiting is crucial for scraping services

### Adding New FX Pairs
1. Add to `DEFAULT_SYMBOLS` in WatchlistService
2. Add keyword mappings in NewsService `FX_KEYWORDS` object
3. Test symbol validation regex in WatchlistService

### Browser Compatibility
- TradingView scraping requires Chromium-based browsers
- Playwright selector strategies may need updates if TradingView changes their DOM
- News scraping uses multiple fallback selectors for content extraction

### Performance Considerations
- **Browser overhead**: Each service maintains its own Playwright browser instance
- **Memory management**: Services implement proper cleanup in `close()` methods  
- **Update throttling**: 30-second intervals prevent overwhelming external services
- **Local storage**: Watchlist persistence reduces API calls

## External Dependencies

### Critical Runtime Dependencies
- **Playwright**: Required for all data scraping functionality
- **TradingView access**: Requires valid credentials for market data
- **Financial Juice RSS**: News feed dependency (https://financialjuice.com/feed.ashx?xy=rss)

### UI Framework
- **Tailwind CSS**: Custom color palette with primary/success/danger variants
- **Lucide React**: Icon library for UI elements
- **date-fns**: Date formatting and manipulation

## Debugging and Troubleshooting

### Common Issues
1. **Playwright installation**: Run `npx playwright install` if browser automation fails
2. **TradingView authentication**: Check credentials and selector changes
3. **News feed failures**: RSS feed may be temporarily unavailable
4. **Memory leaks**: Ensure services are properly closed on component unmount

### Development Mode Features
- **Console logging**: Extensive logging in all services
- **Error boundaries**: Development error details shown in UI
- **Hot reload**: Vite provides instant updates during development
- **Source maps**: Enabled in production build for debugging

### Browser DevTools
- **Network tab**: Monitor TradingView and RSS requests
- **Application tab**: Check localStorage for watchlist persistence
- **Console**: Service initialization and error messages