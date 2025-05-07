"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingPanelProps {
  market: string;
}

export const TradingPanel = ({ market }: TradingPanelProps) => {
  const { toast } = useToast();
  const { connected, balance } = useWallet();
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [orderOptions, setOrderOptions] = useState({
    postOnly: false,
    reduceOnly: false,
    ioc: false,
  });
  
  // Extract the base and quote currency from the market
  const [base, quote] = market.split('/');
  
  // Calculate total when price or amount changes
  const updateTotal = (newPrice?: string, newAmount?: string) => {
    const priceValue = parseFloat(newPrice || price);
    const amountValue = parseFloat(newAmount || amount);
    
    if (!isNaN(priceValue) && !isNaN(amountValue)) {
      setTotal((priceValue * amountValue).toFixed(2));
    } else {
      setTotal('');
    }
  };
  
  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    updateTotal(newPrice);
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    updateTotal(undefined, newAmount);
  };
  
  // Handle total change (update amount based on price)
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = e.target.value;
    setTotal(newTotal);
    
    const priceValue = parseFloat(price);
    if (!isNaN(priceValue) && priceValue > 0) {
      setAmount((parseFloat(newTotal) / priceValue).toFixed(6));
    }
  };
  
  // Handle order option toggle
  const handleOptionToggle = (option: keyof typeof orderOptions) => {
    setOrderOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };
  
  // Process order
  const placeOrder = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to trade",
        variant: "destructive",
      });
      return;
    }
    
    // Validate inputs
    if (orderType === 'limit' && !price) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    // Mock order placement
    toast({
      title: "Order placed successfully",
      description: `${side.toUpperCase()} ${amount} ${base} at ${orderType === 'market' ? 'market price' : `$${price}`}`,
      variant: "default",
    });
    
    // Reset form
    if (orderType === 'market') {
      setAmount('');
      setTotal('');
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue={orderType} onValueChange={(value) => setOrderType(value as 'limit' | 'market')}>
        <div className="flex mb-4">
          <TabsList className="w-full grid grid-cols-2 bg-gray-800/30">
            <TabsTrigger value="limit" className="data-[state=active]:bg-gray-700">Limit</TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-gray-700">Market</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex mb-4">
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 border-r-0 rounded-r-none",
              side === 'buy' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-transparent'
            )}
            onClick={() => setSide('buy')}
          >
            Buy
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 rounded-l-none",
              side === 'sell' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-transparent'
            )}
            onClick={() => setSide('sell')}
          >
            Sell
          </Button>
        </div>
        
        <div className="space-y-4">
          {orderType === 'limit' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Price</label>
                <span className="text-xs text-gray-500">{quote}</span>
              </div>
              <div className="relative flex items-center">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-10 w-10 rounded-r-none border-r-0"
                  onClick={() => {
                    const newPrice = (parseFloat(price || '0') - 1).toString();
                    setPrice(newPrice);
                    updateTotal(newPrice);
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={handlePriceChange}
                  className="rounded-none border-x-0 text-right"
                />
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-10 w-10 rounded-l-none border-l-0"
                  onClick={() => {
                    const newPrice = (parseFloat(price || '0') + 1).toString();
                    setPrice(newPrice);
                    updateTotal(newPrice);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Amount</label>
              <span className="text-xs text-gray-500">{base}</span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="text-right"
            />
            
            <div className="grid grid-cols-4 gap-1 mt-1">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => {
                    // Simulate using 25/50/75/100% of available balance
                    const maxAmount = parseFloat(balance[base] || '0');
                    const newAmount = (maxAmount * percent / 100).toFixed(6);
                    setAmount(newAmount);
                    updateTotal(undefined, newAmount);
                  }}
                >
                  {percent}%
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Total</label>
              <span className="text-xs text-gray-500">{quote}</span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={total}
              onChange={handleTotalChange}
              className="text-right"
            />
          </div>
          
          {orderType === 'limit' && (
            <div className="flex flex-wrap gap-3 justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="post-only" 
                  checked={orderOptions.postOnly} 
                  onCheckedChange={() => handleOptionToggle('postOnly')}
                />
                <label htmlFor="post-only" className="text-xs text-gray-400">Post Only</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="reduce-only" 
                  checked={orderOptions.reduceOnly} 
                  onCheckedChange={() => handleOptionToggle('reduceOnly')}
                />
                <label htmlFor="reduce-only" className="text-xs text-gray-400">Reduce Only</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="ioc" 
                  checked={orderOptions.ioc} 
                  onCheckedChange={() => handleOptionToggle('ioc')}
                />
                <label htmlFor="ioc" className="text-xs text-gray-400">IOC</label>
              </div>
            </div>
          )}
        </div>
      </Tabs>
      
      <div className="mt-6">
        {connected ? (
          <Button
            className={cn(
              "w-full py-6 text-white",
              side === 'buy' 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-red-500 hover:bg-red-600"
            )}
            onClick={placeOrder}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {base}
          </Button>
        ) : (
          <Button
            className="w-full py-6 bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => {
              toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to trade",
                variant: "destructive",
              });
            }}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};