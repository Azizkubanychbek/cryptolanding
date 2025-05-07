"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const tokenomicsData = [
  { name: 'Community Rewards & Airdrop', value: 50, color: 'hsl(var(--chart-1))' },
  { name: 'Team & Advisors', value: 15, color: 'hsl(var(--chart-2))' },
  { name: 'DAO Treasury', value: 10, color: 'hsl(var(--chart-3))' },
  { name: 'Ecosystem Grants', value: 10, color: 'hsl(var(--chart-4))' },
  { name: 'Private Sale & Advisors', value: 5, color: 'hsl(var(--chart-5))' },
  { name: 'Reserve', value: 10, color: 'hsl(180, 70%, 45%)' },
];

interface TokenInfoCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  delay: number;
}

function TokenInfoCard({ title, icon, value, description, delay }: TokenInfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
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
        delay: delay * 0.1
      }
    );
    
  }, [delay]);
  
  return (
    <div 
      ref={cardRef}
      className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 flex flex-col h-full group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out"
    >
      <div className="flex items-center mb-3 text-cyberpunk-cyan group-hover:scale-110 transition-transform duration-300">
        {icon}
        <span className="ml-2 font-display">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-2 group-hover:text-cyberpunk-cyan transition-colors duration-300">{value}</div>
      <p className="text-gray-400 text-sm mt-auto group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  );
}

export function TokenomicsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
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
    
    if (chartRef.current) {
      gsap.fromTo(
        chartRef.current,
        { 
          scale: 0.8, 
          opacity: 0 
        },
        { 
          scale: 1, 
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.7)",
          scrollTrigger: {
            trigger: chartRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          delay: 0.3
        }
      );
    }
    
  }, []);
  
  return (
    <section 
      id="tokenomics" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden bg-cyberpunk-darker"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-grid-bg opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-cyberpunk-cyan opacity-5 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-cyberpunk-cyan opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6"
          >
            <span className="text-cyberpunk-cyan">Tokenomics</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The ARMA token powers the entire ecosystem with a deflationary model and multiple utility functions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col items-center">
            <div ref={chartRef} className="w-full max-w-md mx-auto" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenomicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {tokenomicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{ 
                      backgroundColor: '#121212', 
                      borderColor: '#374151',
                      color: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{
                      color: '#ffffff'
                    }}
                    labelStyle={{
                      color: '#ffffff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full max-w-xl mx-auto mt-8 bg-cyberpunk-darker rounded-lg border border-gray-800 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tokenomicsData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col">
                      <span className="text-white text-sm">{item.name}</span>
                      <span className="text-cyberpunk-cyan text-sm font-mono">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenInfoCard 
              title="Total Supply" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
              value="1,000,000,000 ARMA" 
              description="Fixed supply with no additional minting capability"
              delay={1}
            />
            
            <TokenInfoCard 
              title="Staking APR" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
              value="2-3% APR" 
              description="At 40% staked supply, with additional rewards for long-term stakers"
              delay={2}
            />
            
            <TokenInfoCard 
              title="Fee Discounts" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
              value="50% Off" 
              description="Trading fee discounts for ARMA token holders and stakers"
              delay={3}
            />
            
            <TokenInfoCard 
              title="Burn Rate" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
              value="20% of Fees" 
              description="Continuous buy-back and burn from trading fees + listing fees"
              delay={4}
            />
          </div>
        </div>
      </div>
    </section>
  );
}