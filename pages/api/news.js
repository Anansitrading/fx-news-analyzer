import Parser from 'rss-parser';

// Keywords for impact classification
const IMPACT_KEYWORDS = {
  HIGH: [
    'federal reserve', 'fed', 'ecb', 'bank of england', 'bank of japan',
    'interest rate', 'rate hike', 'rate cut', 'monetary policy',
    'nonfarm payroll', 'nfp', 'unemployment', 'cpi', 'inflation',
    'fomc', 'jackson hole', 'central bank', 'quantitative easing',
    'recession', 'gdp', 'economic growth', 'trade war'
  ],
  MEDIUM: [
    'retail sales', 'consumer confidence', 'pmi', 'manufacturing',
    'housing starts', 'jobless claims', 'ism', 'consumer price',
    'producer price', 'trade balance', 'current account',
    'business confidence', 'industrial production'
  ],
  LOW: [
    'earnings', 'stock', 'market outlook', 'analyst',
    'commodity', 'oil price', 'gold price'
  ]
};

// Currency keywords for correlation
const CURRENCY_KEYWORDS = {
  USD: ['dollar', 'fed', 'federal reserve', 'united states', 'us ', 'america', 'treasury'],
  EUR: ['euro', 'ecb', 'european central bank', 'eurozone', 'europe', 'germany', 'france'],
  GBP: ['pound', 'sterling', 'bank of england', 'boe', 'britain', 'uk ', 'united kingdom'],
  JPY: ['yen', 'bank of japan', 'boj', 'japan', 'nikkei'],
  CHF: ['franc', 'swiss', 'switzerland', 'snb'],
  AUD: ['aussie', 'australia', 'rba', 'reserve bank of australia'],
  CAD: ['loonie', 'canada', 'bank of canada', 'boc'],
  NZD: ['kiwi', 'new zealand', 'rbnz']
};

// News cache
let newsCache = {
  data: [],
  lastUpdate: 0,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

async function fetchAndProcessNews() {
  console.log('Starting news fetch and processing...');
  
  // Check cache
  const now = Date.now();
  if (newsCache.data.length > 0 && (now - newsCache.lastUpdate) < newsCache.CACHE_DURATION) {
    console.log('Returning cached news data');
    return newsCache.data;
  }

  const parser = new Parser({
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    }
  });

  try {
    // Try Financial Juice RSS feed
    console.log('Fetching RSS from Financial Juice...');
    let feed;
    
    try {
      feed = await parser.parseURL('https://financialjuice.com/feed.ashx?xy=rss');
    } catch (error) {
      console.error('Financial Juice RSS feed failed:', error);
      // Return empty if RSS fails - no mock data
      return [];
    }

    const processedNews = [];
    const items = feed.items || [];

    for (const item of items.slice(0, 20)) { // Process latest 20 items
      const processedItem = processNewsItem(item);
      if (processedItem) {
        processedNews.push(processedItem);
      }
    }

    // Update cache
    newsCache = {
      data: processedNews,
      lastUpdate: now,
      CACHE_DURATION: newsCache.CACHE_DURATION
    };

    console.log(`Processed ${processedNews.length} news items`);
    return processedNews;

  } catch (error) {
    console.error('Error fetching news:', error);
    // Return empty array if everything fails - no mock data
    return [];
  }
}

function processNewsItem(item) {
  try {
    const title = item.title || '';
    const description = item.contentSnippet || item.content || item.summary || '';
    const fullText = (title + ' ' + description).toLowerCase();

    // Classify impact level
    const impact = classifyImpact(fullText);
    
    // Extract affected currencies
    const currencies = extractCurrencies(fullText);
    
    // Generate affected pairs based on currencies
    const pairs = generateAffectedPairs(currencies);

    // Extract timestamp
    let timestamp = new Date().toISOString();
    if (item.pubDate) {
      try {
        timestamp = new Date(item.pubDate).toISOString();
      } catch (e) {
        console.warn('Invalid pubDate:', item.pubDate);
      }
    }

    return {
      id: generateId(title),
      title: title.trim(),
      summary: (description || '').trim().substring(0, 200),
      source: 'Financial Juice',
      timestamp,
      impact,
      currencies,
      pairs,
      link: item.link || '',
      tags: extractTags(fullText)
    };

  } catch (error) {
    console.error('Error processing news item:', error);
    return null;
  }
}

function classifyImpact(text) {
  // Check for HIGH impact keywords first
  for (const keyword of IMPACT_KEYWORDS.HIGH) {
    if (text.includes(keyword.toLowerCase())) {
      return 'HIGH';
    }
  }
  
  // Check for MEDIUM impact keywords
  for (const keyword of IMPACT_KEYWORDS.MEDIUM) {
    if (text.includes(keyword.toLowerCase())) {
      return 'MEDIUM';
    }
  }
  
  // Check for LOW impact keywords
  for (const keyword of IMPACT_KEYWORDS.LOW) {
    if (text.includes(keyword.toLowerCase())) {
      return 'LOW';
    }
  }
  
  // Default to MEDIUM if no specific keywords found
  return 'MEDIUM';
}

function extractCurrencies(text) {
  const foundCurrencies = [];
  
  for (const [currency, keywords] of Object.entries(CURRENCY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        if (!foundCurrencies.includes(currency)) {
          foundCurrencies.push(currency);
        }
        break;
      }
    }
  }
  
  return foundCurrencies;
}

function generateAffectedPairs(currencies) {
  const pairs = [];
  const majorPairs = [
    ['EUR', 'USD'], ['GBP', 'USD'], ['USD', 'JPY'], ['USD', 'CHF'],
    ['AUD', 'USD'], ['USD', 'CAD'], ['NZD', 'USD'],
    ['EUR', 'JPY'], ['GBP', 'JPY'], ['EUR', 'GBP']
  ];
  
  for (const [base, quote] of majorPairs) {
    if (currencies.includes(base) || currencies.includes(quote)) {
      pairs.push(`${base}${quote}`);
    }
  }
  
  return pairs;
}

function extractTags(text) {
  const tags = [];
  const commonTags = [
    'monetary policy', 'interest rates', 'inflation', 'employment',
    'gdp', 'trade', 'central bank', 'economic data', 'market outlook'
  ];
  
  for (const tag of commonTags) {
    if (text.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags.slice(0, 5); // Limit to 5 tags
}

function generateId(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
}

// Removed all mock news generators - only real RSS data

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('News API called');

    const news = await fetchAndProcessNews();

    res.status(200).json({
      success: true,
      news,
      timestamp: new Date().toISOString(),
      count: news.length,
      cached: newsCache.lastUpdate > 0 && (Date.now() - newsCache.lastUpdate) < newsCache.CACHE_DURATION
    });

  } catch (error) {
    console.error('News API error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      news: [],
      timestamp: new Date().toISOString()
    });
  }
}

// Configure Vercel function settings
export const config = {
  maxDuration: 25, // 25 second timeout
  memory: 512      // 512MB should be enough for RSS parsing
};