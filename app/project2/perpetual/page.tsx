"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@/hooks/use-wallet';
import { MarketSelector } from '@/components/trading/market-selector';
import { PerpTradingPanel } from '@/components/trading/perp-trading-panel';
import { OrderBook } from '@/components/trading/orderbook';
import TradeHistory from '@/components/trading/trade-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPositions } from '@/components/trading/user-positions';
import { UserOrders } from '@/components/trading/user-orders';
import MarketStatistics from '@/components/trading/market-statistics';
import { useMarketData } from '@/hooks/use-market-data';

// Dynamic import for TradingViewChart with SSR disabled
const TradingViewChart = dynamic(
  () => import('@/components/trading/trading-view-chart'),
  { ssr: false }
);

export default function PerpetualTradingPage() {
  const { connected } = useWallet();
  const [selectedMarket, setSelectedMarket] = useState('BTC/USDC');
  const { marketData } = useMarketData(selectedMarket);

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      <div className="container mx-auto px-0 md:px-4">
        {/* Market selector and statistics */}
        <div className="flex flex-col lg:flex-row border-b border-gray-800 justify-between">
          <MarketSelector 
            selectedMarket={selectedMarket} 
            onSelectMarket={setSelectedMarket} 
            isPerpetual
          />
          <MarketStatistics market={selectedMarket} data={marketData} isPerpetual />
        </div>
        
        {/* Main trading grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-4 mt-4">
          {/* Chart section - 3 columns on desktop */}
          <div className="col-span-1 lg:col-span-3 mb-4 lg:mb-0">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg h-[500px] overflow-hidden p-2">
              <TradingViewChart symbol={selectedMarket.replace('/', '')} isPerpetual />
            </div>
          </div>
          
          {/* Orderbook section - 1 column */}
          <div className="col-span-1 mb-4 lg:mb-0">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg overflow-hidden p-4 h-[500px]">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Order Book</h3>
              <OrderBook market={selectedMarket} isPerpetual />
            </div>
          </div>
          
          {/* Order form and history - 3 columns */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
              {/* Trading panel */}
              <div className="col-span-1 mb-4 md:mb-0">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                  <PerpTradingPanel market={selectedMarket} />
                </div>
              </div>
              
              {/* User positions and orders */}
              <div className="col-span-1 md:col-span-2 mb-4 md:mb-0">
                <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                  <Tabs defaultValue="positions">
                    <TabsList className="mb-2">
                      <TabsTrigger value="positions">Positions</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="positions">
                      <UserPositions market={selectedMarket} isPerpetual />
                    </TabsContent>
                    <TabsContent value="orders">
                      <UserOrders market={selectedMarket} isPerpetual />
                    </TabsContent>
                    <TabsContent value="history">
                      <div className="p-4 text-center text-gray-400">
                        Trade history will appear here
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trade history - 1 column */}
          <div className="col-span-1">
            <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 h-[400px] overflow-hidden">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Trade History</h3>
              <TradeHistory market={selectedMarket} isPerpetual />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}