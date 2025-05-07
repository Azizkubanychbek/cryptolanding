"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { GlobeIcon, VolumeX, Volume2, Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/use-wallet';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AppHeader = () => {
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connect, connected, address, disconnect } = useWallet();

  const toggleMute = () => setMuted(!muted);

  return (
    <header className="relative z-50 border-b border-gray-800/80 bg-black/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tighter text-white">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ARMA</span>
              <span>DEX</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/spot" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Spot
            </Link>
            <Link href="/perpetual" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Perpetual
            </Link>
            <Link href="/vaults" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Vaults
            </Link>
            <Link href="/governance" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Governance
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-gray-300 hover:text-white hover:bg-gray-800">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                <GlobeIcon size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
              <DropdownMenuItem>中文</DropdownMenuItem>
              <DropdownMenuItem>日本語</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {connected ? (
            <Button 
              variant="outline" 
              onClick={disconnect}
              className="border-cyan-500/30 bg-gray-900/60 hover:bg-gray-800 text-white"
            >
              <Wallet className="mr-2 h-4 w-4 text-cyan-400" />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={connect}
              className="border-cyan-500/30 bg-gray-900/60 hover:bg-gray-800 text-white"
            >
              <Wallet className="mr-2 h-4 w-4 text-cyan-400" />
              Connect Wallet
            </Button>
          )}
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} className="text-gray-300" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-300",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="container mx-auto px-4 py-3 flex justify-end">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} className="text-gray-300" />
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-6">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ARMA</span>
            <span className="text-white">DEX</span>
          </Link>
          
          <div className="flex flex-col items-center space-y-6 w-full">
            <Link href="/spot" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300">
              Spot
            </Link>
            <Link href="/perpetual" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300">
              Perpetual
            </Link>
            <Link href="/vaults" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300">
              Vaults
            </Link>
            <Link href="/governance" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300">
              Governance
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 mt-8">
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-gray-300">
              {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300">
                  <GlobeIcon size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Español</DropdownMenuItem>
                <DropdownMenuItem>中文</DropdownMenuItem>
                <DropdownMenuItem>日本語</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-8 w-full px-4">
            {connected ? (
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="w-full border-cyan-500/30 bg-gray-900/60 hover:bg-gray-800 text-white"
              >
                <Wallet className="mr-2 h-5 w-5 text-cyan-400" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  connect();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-cyan-500/30 bg-gray-900/60 hover:bg-gray-800 text-white"
              >
                <Wallet className="mr-2 h-5 w-5 text-cyan-400" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;