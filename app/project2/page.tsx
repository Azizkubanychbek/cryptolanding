"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { useWallet } from './hooks/use-wallet.ts';
import { ArrowUpRight, TrendingUp, Shield, Layers } from 'lucide-react';

export default function Home() {
  const { connected } = useWallet();
  const [scrollY, setScrollY] = useState(0);
  
  // Update scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Grid Effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        
        {/* Gradient Orb */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/20 blur-3xl"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${-scrollY * 0.1}px)`,
          }}
        />
        
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-white leading-tight">
              The Next Generation Decentralized Exchange
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Trade spot & perpetual markets with lightning speed, deep liquidity, and advanced trading tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/project2/spot">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-none px-8">
                  Start Trading <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/governance">
                <Button size="lg" variant="outline" className="border-cyan-500/50 bg-black/40 hover:bg-black/60 text-white px-8">
                  Join DAO
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Down Arrow */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Trading Features Section */}
      <section className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #0891b2 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1 - 100}px)`,
          }}
        />
        
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Complete <span className="text-cyan-400">Trading Experience</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need for professional trading in one interface
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp size={28} className="text-cyan-400" />,
                title: "Spot & Perpetual",
                description: "Trade major cryptocurrencies with up to 50x leverage on perpetual markets"
              },
              {
                icon: <Shield size={28} className="text-cyan-400" />,
                title: "Non-Custodial",
                description: "Full control of your assets with secure, non-custodial trading"
              },
              {
                icon: <Layers size={28} className="text-cyan-400" />,
                title: "Multi-Chain",
                description: "Seamlessly bridge assets from Ethereum, BSC and other major chains"
              },
              {
                icon: <TrendingUp size={28} className="text-cyan-400" />,
                title: "Copy Trading",
                description: "Follow top traders and automatically copy their successful strategies"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trading Interface Preview */}
      <section className="py-20 relative">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Advanced <span className="text-cyan-400">Trading Interface</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Professional-grade trading tools designed for both novice and expert traders
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl"
          >
            <div className="aspect-[16/9] relative">
              <Image 
                src="https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="ArmaDEX Trading Interface" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Link href="/spot">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Launch App
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer Section */}
      <section className="py-16 border-t border-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ARMA</span>
                <span>DEX</span>
              </div>
              <p className="text-gray-400 mt-2">The future of decentralized trading</p>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <Link href="/spot" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Spot
              </Link>
              <Link href="/perpetual" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Perpetual
              </Link>
              <Link href="/vaults" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Vaults
              </Link>
              <Link href="/governance" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Governance
              </Link>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                API
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ArmaDEX. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}