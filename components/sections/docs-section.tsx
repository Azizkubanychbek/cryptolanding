"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Code2, Terminal, Newspaper, Wrench, Webhook } from 'lucide-react';
import { useAudio } from '@/components/providers/audio-provider';

interface DocsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay: number;
}

function DocsCard({ title, description, icon, link, delay }: DocsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudio();
  
  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      cardRef.current,
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1,
        duration: 0.6,
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
    <a 
      href={link}
      ref={cardRef}
      className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 flex flex-col h-full group transition-all duration-300 hover:border-cyberpunk-cyan/50 hover:bg-cyberpunk-darker/80"
      onMouseEnter={() => playSound('hover')}
      onClick={() => playSound('click')}
    >
      <div className="text-cyberpunk-cyan mb-4 group-hover:text-cyberpunk-cyan-light transition-colors duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-display text-white mb-3 group-hover:text-cyberpunk-cyan transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="mt-auto text-sm font-medium text-cyberpunk-cyan group-hover:text-cyberpunk-cyan-light transition-colors duration-300">
        Learn More →
      </div>
    </a>
  );
}

function Accordion({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { playSound } = useAudio();
  
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-800">
      <button
        className="w-full py-4 flex justify-between items-center focus:outline-none"
        onClick={() => {
          playSound('click');
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => playSound('hover')}
      >
        <span className="text-white font-medium">{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg 
            className="w-5 h-5 text-cyberpunk-cyan" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden h-0"
      >
        <div className="pb-4 text-gray-400">
          {content}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

export function DocsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const refs = [titleRef, faqRef];
    
    refs.forEach((ref, index) => {
      if (!ref.current) return;
      
      gsap.fromTo(
        ref.current,
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
            trigger: ref.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          delay: index * 0.2
        }
      );
    });
    
  }, []);
  
  return (
    <section 
      id="docs" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden bg-cyberpunk-darker"
    >
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            <span className="text-cyberpunk-cyan">Documentation</span> & Resources
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive technical documentation, API references, and trading guides to help you get started with ArmaDEX.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          <DocsCard 
            title="Technical Docs" 
            description="Deep dive into ArmaBFT consensus, ArmaCore trading engine, and ArmaEVM architecture."
            icon={<BookOpen size={32} />}
            link="#"
            delay={0}
          />
          
          <DocsCard 
            title="Trading API" 
            description="WebSocket & REST endpoints for order management, market data, and account operations."
            icon={<Terminal size={32} />}
            link="#"
            delay={1}
          />
          
          <DocsCard 
            title="Smart Contracts" 
            description="EVM contract interfaces, precompiles, and examples for DeFi integrations."
            icon={<Code2 size={32} />}
            link="#"
            delay={2}
          />
          
          <DocsCard 
            title="Trading Guides" 
            description="Learn about perpetuals, cross/isolated margin, advanced order types, and risk management."
            icon={<Newspaper size={32} />}
            link="#"
            delay={3}
          />
          
          <DocsCard 
            title="Integration Tools" 
            description="SDKs, code examples, and utilities for building on top of ArmaDEX."
            icon={<Wrench size={32} />}
            link="#"
            delay={4}
          />
          
          <DocsCard 
            title="Webhooks" 
            description="Real-time notifications for trades, liquidations, and other important events."
            icon={<Webhook size={32} />}
            link="#"
            delay={5}
          />
        </div>
        
        <div ref={faqRef} className="max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-0">
            <Accordion 
              title="What makes ArmaDEX's performance unique?" 
              content="ArmaDEX achieves industry-leading performance through its native L1 blockchain with HotStuff-based consensus, delivering ~0.2s block times and 200,000 TPS. The on-chain orderbook and matching engine are optimized for high-frequency trading with sub-second finality."
            />
            
            <Accordion 
              title="How does email login work?" 
              content="Our email login system generates a non-custodial wallet using your email for authentication. This eliminates the need for MetaMask while maintaining full security. Your private keys are encrypted and stored locally, with email serving only as an authentication method."
            />
            
            <Accordion 
              title="What trading features are supported?" 
              content="ArmaDEX supports spot and perpetual futures with up to 40× leverage, cross/isolated margin, and advanced order types including limit, market, stop-loss, take-profit, and TWAP. The platform also features one-click trading and mobile-first UX."
            />
            
            <Accordion 
              title="How are trades settled?" 
              content="All trades are settled on-chain through ArmaCore's native orderbook and matching engine. This ensures complete transparency and eliminates counterparty risk while maintaining CEX-grade performance through our optimized consensus mechanism."
            />
            
            <Accordion 
              title="What assets can I trade?" 
              content="At launch, ArmaDEX will support major crypto-USD pairs including BTC-USD, ETH-USD, and ARMA-USD. Additional pairs will be added based on community governance. All USD pairs use nUSDC, our native stablecoin bridged 1:1 with USDC."
            />
            
            <Accordion 
              title="How do you ensure price accuracy?" 
              content="We utilize a multi-source oracle system pulling real-time prices from major exchanges including Binance, OKX, and Bybit. The median price is used with outlier rejection to ensure accurate and manipulation-resistant price feeds."
            />
          </div>
        </div>
      </div>
    </section>
  );
}