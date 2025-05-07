"use client";

import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketData } from '@/hooks/use-market-data';

interface MarketStatisticsProps {
  market: string;
  data: MarketData;
  isPerpetual?: boolean;
}

export default function MarketStatistics({ market, data, isPerpetual = false }: MarketStatisticsProps) {
  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    if (market.startsWith('BTC')) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (market.startsWith('ETH')) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }
  };
  
  // Format large numbers (volume, etc.)
  const formatLargeNumber = (num: number) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };
  
  // Format percentage
  const formatPercent = (percent: number) => {
    return percent.toFixed(2) + '%';
  };

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 px-4 text-sm text-gray-300">
      <div>
        <span className="text-gray-500 mr-1">Last:</span>
        {data.lastPrice > 0 ? (
          <span className="font-semibold text-white">${formatPrice(data.lastPrice)}</span>
        ) : (
          <Skeleton className="h-4 w-16 inline-block" />
        )}
      </div>
      
      <div>
        <span className="text-gray-500 mr-1">24h:</span>
        {data.priceChangePercent24h ? (
          <div className={`inline-flex items-center ${data.priceChangePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data.priceChangePercent24h >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {formatPercent(Math.abs(data.priceChangePercent24h))}
          </div>
        ) : (
          <Skeleton className="h-4 w-12 inline-block" />
        )}
      </div>
      
      <div>
        <span className="text-gray-500 mr-1">24h High:</span>
        {data.high24h > 0 ? (
          <span className="font-semibold">${formatPrice(data.high24h)}</span>
        ) : (
          <Skeleton className="h-4 w-16 inline-block" />
        )}
      </div>
      
      <div>
        <span className="text-gray-500 mr-1">24h Low:</span>
        {data.low24h > 0 ? (
          <span className="font-semibold">${formatPrice(data.low24h)}</span>
        ) : (
          <Skeleton className="h-4 w-16 inline-block" />
        )}
      </div>
      
      <div>
        <span className="text-gray-500 mr-1">24h Vol:</span>
        {data.volume24h > 0 ? (
          <span className="font-semibold">${formatLargeNumber(data.volume24h)}</span>
        ) : (
          <Skeleton className="h-4 w-16 inline-block" />
        )}
      </div>
      
      {isPerpetual && (
        <>
          <div>
            <span className="text-gray-500 mr-1">Open Interest:</span>
            {data.openInterest ? (
              <span className="font-semibold">${formatLargeNumber(data.openInterest)}</span>
            ) : (
              <Skeleton className="h-4 w-16 inline-block" />
            )}
          </div>
          
          <div>
            <span className="text-gray-500 mr-1">Funding:</span>
            {data.fundingRate !== undefined ? (
              <div className={`inline-flex items-center ${data.fundingRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.fundingRate >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(data.fundingRate).toFixed(4)}%
                <Clock className="ml-1 h-3 w-3 text-gray-500" />
                <span className="text-gray-500 ml-1">1h</span>
              </div>
            ) : (
              <Skeleton className="h-4 w-20 inline-block" />
            )}
          </div>
        </>
      )}
    </div>
  );
}