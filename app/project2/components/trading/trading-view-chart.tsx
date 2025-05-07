"use client";

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TradingViewChartProps {
  symbol: string;
  isPerpetual?: boolean;
}

function TradingViewChart({ symbol, isPerpetual = false }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState('15');
  
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const modifiedSymbol = isPerpetual ? `${symbol}PERP` : symbol;
    
    // Clean up any existing widgets
    chartContainerRef.current.innerHTML = '';
    
    // Setup the new widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && chartContainerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${modifiedSymbol}`,
          interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#191c20',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          container_id: chartContainerRef.current.id,
          custom_css_url: '',
          withdateranges: true,
          hide_volume: false,
          studies: [
            'Volume@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          save_image: false,
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#00c176",
            "mainSeriesProperties.candleStyle.downColor": "#cf304a",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00c176",
            "mainSeriesProperties.candleStyle.wickDownColor": "#cf304a",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00c176",
            "mainSeriesProperties.candleStyle.borderDownColor": "#cf304a",
            "paneProperties.background": "#171b21",
            "paneProperties.vertGridProperties.color": "#232323",
            "paneProperties.horzGridProperties.color": "#232323",
            "scalesProperties.textColor": "#9eabbe",
          }
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, isPerpetual]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 px-2">
        <Tabs 
          value={interval} 
          onValueChange={setInterval}
          className="w-full"
        >
          <TabsList className="bg-gray-800/30 p-0 h-8">
            <TabsTrigger value="1" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">1m</TabsTrigger>
            <TabsTrigger value="5" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">5m</TabsTrigger>
            <TabsTrigger value="15" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">15m</TabsTrigger>
            <TabsTrigger value="60" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">1h</TabsTrigger>
            <TabsTrigger value="240" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">4h</TabsTrigger>
            <TabsTrigger value="D" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">1d</TabsTrigger>
            <TabsTrigger value="W" className="text-xs py-1 px-2 h-6 data-[state=active]:bg-gray-700">1w</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div 
        id="tradingview_chart_container" 
        ref={chartContainerRef} 
        className="w-full h-full"
      />
    </div>
  );
}

// Add TradingView types to Window interface
declare global {
  interface Window {
    TradingView: {
      widget: new (config: any) => any;
    };
  }
}

export default TradingViewChart;