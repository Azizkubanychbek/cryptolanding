"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ArchLayerProps {
  title: string;
  description: string;
  layer: number;
  totalLayers: number;
}

function ArchLayer({ title, description, layer, totalLayers }: ArchLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!layerRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const offset = ((totalLayers - layer) / totalLayers) * 100;
    
    gsap.fromTo(
      layerRef.current,
      { 
        x: layer % 2 === 0 ? -50 : 50, 
        opacity: 0 
      },
      { 
        x: 0, 
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: layerRef.current,
          start: `top bottom-=${offset}%`,
          toggleActions: "play none none none"
        },
        delay: layer * 0.1
      }
    );
    
  }, [layer, totalLayers]);
  
  const getLayerColor = () => {
    const colors = [
      "from-cyberpunk-cyan/20 to-cyberpunk-cyan-dark/30",
      "from-cyberpunk-blue/20 to-cyberpunk-blue-dark/30"
    ];
    return colors[layer % colors.length];
  };
  
  return (
    <div 
      ref={layerRef}
      className={`p-6 rounded-lg relative border border-gray-800 mb-4 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out ${layer % 2 === 0 ? 'ml-0 mr-0 md:mr-12 lg:mr-24' : 'ml-0 md:ml-12 lg:ml-24 mr-0'}`}
      style={{
        background: `linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))`,
      }}
    >
      <div className={`absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r ${getLayerColor()} group-hover:opacity-80 transition-opacity duration-300`}></div>
      
      <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-cyberpunk-darker flex items-center justify-center border border-cyberpunk-cyan text-cyberpunk-cyan text-xs font-mono group-hover:scale-110 group-hover:border-cyberpunk-cyan-light group-hover:text-cyberpunk-cyan-light transition-all duration-300">
        {layer}
      </div>
      
      <h3 className="text-xl font-display text-white mb-2 group-hover:text-cyberpunk-cyan transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  );
}

export function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      titleRef.current,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      }
    );
    
  }, []);
  
  const totalLayers = 3;
  
  return (
    <section 
      id="architecture" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden bg-cyberpunk-darker"
    >
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-cyberpunk-cyan opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-cyberpunk-cyan opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            System <span className="text-cyberpunk-cyan">Architecture</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our multi-layered architecture ensures security, scalability, and lightning-fast performance for all operations.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <ArchLayer 
            title="ArmaBFT" 
            description="HotStuff-based PoS consensus: ~0.2s finality, 200,000 TPS, Byzantine resistance."
            layer={1}
            totalLayers={totalLayers}
          />
          
          <ArchLayer 
            title="ArmaCore" 
            description="Native on-chain spot & perpetual books, cross/isolated margin clearing, multi-source oracles (Binance, OKX, Bybit…), Vaults & Insurance Fund, USDC⇄nUSDC bridge."
            layer={2}
            totalLayers={totalLayers}
          />
          
          <ArchLayer 
            title="ArmaEVM" 
            description="Full EVM under the same consensus: smart contracts, precompiles to ArmaCore, ARMA gas token, seamless DeFi integrations."
            layer={3}
            totalLayers={totalLayers}
          />
        </div>
      </div>
    </section>
  );
}