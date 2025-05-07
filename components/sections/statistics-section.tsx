"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Sample data for the charts
const tvlData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

const volumeData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  delay: number;
}

function StatCard({ title, value, change, positive = true, delay }: StatCardProps) {
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
      className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out"
    >
      <div className="text-gray-400 text-sm mb-1 group-hover:text-gray-300 transition-colors duration-300">{title}</div>
      <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyberpunk-cyan transition-colors duration-300">{value}</div>
      <div className={`text-sm ${positive ? 'text-green-400 group-hover:text-green-300' : 'text-red-400 group-hover:text-red-300'} transition-colors duration-300`}>
        {positive ? '↑' : '↓'} {change}
      </div>
    </div>
  );
}

export function StatisticsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);
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
    
    const charts = [chartRef1.current, chartRef2.current];
    
    charts.forEach((chart, index) => {
      if (!chart) return;
      
      gsap.fromTo(
        chart,
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
            trigger: chart,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          delay: 0.2 + (index * 0.2)
        }
      );
    });
    
  }, []);
  
  return (
    <section 
      id="statistics" 
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
            Performance <span className="text-cyberpunk-cyan">Metrics</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ArmaDEX is built for high-performance trading with industry-leading speed and reliability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Block Time" 
            value="0.2s" 
            change="vs 12s ETH"
            positive={true}
            delay={1}
          />
          
          <StatCard 
            title="Max TPS" 
            value="200K" 
            change="vs 30 ETH"
            positive={true}
            delay={2}
          />
          
          <StatCard 
            title="Finality" 
            value="<1s" 
            change="vs 15m ETH"
            positive={true}
            delay={3}
          />
          
          <StatCard 
            title="Gas Cost" 
            value="$0.001" 
            change="vs $2-20 ETH"
            positive={true}
            delay={4}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            ref={chartRef1}
            className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out"
          >
            <h3 className="text-xl font-display text-white mb-6 group-hover:text-cyberpunk-cyan transition-colors duration-300">Projected TVL Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tvlData}>
                  <defs>
                    <linearGradient id="colorTVL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#4B5563" 
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#4B5563"
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0A0A0A', 
                      borderColor: '#374151',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`$${value}M`, 'TVL']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00FFFF" 
                    fillOpacity={1} 
                    fill="url(#colorTVL)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div 
            ref={chartRef2}
            className="bg-cyberpunk-darker p-6 rounded-lg border border-gray-800 group hover:scale-105 hover:border-cyberpunk-cyan/50 transition-all duration-300 ease-out"
          >
            <h3 className="text-xl font-display text-white mb-6 group-hover:text-cyberpunk-cyan transition-colors duration-300">Projected Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#4B5563" 
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#4B5563"
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0A0A0A', 
                      borderColor: '#374151',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`$${value}M`, 'Volume']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0066FF" 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}