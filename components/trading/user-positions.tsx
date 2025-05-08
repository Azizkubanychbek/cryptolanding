"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position {
  id: string;
  market: string;
  side: 'long' | 'short' | 'buy' | 'sell';
  size: number;
  leverage?: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice?: number;
  margin?: number;
  pnl: number;
  pnlPercent: number;
  timestamp: number;
}

interface UserPositionsProps {
  market?: string;
  isPerpetual?: boolean;
}

export const UserPositions = ({ market, isPerpetual = false }: UserPositionsProps) => {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  
  // Mock position data
  useEffect(() => {
    if (!connected) {
      setPositions([]);
      return;
    }
    
    // Generate mock positions
    const generateMockPositions = () => {
      // Only generate positions for perpetual markets if isPerpetual=true
      if (isPerpetual) {
        const markets = ['BTC/USDC', 'ETH/USDC', 'ARMA/USDC'];
        const mockPositions: Position[] = [];
        
        // Generate a random position for each market
        markets.forEach((mkt) => {
          // Skip non-matching markets if a specific market is provided
          if (market && mkt !== market) return;
          
          // 70% chance to create a position
          if (Math.random() > 0.3) {
            const [base] = mkt.split('/');
            const side = Math.random() > 0.5 ? 'long' : 'short';
            const leverage = Math.floor(Math.random() * 20) + 1;
            
            let basePrice: number;
            switch (base) {
              case 'BTC':
                basePrice = 65000 + (Math.random() * 2000 - 1000);
                break;
              case 'ETH':
                basePrice = 3500 + (Math.random() * 200 - 100);
                break;
              case 'ARMA':
                basePrice = 5 + (Math.random() * 1 - 0.5);
                break;
              default:
                basePrice = 100;
            }
            
            const entryPrice = basePrice * (1 - (Math.random() * 0.05 - 0.025));
            const markPrice = basePrice;
            const size = Math.random() * 2 + 0.1;
            const margin = (entryPrice * size) / leverage;
            
            // Calculate PnL
            const pnlMultiplier = side === 'long' ? 1 : -1;
            const priceDiff = markPrice - entryPrice;
            const pnl = pnlMultiplier * priceDiff * size * leverage;
            const pnlPercent = (pnl / margin) * 100;
            
            // Calculate liquidation price
            const liquidationBuffer = 0.05; // 5% buffer
            const liquidationPrice = side === 'long' 
              ? entryPrice * (1 - (1 / leverage) + liquidationBuffer)
              : entryPrice * (1 + (1 / leverage) - liquidationBuffer);
            
            mockPositions.push({
              id: `position-${mkt}-${side}-${Date.now()}`,
              market: mkt,
              side,
              size,
              leverage,
              entryPrice,
              markPrice,
              liquidationPrice,
              margin,
              pnl,
              pnlPercent,
              timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Within the last 24h
            });
          }
        });
        
        return mockPositions;
      } else {
        // For spot, we'll simulate having positions/holdings in various assets
        const assets = ['BTC', 'ETH', 'ARMA', 'USDC'];
        const mockPositions: Position[] = [];
        
        assets.forEach((asset) => {
          // Skip non-matching assets if a specific market is provided
          const marketBase = market?.split('/')[0];
          if (market && asset !== marketBase && asset !== 'USDC') return;
          
          // 70% chance to create a position for each asset
          if (Math.random() > 0.3) {
            let basePrice: number;
            switch (asset) {
              case 'BTC':
                basePrice = 65000 + (Math.random() * 2000 - 1000);
                break;
              case 'ETH':
                basePrice = 3500 + (Math.random() * 200 - 100);
                break;
              case 'ARMA':
                basePrice = 5 + (Math.random() * 1 - 0.5);
                break;
              case 'USDC':
                basePrice = 1;
                break;
              default:
                basePrice = 100;
            }
            
            const entryPrice = asset === 'USDC' ? 1 : basePrice * (1 - (Math.random() * 0.1 - 0.05));
            const markPrice = basePrice;
            const size = Math.random() * 10 + (asset === 'BTC' ? 0.1 : 1);
            
            // Calculate PnL
            const pnl = (markPrice - entryPrice) * size;
            const pnlPercent = ((markPrice - entryPrice) / entryPrice) * 100;
            
            mockPositions.push({
              id: `holding-${asset}-${Date.now()}`,
              market: `${asset}/USDC`,
              side: 'buy',
              size,
              entryPrice,
              markPrice,
              pnl,
              pnlPercent,
              timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Within the last 24h
            });
          }
        });
        
        return mockPositions;
      }
    };
    
    setPositions(generateMockPositions());
    
    // Update positions every 10 seconds to simulate price changes
    const interval = setInterval(() => {
      setPositions(prev => {
        return prev.map(pos => {
          // Randomly adjust mark price
          const priceChange = pos.markPrice * (Math.random() * 0.02 - 0.01); // ±1%
          const newMarkPrice = pos.markPrice + priceChange;
          
          // Recalculate PnL
          let newPnl: number;
          let newPnlPercent: number;
          
          if (isPerpetual) {
            const pnlMultiplier = pos.side === 'long' ? 1 : -1;
            const priceDiff = newMarkPrice - pos.entryPrice;
            newPnl = pnlMultiplier * priceDiff * pos.size * (pos.leverage || 1);
            newPnlPercent = (newPnl / (pos.margin || 1)) * 100;
          } else {
            newPnl = (newMarkPrice - pos.entryPrice) * pos.size;
            newPnlPercent = ((newMarkPrice - pos.entryPrice) / pos.entryPrice) * 100;
          }
          
          return {
            ...pos,
            markPrice: newMarkPrice,
            pnl: newPnl,
            pnlPercent: newPnlPercent,
          };
        });
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [connected, market, isPerpetual]);
  
  // Format price with appropriate precision
  const formatPrice = (price: number, marketStr: string) => {
    if (marketStr.includes('BTC')) {
      return price.toFixed(1);
    } else if (marketStr.includes('ETH')) {
      return price.toFixed(2);
    } else {
      return price.toFixed(4);
    }
  };
  
  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000) {
      return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else {
      return amount.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
  };
  
  // Handle close position
  const handleClosePosition = (positionId: string) => {
    toast({
      title: "Position closed",
      description: "Your position has been closed successfully",
    });
    
    setPositions(prev => prev.filter(pos => pos.id !== positionId));
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>Connect your wallet to view positions</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>No active {isPerpetual ? 'positions' : 'holdings'} found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-800">
            <th className="p-2">Market</th>
            <th className="p-2">Side</th>
            <th className="p-2">Size</th>
            {isPerpetual && <th className="p-2">Leverage</th>}
            <th className="p-2">Entry Price</th>
            <th className="p-2">Mark Price</th>
            {isPerpetual && <th className="p-2">Liq. Price</th>}
            <th className="p-2">PnL</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr 
              key={position.id} 
              className="border-b border-gray-800 hover:bg-gray-800/20"
            >
              <td className="p-2 font-medium">{position.market}</td>
              <td className="p-2">
                <div className={cn(
                  "flex items-center",
                  (position.side === 'long' || position.side === 'buy') ? "text-green-500" : "text-red-500"
                )}>
                  {(position.side === 'long' || position.side === 'buy') 
                    ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                    : <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  {position.side.toUpperCase()}
                </div>
              </td>
              <td className="p-2">{position.size.toFixed(4)}</td>
              {isPerpetual && <td className="p-2">{position.leverage}x</td>}
              <td className="p-2">${formatPrice(position.entryPrice, position.market)}</td>
              <td className="p-2">${formatPrice(position.markPrice, position.market)}</td>
              {isPerpetual && <td className="p-2">${formatPrice(position.liquidationPrice || 0, position.market)}</td>}
              <td className={cn(
                "p-2",
                position.pnl >= 0 ? "text-green-500" : "text-red-500"
              )}>
                ${formatCurrency(position.pnl)} ({position.pnlPercent.toFixed(2)}%)
              </td>
              <td className="p-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 px-2"
                  onClick={() => handleClosePosition(position.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Close
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};