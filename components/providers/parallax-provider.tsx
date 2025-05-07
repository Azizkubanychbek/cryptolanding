"use client";

import React, { createContext, useContext, useRef, useEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxContextType {
  registerParallaxElement: (
    element: React.RefObject<HTMLElement>,
    config: ParallaxConfig
  ) => void;
}

interface ParallaxConfig {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  start?: string;
  end?: string;
}

const ParallaxContext = createContext<ParallaxContextType | undefined>(undefined);

export function ParallaxProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const elementsRef = useRef<Array<{
    element: React.RefObject<HTMLElement>;
    config: ParallaxConfig;
  }>>([]);
  
  useEffect(() => {
    setIsClient(true);
    
    // Register GSAP plugins
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Initialize parallax effects for all registered elements
    elementsRef.current.forEach(({ element, config }) => {
      if (!element.current) return;
      
      const { speed = 0.5, direction = 'vertical', start = 'top bottom', end = 'bottom top' } = config;
      
      const yVal = direction === 'vertical' ? `${speed * 100}%` : 0;
      const xVal = direction === 'horizontal' ? `${speed * 100}%` : 0;
      
      gsap.fromTo(
        element.current,
        { y: 0, x: 0 },
        {
          y: yVal,
          x: xVal,
          ease: 'none',
          scrollTrigger: {
            trigger: element.current,
            start,
            end,
            scrub: true,
          },
        }
      );
    });
  }, [isClient]);
  
  const registerParallaxElement = (
    element: React.RefObject<HTMLElement>,
    config: ParallaxConfig
  ) => {
    elementsRef.current.push({ element, config });
  };
  
  return (
    <ParallaxContext.Provider value={{ registerParallaxElement }}>
      {children}
    </ParallaxContext.Provider>
  );
}

export function useParallax() {
  const context = useContext(ParallaxContext);
  if (context === undefined) {
    throw new Error('useParallax must be used within a ParallaxProvider');
  }
  return context;
}