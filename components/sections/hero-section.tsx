"use client";

import { useRef, useEffect } from 'react';
import { useAudio } from '@/components/providers/audio-provider';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Link from 'next/link';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudio();

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);
    
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(
      titleRef.current,
      { 
        opacity: 0,
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    )
    
    .fromTo(
      subtitleRef.current,
      { 
        opacity: 0,
        text: "" 
      },
      { 
        opacity: 1,
        text: "< 1s finality · 200,000 orders/s · 100% on-chain",
        duration: 1.5,
        ease: "none"
      }
    )
    
    .fromTo(
      ctaRef.current,
      { 
        opacity: 0,
        y: 20 
      },
      { 
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    );
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-cyberpunk-black"></div>
      <div className="absolute inset-0 bg-cyber-grid-bg"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-glow-cyan opacity-20"></div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10 py-20 text-center">
        <h1 
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white glow-text"
        >
          HIGH-PERFORMANCE <span className="text-cyberpunk-cyan">DEFI</span> ON A NATIVE L1 BLOCKCHAIN
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-mono"
        ></p>
        
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/project2">
  <button 
    className="neon-btn"
    onMouseEnter={() => playSound('hover')}
    onClick={() => playSound('click')}
  >
    Launch App
  </button>
</Link>
          <button 
            className="border border-white hover:border-cyberpunk-cyan text-white px-6 py-3 rounded-md transition-colors duration-300"
            onMouseEnter={() => playSound('hover')}
            onClick={() => playSound('click')}
          >
            Read Whitepaper
          </button>
        </div>
        
        {/* Stats highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out">
            <div className="text-3xl font-bold text-cyberpunk-cyan mb-1 group-hover:scale-110 group-hover:text-cyberpunk-cyan-light transition-all duration-300">&gt;200K</div>
            <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Orders/Second</div>
          </div>
          
          <div className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out">
            <div className="text-3xl font-bold text-cyberpunk-cyan mb-1 group-hover:scale-110 group-hover:text-cyberpunk-cyan-light transition-all duration-300">&lt;1s</div>
            <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Finality</div>
          </div>
          
          <div className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out">
            <div className="text-3xl font-bold text-cyberpunk-cyan mb-1 group-hover:scale-110 group-hover:text-cyberpunk-cyan-light transition-all duration-300">50×</div>
            <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Max Leverage</div>
          </div>
          
          <div className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out">
            <div className="text-3xl font-bold text-cyberpunk-cyan mb-1 group-hover:scale-110 group-hover:text-cyberpunk-cyan-light transition-all duration-300">100%</div>
            <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">On-Chain Orders</div>
          </div>
        </div>
      </div>
    </section>
  );
}