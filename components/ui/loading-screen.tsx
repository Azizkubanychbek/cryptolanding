"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) * 0.1;
        return newProgress >= 99 ? 100 : newProgress;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
      
      setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyberpunk-black transition-opacity duration-500",
      progress === 100 ? "opacity-0" : "opacity-100"
    )}>
      <div className="mb-8">
        <div className="cyber-loader"></div>
      </div>
      
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-gradient-to-r from-cyberpunk-cyan to-cyberpunk-cyan-dark"
          style={{ width: `${progress}%`, transition: "width 0.3s ease-out" }}
        />
      </div>
      
      <div className="text-cyberpunk-cyan font-mono text-sm">
        <span className="animate-blink">LOADING ARMADEX</span> {progress.toFixed(0)}%
      </div>
    </div>
  );
}