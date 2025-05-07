"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface RoadmapItemProps {
  title: string;
  time: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  index: number;
}

function RoadmapItem({ title, time, description, status, index }: RoadmapItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!itemRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      itemRef.current,
      { 
        y: 50, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        },
        delay: index * 0.1
      }
    );
    
  }, [index]);
  
  const statusColors = {
    'completed': 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    'upcoming': 'bg-gray-500'
  };
  
  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'upcoming': 'Upcoming'
  };
  
  const isEven = index % 2 === 0;
  
  return (
    <div 
      ref={itemRef}
      className={cn(
        "relative grid grid-cols-1 md:grid-cols-5 gap-6 mb-12 last:mb-0",
        isEven ? "md:text-right" : ""
      )}
    >
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-700 -z-10 transform -translate-x-1/2"></div>
      
      <div className={cn(
        "col-span-1 md:col-span-2 flex flex-col",
        isEven ? "md:order-1" : "md:order-1"
      )}>
        <div className="mb-2 font-display text-white text-xl">{title}</div>
        <div className="text-gray-400 text-sm mb-3">{time}</div>
        <div className="text-gray-300">{description}</div>
      </div>
      
      <div className={cn(
        "hidden md:flex items-center justify-center col-span-1 relative",
        isEven ? "md:order-2" : "md:order-2"
      )}>
        <div className={`w-4 h-4 rounded-full ${statusColors[status]} z-10`}></div>
      </div>
      
      <div className={cn(
        "col-span-1 md:col-span-2 flex flex-col justify-center",
        isEven ? "md:order-3" : "md:order-3"
      )}>
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
          status === 'completed' ? "bg-green-900/20 text-green-400" : 
          status === 'in-progress' ? "bg-yellow-900/20 text-yellow-400" : 
          "bg-gray-800 text-gray-400",
          isEven ? "md:ml-auto" : "md:mr-auto"
        )}>
          {statusText[status]}
        </div>
      </div>
    </div>
  );
}

export function RoadmapSection() {
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
  
  return (
    <section 
      id="roadmap" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-cyberpunk-black"></div>
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            Development <span className="text-cyberpunk-cyan">Roadmap</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our strategic development timeline for building the future of decentralized trading.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <RoadmapItem 
            title="Whitepaper & Community Launch" 
            time="Q2 2025"
            description="Whitepaper & Litepaper complete, website & social launch, community build"
            status="completed"
            index={0}
          />
          
          <RoadmapItem 
            title="Strategic Investment & MVP" 
            time="Q3 2025"
            description="Strategic investor partnership ($5M+), seed round, MVP testnet"
            status="in-progress"
            index={1}
          />
          
          <RoadmapItem 
            title="Testnet & Security" 
            time="Q4 2025"
            description="Private/public testnet, bug bounty & trading competition, security audit"
            status="upcoming"
            index={2}
          />
          
          <RoadmapItem 
            title="Mainnet Launch" 
            time="Q1 2026"
            description="Mainnet & Genesis airdrop, launch BTC-USD, ETH-USD, ARMA-USD markets, DAO governance live"
            status="upcoming"
            index={3}
          />
          
          <RoadmapItem 
            title="Ecosystem Expansion" 
            time="H2 2026"
            description="ARMA listings on major CEXes, dApp integrations on ArmaEVM, cross-chain bridges, scale to 1M TPS if needed"
            status="upcoming"
            index={4}
          />
        </div>
      </div>
    </section>
  );
}