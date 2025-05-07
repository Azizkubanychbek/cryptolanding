"use client";

import { useState, useEffect } from 'react';

export interface MarketData {
  lastPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  totalLocked: number;
  openInterest?: number;
  fundingRate?: number;
}

export const useMarketData = (market: string, isPerpetual: boolean = false) => {
  const [marketData, setMarketData] = useState<MarketData>({
    lastPrice: 0,
    priceChange24h: 0,
    priceChangePercent24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    totalLocked: 0,
    openInterest: isPerpetual ? 0 : undefined,
    fundingRate: isPerpetual ? 0 : undefined,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate mock market data based on the selected market
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data generator function
    const generateMockData = () => {
      let basePrice: number;
      
      // Set base price based on market
      switch (market.split('/')[0]) {
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
          basePrice = 100 + (Math.random() * 20 - 10);
      }
      
      const priceChangePercent = (Math.random() * 6) - 3; // -3% to +3%
      const priceChange = basePrice * (priceChangePercent / 100);
      const high24h = basePrice + (basePrice * (Math.random() * 0.05));
      const low24h = basePrice - (basePrice * (Math.random() * 0.05));
      const volume24h = Math.random() * 1000000 + 500000;
      const totalLocked = volume24h * 2;
      
      const data: MarketData = {
        lastPrice: basePrice,
        priceChange24h: priceChange,
        priceChangePercent24h: priceChangePercent,
        high24h,
        low24h,
        volume24h,
        totalLocked,
      };
      
      if (isPerpetual) {
        data.openInterest = Math.random() * 2000000 + 1000000;
        data.fundingRate = (Math.random() * 0.2 - 0.1); // -0.1% to +0.1%
      }
      
      return data;
    };
    
    // Simulate API call with setTimeout
    const timeoutId = setTimeout(() => {
      try {
        const data = generateMockData();
        setMarketData(data);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data');
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [market, isPerpetual]);
  
  return { marketData, isLoading, error };
};