"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketSelectorProps {
  selectedMarket: string;
  onSelectMarket: (market: string) => void;
  isPerpetual?: boolean;
}

const MARKETS = {
  USDC: ['BTC/USDC', 'ETH/USDC', 'ARMA/USDC'],
  // Add more base currencies if needed
};

export const MarketSelector = ({ selectedMarket, onSelectMarket, isPerpetual = false }: MarketSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('USDC');
  
  return (
    <div className="flex items-center p-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center">
        <h2 className="font-bold text-white mr-2 text-xl">
          {isPerpetual ? 'Perpetual' : 'Spot'}
        </h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-lg font-semibold text-cyan-400 hover:text-cyan-300 transition-colors p-1">
            {selectedMarket}
            <ChevronDown className="h-4 w-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-gray-900/95 backdrop-blur-md border-gray-800 text-white">
            <div className="p-2">
              <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="mb-2">
                  {Object.keys(MARKETS).map((category) => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(MARKETS).map(([category, markets]) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    {markets.map((market) => (
                      <DropdownMenuItem 
                        key={market}
                        onClick={() => onSelectMarket(market)}
                        className={`cursor-pointer ${selectedMarket === market ? 'bg-cyan-500/20 text-cyan-400' : ''}`}
                      >
                        {market}
                      </DropdownMenuItem>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="ml-4 space-x-4 flex items-center border-l border-gray-800 pl-4">
        {Object.values(MARKETS).flat().map((market) => (
          <button
            key={market}
            onClick={() => onSelectMarket(market)}
            className={`text-sm py-1 px-2 rounded ${
              selectedMarket === market
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {market}
          </button>
        ))}
      </div>
    </div>
  );
};