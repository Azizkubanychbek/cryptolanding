"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MousePointer, BookOpen, Target, Smartphone, Terminal } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      cardRef.current,
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
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        },
        delay: delay * 0.15
      }
    );
    
  }, [delay]);
  
  return (
    <div 
      ref={cardRef}
      className="bg-cyberpunk-darker p-6 md:p-8 rounded-lg border border-gray-800 relative overflow-hidden group"
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyberpunk-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Border accent */}
      <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyberpunk-cyan to-transparent opacity-50"></div>
      
      <div className="text-cyberpunk-cyan mb-4 relative z-10">
        {icon}
      </div>
      
      <h3 className="text-xl font-display text-white mb-3 relative z-10">{title}</h3>
      <p className="text-gray-400 relative z-10">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
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
      id="features" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cyberpunk-black"></div>
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            Core <span className="text-cyberpunk-cyan">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ArmaDEX combines cutting-edge technology with user-friendly design to deliver the ultimate trading experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Email Login" 
            description="Trade instantly without MetaMask. Generate a non-custodial wallet via email."
            icon={<Mail size={36} />}
            delay={0}
          />
          
          <FeatureCard 
            title="One-Click Trading" 
            description="Set size & leverage once — place orders with a single click, no extra confirmations."
            icon={<MousePointer size={36} />}
            delay={1}
          />
          
          <FeatureCard 
            title="On-Chain Orderbook" 
            description="Fully on-chain book: limit, market, TP/SL, TWAP — CEX-grade performance."
            icon={<BookOpen size={36} />}
            delay={2}
          />
          
          <FeatureCard 
            title="Advanced Orders" 
            description="Built-in Take-Profit, Stop-Loss, Trailing-Stop, TWAP — automate exits & DCA."
            icon={<Target size={36} />}
            delay={3}
          />
          
          <FeatureCard 
            title="Mobile-First UX" 
            description="Full mobile interface + push notifications for fills, liquidations, alerts."
            icon={<Smartphone size={36} />}
            delay={4}
          />
          
          <FeatureCard 
            title="Algo API Suite" 
            description="WebSocket + REST API for HFT: access book, trades, positions, liquidations for your bots."
            icon={<Terminal size={36} />}
            delay={5}
          />
        </div>
      </div>
    </section>
  );
}