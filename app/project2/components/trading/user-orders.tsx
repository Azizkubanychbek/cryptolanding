"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  market: string;
  type: 'limit' | 'market' | 'stop' | 'take_profit' | 'trailing_stop';
  side: 'buy' | 'sell' | 'long' | 'short';
  price: number;
  amount: number;
  filled: number;
  status: 'open' | 'partial' | 'filled' | 'canceled';
  timestamp: number;
  options?: {
    postOnly?: boolean;
    reduceOnly?: boolean;
    ioc?: boolean;
  };
  leverage?: number;
}

interface UserOrdersProps {
  market?: string;
  isPerpetual?: boolean;
}

export const UserOrders = ({ market, isPerpetual = false }: UserOrdersProps) => {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Mock orders data
  useEffect(() => {
    if (!connected) {
      setOrders([]);
      return;
    }
    
    // Generate mock orders
    const generateMockOrders = () => {
      const markets = ['BTC/USDC', 'ETH/USDC', 'ARMA/USDC'];
      const orderTypes = isPerpetual 
        ? ['limit', 'stop', 'take_profit', 'trailing_stop'] 
        : ['limit', 'stop'];
      
      const mockOrders: Order[] = [];
      
      // Generate 0-5 random orders
      const numOrders = Math.floor(Math.random() * 6);
      
      for (let i = 0; i < numOrders; i++) {
        const randomMarket = markets[Math.floor(Math.random() * markets.length)];
        
        // Skip non-matching markets if a specific market is provided
        if (market && randomMarket !== market) continue;
        
        const orderType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        const side = isPerpetual
          ? (Math.random() > 0.5 ? 'long' : 'short')
          : (Math.random() > 0.5 ? 'buy' : 'sell');
        
        let basePrice: number;
        switch (randomMarket.split('/')[0]) {
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
        
        // Adjust price based on order type and side
        let price: number;
        
        if (orderType === 'limit') {
          price = side === 'buy' || side === 'long' 
            ? basePrice * 0.98 // Buy/Long below market
            : basePrice * 1.02; // Sell/Short above market
        } else if (orderType === 'stop') {
          price = side === 'buy' || side === 'long'
            ? basePrice * 1.05 // Buy/Long when price goes up (above)
            : basePrice * 0.95; // Sell/Short when price goes down (below)
        } else if (orderType === 'take_profit') {
          price = side === 'buy' || side === 'long'
            ? basePrice * 0.9 // Buy/Long when price dips (below)
            : basePrice * 1.1; // Sell/Short when price spikes (above)
        } else {
          // Trailing stop
          price = side === 'buy' || side === 'long'
            ? basePrice * 1.03 // Buy/Long trailing above
            : basePrice * 0.97; // Sell/Short trailing below
        }
        
        const amount = Math.random() * 2 + 0.1;
        const filled = Math.random() > 0.8 
          ? Math.random() * amount // Partially filled
          : 0; // Not filled
          
        const status = filled > 0 ? 'partial' : 'open';
        
        const orderOptions = {
          postOnly: Math.random() > 0.7,
          reduceOnly: Math.random() > 0.7,
          ioc: Math.random() > 0.9,
        };
        
        const leverage = isPerpetual ? Math.floor(Math.random() * 20) + 1 : undefined;
        
        mockOrders.push({
          id: `order-${Date.now()}-${i}`,
          market: randomMarket,
          type: orderType as any,
          side: side as any,
          price,
          amount,
          filled,
          status,
          timestamp: Date.now() - Math.floor(Math.random() * 3600000), // Within the last hour
          options: orderOptions,
          leverage,
        });
      }
      
      return mockOrders;
    };
    
    setOrders(generateMockOrders());
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
  
  // Format time from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };
  
  // Cancel order
  const handleCancelOrder = (orderId: string) => {
    toast({
      title: "Order canceled",
      description: "Your order has been canceled successfully",
    });
    
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>Connect your wallet to view orders</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <p>No open orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-800">
            <th className="p-2">Market</th>
            <th className="p-2">Type</th>
            <th className="p-2">Side</th>
            <th className="p-2">Price</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Filled</th>
            <th className="p-2">Time</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr 
              key={order.id} 
              className="border-b border-gray-800 hover:bg-gray-800/20"
            >
              <td className="p-2 font-medium">{order.market}</td>
              <td className="p-2 capitalize">{order.type.replace('_', ' ')}</td>
              <td className={cn(
                "p-2 capitalize",
                (order.side === 'buy' || order.side === 'long') ? "text-green-500" : "text-red-500"
              )}>
                {order.side}
                {order.leverage && ` ${order.leverage}x`}
              </td>
              <td className="p-2">${formatPrice(order.price, order.market)}</td>
              <td className="p-2">{order.amount.toFixed(4)}</td>
              <td className="p-2">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full" 
                      style={{ width: `${(order.filled / order.amount) * 100}%` }}
                    ></div>
                  </div>
                  {((order.filled / order.amount) * 100).toFixed(0)}%
                </div>
              </td>
              <td className="p-2">
                <div className="flex items-center text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(order.timestamp)}
                </div>
              </td>
              <td className="p-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 px-2"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};