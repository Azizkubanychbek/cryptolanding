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

interface PerpTradingPanelProps {
  market: string;
}

export const PerpTradingPanel = ({ market }: PerpTradingPanelProps) => {
  const { toast } = useToast();
  const { connected, balance } = useWallet();
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(5);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(1);
  const [orderOptions, setOrderOptions] = useState({
    postOnly: false,
    reduceOnly: false,
    ioc: false,
  });
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  
  // Extract the base and quote currency from the market
  const [base, quote] = market.split('/');
  
  // Calculate margin required based on amount, price and leverage
  const calculateMargin = () => {
    const amountValue = parseFloat(amount || '0');
    const priceValue = parseFloat(price || '0');
    
    if (isNaN(amountValue) || isNaN(priceValue)) return '0.00';
    
    const total = amountValue * priceValue;
    return (total / leverage).toFixed(2);
  };
  
  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  // Handle leverage change
  const handleLeverageChange = (values: number[]) => {
    setLeverage(values[0]);
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
      title: "Position opened successfully",
      description: `${side.toUpperCase()} ${amount} ${base} at ${orderType === 'market' ? 'market price' : `$${price}`} with ${leverage}x leverage`,
      variant: "default",
    });
    
    // Reset form
    if (orderType === 'market') {
      setAmount('');
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
              side === 'long' ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-transparent'
            )}
            onClick={() => setSide('long')}
          >
            Long
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "flex-1 rounded-l-none",
              side === 'short' ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-transparent'
            )}
            onClick={() => setSide('short')}
          >
            Short
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
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Size</label>
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
                    const maxAmount = parseFloat(balance[quote] || '0') * leverage / parseFloat(price || '1');
                    const newAmount = (maxAmount * percent / 100).toFixed(6);
                    setAmount(newAmount);
                  }}
                >
                  {percent}%
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Leverage</label>
              <span className="text-sm font-medium">{leverage}x</span>
            </div>
            <Slider
              defaultValue={[5]}
              max={50}
              min={1}
              step={1}
              value={[leverage]}
              onValueChange={handleLeverageChange}
              className="py-4"
            />
            
            <div className="grid grid-cols-5 gap-1">
              {[1, 5, 10, 25, 50].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => setLeverage(value)}
                >
                  {value}x
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Take Profit</label>
              </div>
              <Input
                type="number"
                placeholder="Optional"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Stop Loss</label>
              </div>
              <Input
                type="number"
                placeholder="Optional"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          
          <div className="mt-2 p-3 border border-gray-800 rounded-md bg-gray-800/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Margin Required:</span>
              <span className="text-white">{calculateMargin()} {quote}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Fees:</span>
              <span className="text-white">~{(parseFloat(amount || '0') * parseFloat(price || '0') * 0.0006).toFixed(4)} {quote}</span>
            </div>
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
            </div>
          )}
        </div>
      </Tabs>
      
      <div className="mt-4">
        {connected ? (
          <Button
            className={cn(
              "w-full py-6 text-white",
              side === 'long' 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-red-500 hover:bg-red-600"
            )}
            onClick={placeOrder}
          >
            {side === 'long' ? 'Long' : 'Short'} {leverage}x
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