"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAudio } from '@/components/providers/audio-provider';

export function Logo() {
  const logoRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudio();
  
  useEffect(() => {
    if (!logoRef.current) return;
    
    // Animation for the logo
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    
    timeline.to(logoRef.current, {
      duration: 0.1,
      opacity: 0.7,
      ease: "power1.inOut",
      repeat: 3,
      yoyo: true
    })
    .to(logoRef.current, {
      duration: 0.05,
      x: "+=2",
      ease: "none",
      repeat: 4,
      yoyo: true
    }, "-=0.3");
    
    return () => {
      timeline.kill();
    };
  }, []);
  
  return (
    <div 
      ref={logoRef} 
      className="flex items-center cursor-pointer"
      onMouseEnter={() => playSound('hover')}
      onClick={() => {
        playSound('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <div className="relative w-10 h-10 mr-2">
        <div className="absolute inset-0 bg-cyberpunk-cyan rounded opacity-20 animate-glow-pulse"></div>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full"
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-cyberpunk-cyan"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-cyberpunk-cyan"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-cyberpunk-cyan"
          />
        </svg>
      </div>
      <div className="text-xl font-display tracking-wider text-white">
        ARMA<span className="text-cyberpunk-cyan">DEX</span>
      </div>
    </div>
  );
}