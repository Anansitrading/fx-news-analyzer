import React from 'react';
import { ExternalLink, Clock, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { NewsItem } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

interface NewsPanelProps {
  news: NewsItem[];
  selectedSymbol: string | null;
  title: string;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ news, selectedSymbol, title }) => {
  const getImpactIcon = (impact: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (impact) {
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-danger-600" />;
      case 'MEDIUM':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactClass = (impact: 'LOW' | 'MEDIUM' | 'HIGH'): string => {
    switch (impact) {
      case 'HIGH':
        return 'news-impact-high';
      case 'MEDIUM':
        return 'news-impact-medium';
      default:
        return 'news-impact-low';
    }
  };

  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatPublishedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'MMM d, HH:mm');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {selectedSymbol && (
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
            {selectedSymbol}
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {news.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedSymbol 
                ? `No news found for ${selectedSymbol}` 
                : 'No news available'
              }
            </p>
            <p className="text-sm text-gray-400 mt-2">
              News will appear here as they become available
            </p>
          </div>
        ) : (
          news.slice(0, 10).map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md ${getImpactClass(item.marketImpact)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getImpactIcon(item.marketImpact)}
                  <span className={`text-xs font-medium uppercase ${{
                    HIGH: 'text-danger-600',
                    MEDIUM: 'text-yellow-600',
                    LOW: 'text-gray-600'
                  }[item.marketImpact]}`}>
                    {item.marketImpact}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatPublishedDate(item.publishedAt)}</span>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                {item.title}
              </h3>

              {item.content && (
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                  {truncateContent(item.content)}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  {item.symbols.length > 0 && (
                    <div className="flex space-x-1">
                      {item.symbols.slice(0, 3).map((symbol) => (
                        <span
                          key={symbol}
                          className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded font-mono"
                        >
                          {symbol}
                        </span>
                      ))}
                      {item.symbols.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{item.symbols.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                    title="Read full article"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white bg-opacity-60 text-gray-600 px-1 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {news.length > 10 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            Showing latest 10 articles ({news.length} total)
          </span>
        </div>
      )}
    </div>
  );
};

export default NewsPanel;