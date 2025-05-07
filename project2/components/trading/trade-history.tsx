"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Trade {
  id: string;
  price: number;
  amount: number;
  total: number;
  side: 'buy' | 'sell';
  timestamp: number; // Unix timestamp in ms
}

interface TradeHistoryProps {
  market: string;
  isPerpetual?: boolean;
}

export default function TradeHistory({ market, isPerpetual = false }: TradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  
  // Format price with appropriate precision
  const formatPrice = (price: number) => {
    if (market.includes('BTC')) {
      return price.toFixed(1);
    } else if (market.includes('ETH')) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  };
  
  // Format amount with appropriate precision
  const formatAmount = (amount: number) => {
    return amount.toFixed(4);
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };
  
  useEffect(() => {
    // Generate mock trade history with some initial data
    const generateInitialTrades = () => {
      let basePrice: number;
      
      // Set base price based on the market
      switch (market.split('/')[0]) {
        case 'BTC':
          basePrice = 65000;
          break;
        case 'ETH':
          basePrice = 3500;
          break;
        case 'ARMA':
          basePrice = 5;
          break;
        default:
          basePrice = 100;
      }
      
      const mockTrades: Trade[] = [];
      
      // Generate 20 initial trades
      for (let i = 0; i < 20; i++) {
        const variation = (Math.random() * 0.002 - 0.001) * basePrice; // ±0.1% variation
        const price = basePrice + variation;
        const amount = Math.random() * 2 + 0.01; // Random amount between 0.01 and 2.01
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const timestamp = Date.now() - Math.floor(Math.random() * 60000); // Within the last minute
        
        mockTrades.push({
          id: `trade-${Date.now()}-${i}`,
          price,
          amount,
          total: price * amount,
          side,
          timestamp,
        });
      }
      
      // Sort by timestamp (newest first)
      mockTrades.sort((a, b) => b.timestamp - a.timestamp);
      
      return mockTrades;
    };
    
    // Add a new trade
    const addNewTrade = () => {
      let basePrice: number;
      
      // Set base price based on the market
      switch (market.split('/')[0]) {
        case 'BTC':
          basePrice = 65000;
          break;
        case 'ETH':
          basePrice = 3500;
          break;
        case 'ARMA':
          basePrice = 5;
          break;
        default:
          basePrice = 100;
      }
      
      // If we have existing trades, use the most recent price as a base
      if (trades.length > 0) {
        basePrice = trades[0].price;
      }
      
      const variation = (Math.random() * 0.002 - 0.001) * basePrice; // ±0.1% variation
      const price = basePrice + variation;
      const amount = Math.random() * 2 + 0.01; // Random amount between 0.01 and 2.01
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const timestamp = Date.now();
      
      const newTrade: Trade = {
        id: `trade-${timestamp}`,
        price,
        amount,
        total: price * amount,
        side,
        timestamp,
      };
      
      setTrades(prevTrades => {
        // Add the new trade and keep only the most recent 50
        const updatedTrades = [newTrade, ...prevTrades].slice(0, 50);
        return updatedTrades;
      });
    };
    
    // Initialize with mock data
    setTrades(generateInitialTrades());
    
    // Set up interval to add new trades
    const interval = setInterval(addNewTrade, 2000);
    
    return () => clearInterval(interval);
  }, [market]);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="space-y-1">
        {trades.map((trade) => (
          <div 
            key={trade.id} 
            className={cn(
              "grid grid-cols-3 py-[3px] text-xs border-l-2",
              trade.side === 'buy' 
                ? "border-l-green-500" 
                : "border-l-red-500"
            )}
          >
            <div className={cn(
              "flex items-center",
              trade.side === 'buy' ? "text-green-500" : "text-red-500"
            )}>
              {trade.side === 'buy' 
                ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                : <ArrowDownRight className="h-3 w-3 mr-1" />
              }
              {formatPrice(trade.price)}
            </div>
            <div className="text-right">{formatAmount(trade.amount)}</div>
            <div className="text-right text-gray-400">{formatTime(trade.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}