"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depth: number;
}

interface OrderBookProps {
  market: string;
  isPerpetual?: boolean;
}

export const OrderBook = ({ market, isPerpetual = false }: OrderBookProps) => {
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(0);
  const [spreadPercentage, setSpreadPercentage] = useState<number>(0);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  
  const formatPrice = (price: number) => {
    // Format based on market pair
    if (market.includes('BTC')) {
      return price.toFixed(1);
    } else if (market.includes('ETH')) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  };
  
  const formatAmount = (amount: number) => {
    return amount.toFixed(4);
  };
  
  // Generate mock orderbook data
  useEffect(() => {
    const generateMockOrderbook = () => {
      let basePrice: number;
      
      // Set base price based on the market
      switch (market.split('/')[0]) {
        case 'BTC':
          basePrice = 65000 + Math.random() * 2000 - 1000;
          break;
        case 'ETH':
          basePrice = 3500 + Math.random() * 200 - 100;
          break;
        case 'ARMA':
          basePrice = 5 + Math.random() * 1 - 0.5;
          break;
        default:
          basePrice = 100;
      }
      
      // Slightly adjust price to create movement
      const newPrice = basePrice + (Math.random() * 0.2 - 0.1) * basePrice;
      
      // Determine price direction
      if (newPrice > lastPrice && lastPrice !== 0) {
        setPriceDirection('up');
      } else if (newPrice < lastPrice && lastPrice !== 0) {
        setPriceDirection('down');
      } else {
        setPriceDirection('neutral');
      }
      
      setLastPrice(newPrice);
      
      // Generate asks
      const mockAsks: OrderBookEntry[] = [];
      const totalAsks = 15;
      let askPrice = newPrice * 1.001; // 0.1% above last price
      let totalAskAmount = 0;
      
      for (let i = 0; i < totalAsks; i++) {
        const amount = Math.random() * 2 + 0.1; // Random amount between 0.1 and 2.1
        totalAskAmount += amount;
        
        mockAsks.push({
          price: askPrice,
          amount,
          total: totalAskAmount,
          depth: 0, // Will calculate after we have all entries
        });
        
        askPrice *= 1.0005; // Increase by about 0.05%
      }
      
      // Generate bids
      const mockBids: OrderBookEntry[] = [];
      const totalBids = 15;
      let bidPrice = newPrice * 0.999; // 0.1% below last price
      let totalBidAmount = 0;
      
      for (let i = 0; i < totalBids; i++) {
        const amount = Math.random() * 2 + 0.1; // Random amount between 0.1 and 2.1
        totalBidAmount += amount;
        
        mockBids.push({
          price: bidPrice,
          amount,
          total: totalBidAmount,
          depth: 0, // Will calculate after we have all entries
        });
        
        bidPrice *= 0.9995; // Decrease by about 0.05%
      }
      
      // Calculate max total for depth visualization
      const maxTotal = Math.max(
        mockAsks[mockAsks.length - 1].total,
        mockBids[mockBids.length - 1].total
      );
      
      // Calculate depth percentages
      mockAsks.forEach(ask => {
        ask.depth = (ask.total / maxTotal) * 100;
      });
      
      mockBids.forEach(bid => {
        bid.depth = (bid.total / maxTotal) * 100;
      });
      
      // Calculate spread
      const lowestAsk = mockAsks[0].price;
      const highestBid = mockBids[0].price;
      const spread = lowestAsk - highestBid;
      const spreadPercent = (spread / lowestAsk) * 100;
      
      setSpreadPercentage(spreadPercent);
      setAsks(mockAsks);
      setBids(mockBids);
    };
    
    // Initial generation
    generateMockOrderbook();
    
    // Setup interval to update orderbook
    const interval = setInterval(generateMockOrderbook, 2000);
    
    return () => clearInterval(interval);
  }, [market, lastPrice]);

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Headers */}
      <div className="grid grid-cols-4 text-gray-400 mb-1 px-1">
        <div className="text-left">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
        <div className="text-right">Sum</div>
      </div>
      
      {/* Asks (Sell orders) - displayed in reverse order */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="mb-1">
          {asks.map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-4 relative py-[2px] px-1 hover:bg-white/5">
              <div className="absolute right-0 top-0 bottom-0 bg-red-500/20" style={{ width: `${ask.depth}%` }}></div>
              <div className="text-red-500 relative z-10">{formatPrice(ask.price)}</div>
              <div className="text-right relative z-10">{formatAmount(ask.amount)}</div>
              <div className="text-right relative z-10">{formatAmount(ask.total)}</div>
              <div className="text-right text-gray-500 relative z-10">{(ask.price * ask.amount).toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        {/* Spread */}
        <div className="text-center py-1 text-gray-400 border-y border-gray-800 bg-gray-900/50 mb-1">
          <div className={cn("text-sm mb-1", {
            "text-green-500": priceDirection === 'up',
            "text-red-500": priceDirection === 'down',
            "text-gray-300": priceDirection === 'neutral'
          })}>
            {formatPrice(lastPrice)}
          </div>
          <div className="text-xs">
            Spread: {spreadPercentage.toFixed(4)}%
          </div>
        </div>
        
        {/* Bids (Buy orders) */}
        <div>
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-4 relative py-[2px] px-1 hover:bg-white/5">
              <div className="absolute right-0 top-0 bottom-0 bg-green-500/20" style={{ width: `${bid.depth}%` }}></div>
              <div className="text-green-500 relative z-10">{formatPrice(bid.price)}</div>
              <div className="text-right relative z-10">{formatAmount(bid.amount)}</div>
              <div className="text-right relative z-10">{formatAmount(bid.total)}</div>
              <div className="text-right text-gray-500 relative z-10">{(bid.price * bid.amount).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};