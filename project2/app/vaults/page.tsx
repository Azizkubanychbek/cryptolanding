"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Users, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vault {
  id: string;
  name: string;
  image: string;
  trader: string;
  traderId: string;
  description: string;
  apy: number;
  tvl: number;
  winRate: number;
  subscribers: number;
  fee: number;
  trades: {
    market: string;
    side: 'long' | 'short';
    leverage: number;
    entryPrice: number;
    exitPrice: number | null;
    size: number;
    pnl: number;
    pnlPercent: number;
    timestamp: number;
    status: 'open' | 'closed';
  }[];
}

// Mock vault data
const VAULTS: Vault[] = [
  {
    id: 'vault-1',
    name: 'Alpha Strategies',
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    trader: 'CryptoWhale',
    traderId: '0x1a2b3c4d5e6f',
    description: 'Focused on BTC and ETH with conservative leverage and high win rate',
    apy: 127.5,
    tvl: 1235000,
    winRate: 76,
    subscribers: 243,
    fee: 10,
    trades: [
      {
        market: 'BTC/USDC',
        side: 'long',
        leverage: 5,
        entryPrice: 62451,
        exitPrice: 65280,
        size: 0.5,
        pnl: 1414.5,
        pnlPercent: 4.53,
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        status: 'closed'
      },
      {
        market: 'ETH/USDC',
        side: 'long',
        leverage: 3,
        entryPrice: 3250,
        exitPrice: null,
        size: 5,
        pnl: 625,
        pnlPercent: 3.85,
        timestamp: Date.now() - 86400000 * 0.5, // 12 hours ago
        status: 'open'
      }
    ]
  },
  {
    id: 'vault-2',
    name: 'BitMaster Fund',
    image: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    trader: 'TradeMaster',
    traderId: '0x7e8f9d2c1a5b',
    description: 'High volume trading with advanced technical analysis and risk management',
    apy: 96.3,
    tvl: 875000,
    winRate: 68,
    subscribers: 189,
    fee: 12,
    trades: [
      {
        market: 'BTC/USDC',
        side: 'short',
        leverage: 10,
        entryPrice: 67800,
        exitPrice: 65420,
        size: 0.3,
        pnl: 714,
        pnlPercent: 3.5,
        timestamp: Date.now() - 86400000 * 1, // 1 day ago
        status: 'closed'
      },
      {
        market: 'ETH/USDC',
        side: 'long',
        leverage: 5,
        entryPrice: 3180,
        exitPrice: 3320,
        size: 2,
        pnl: 140,
        pnlPercent: 2.2,
        timestamp: Date.now() - 86400000 * 3, // 3 days ago
        status: 'closed'
      }
    ]
  },
  {
    id: 'vault-3',
    name: 'ARMA Momentum',
    image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    trader: 'ARMABull',
    traderId: '0x3c4d5e6f7a8b',
    description: 'Specializing in ARMA token with high conviction long positions',
    apy: 215.8,
    tvl: 520000,
    winRate: 72,
    subscribers: 156,
    fee: 15,
    trades: [
      {
        market: 'ARMA/USDC',
        side: 'long',
        leverage: 15,
        entryPrice: 4.2,
        exitPrice: 5.1,
        size: 5000,
        pnl: 4500,
        pnlPercent: 21.4,
        timestamp: Date.now() - 86400000 * 5, // 5 days ago
        status: 'closed'
      },
      {
        market: 'BTC/USDC',
        side: 'long',
        leverage: 7,
        entryPrice: 64200,
        exitPrice: null,
        size: 0.2,
        pnl: -420,
        pnlPercent: -2.3,
        timestamp: Date.now() - 86400000 * 0.2, // 4.8 hours ago
        status: 'open'
      }
    ]
  },
];

export default function VaultsPage() {
  const { connected } = useWallet();
  const { toast } = useToast();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [followingVaults, setFollowingVaults] = useState<string[]>([]);
  
  const handleFollowVault = (vaultId: string) => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to follow vaults",
        variant: "destructive",
      });
      return;
    }
    
    if (followingVaults.includes(vaultId)) {
      setFollowingVaults(prev => prev.filter(id => id !== vaultId));
      toast({
        title: "Unfollowed",
        description: "You have unfollowed this vault",
      });
    } else {
      setFollowingVaults(prev => [...prev, vaultId]);
      toast({
        title: "Following",
        description: "You are now following this vault",
      });
    }
  };
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Copy Trading Vaults</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Follow top traders and automatically copy their successful strategies with your preferred risk levels
          </p>
        </div>
        
        {selectedVault ? (
          <div className="pb-4">
            <Button 
              variant="ghost" 
              className="mb-6 hover:bg-gray-800"
              onClick={() => setSelectedVault(null)}
            >
              ← Back to Vaults
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image 
                      src={selectedVault.image} 
                      alt={selectedVault.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{selectedVault.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          by {selectedVault.trader}
                        </CardDescription>
                      </div>
                      <Badge className="bg-cyan-500 hover:bg-cyan-600">
                        {selectedVault.apy.toFixed(1)}% APY
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{selectedVault.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-sm mb-1">Total Value Locked</p>
                        <p className="text-xl font-bold">{formatCurrency(selectedVault.tvl)}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                        <p className="text-xl font-bold">{selectedVault.winRate}%</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-sm mb-1">Subscribers</p>
                        <p className="text-xl font-bold">{selectedVault.subscribers}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-sm mb-1">Performance Fee</p>
                        <p className="text-xl font-bold">{selectedVault.fee}%</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={cn(
                        "w-full",
                        followingVaults.includes(selectedVault.id) 
                          ? "bg-gray-700 hover:bg-gray-600" 
                          : "bg-cyan-600 hover:bg-cyan-700"
                      )}
                      onClick={() => handleFollowVault(selectedVault.id)}
                    >
                      {followingVaults.includes(selectedVault.id) ? 'Unfollow' : 'Follow'} Vault
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Trades</CardTitle>
                    <CardDescription>History of trades executed by this vault</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedVault.trades.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        No trades executed yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedVault.trades.map((trade, index) => (
                          <div 
                            key={index} 
                            className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-r-0 border-t-0 border-b-0"
                            style={{
                              borderLeftColor: trade.side === 'long' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className={cn(
                                  "inline-flex items-center py-1 px-2 rounded text-xs mr-2",
                                  trade.side === 'long' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                )}>
                                  {trade.side === 'long' ? 'LONG' : 'SHORT'} {trade.leverage}x
                                </div>
                                <span className="font-medium">{trade.market}</span>
                              </div>
                              <div className="text-sm text-gray-400 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(trade.timestamp)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">Entry Price</p>
                                <p className="font-medium">${trade.entryPrice.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">Size</p>
                                <p className="font-medium">{trade.size} {trade.market.split('/')[0]}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">
                                  {trade.status === 'closed' ? 'Exit Price' : 'Current Price'}
                                </p>
                                <p className="font-medium">
                                  {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : 'Active'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">PnL</p>
                                <p className={cn(
                                  "font-medium flex items-center",
                                  trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                                )}>
                                  {trade.pnl >= 0 
                                    ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                                    : <ArrowDownRight className="h-3 w-3 mr-1" />
                                  }
                                  ${Math.abs(trade.pnl).toLocaleString()} ({Math.abs(trade.pnlPercent).toFixed(2)}%)
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-8 bg-gray-900/50">
              <TabsTrigger value="all">All Vaults</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="highest-apy">Highest APY</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VAULTS.map(vault => (
                  <Card 
                    key={vault.id} 
                    className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => setSelectedVault(vault)}
                  >
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <Image 
                        src={vault.image} 
                        alt={vault.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      <Badge className="absolute top-3 right-3 bg-cyan-500 hover:bg-cyan-600">
                        {vault.apy.toFixed(1)}% APY
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{vault.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        by {vault.trader}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vault.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                          <p className="text-xs text-gray-400">Win Rate</p>
                          <p className="font-semibold">{vault.winRate}%</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <Users className="h-4 w-4 text-cyan-500 mb-1" />
                          <p className="text-xs text-gray-400">Subscribers</p>
                          <p className="font-semibold">{vault.subscribers}</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-yellow-500 mb-1" />
                          <p className="text-xs text-gray-400">TVL</p>
                          <p className="font-semibold">{formatCurrency(vault.tvl)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="flex-1 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVault(vault);
                        }}
                      >
                        Details
                      </Button>
                      <Button 
                        className={cn(
                          "flex-1",
                          followingVaults.includes(vault.id) 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-cyan-600 hover:bg-cyan-700"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowVault(vault.id);
                        }}
                      >
                        {followingVaults.includes(vault.id) ? 'Unfollow' : 'Follow'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="mt-0">
              {!connected ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-semibold mb-2">Connect Wallet to View Your Followed Vaults</h3>
                  <p className="text-gray-400 mb-4">You need to connect your wallet to see and manage vaults you're following</p>
                  <Button 
                    className="bg-cyan-600 hover:bg-cyan-700"
                    onClick={() => {
                      toast({
                        title: "Wallet Connection Required",
                        description: "Please connect your wallet from the top navigation bar",
                      });
                    }}
                  >
                    Connect Wallet
                  </Button>
                </div>
              ) : followingVaults.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-semibold mb-2">No Vaults Followed Yet</h3>
                  <p className="text-gray-400 mb-4">You haven't followed any vaults yet. Browse the available vaults and follow ones you're interested in.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {VAULTS.filter(v => followingVaults.includes(v.id)).map(vault => (
                    <Card 
                      key={vault.id} 
                      className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                      onClick={() => setSelectedVault(vault)}
                    >
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <Image 
                          src={vault.image} 
                          alt={vault.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <Badge className="absolute top-3 right-3 bg-cyan-500 hover:bg-cyan-600">
                          {vault.apy.toFixed(1)}% APY
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{vault.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          by {vault.trader}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vault.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                            <p className="text-xs text-gray-400">Win Rate</p>
                            <p className="font-semibold">{vault.winRate}%</p>
                          </div>
                          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                            <Users className="h-4 w-4 text-cyan-500 mb-1" />
                            <p className="text-xs text-gray-400">Subscribers</p>
                            <p className="font-semibold">{vault.subscribers}</p>
                          </div>
                          <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                            <TrendingUp className="h-4 w-4 text-yellow-500 mb-1" />
                            <p className="text-xs text-gray-400">TVL</p>
                            <p className="font-semibold">{formatCurrency(vault.tvl)}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          className="flex-1 mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVault(vault);
                          }}
                        >
                          Details
                        </Button>
                        <Button 
                          className="flex-1 bg-gray-700 hover:bg-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowVault(vault.id);
                          }}
                        >
                          Unfollow
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VAULTS.sort((a, b) => b.subscribers - a.subscribers).map(vault => (
                  <Card 
                    key={vault.id} 
                    className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => setSelectedVault(vault)}
                  >
                    {/* Card content similar to "all" tab */}
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <Image 
                        src={vault.image} 
                        alt={vault.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      <Badge className="absolute top-3 right-3 bg-cyan-500 hover:bg-cyan-600">
                        {vault.apy.toFixed(1)}% APY
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{vault.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        by {vault.trader}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vault.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                          <p className="text-xs text-gray-400">Win Rate</p>
                          <p className="font-semibold">{vault.winRate}%</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <Users className="h-4 w-4 text-cyan-500 mb-1" />
                          <p className="text-xs text-gray-400">Subscribers</p>
                          <p className="font-semibold">{vault.subscribers}</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-yellow-500 mb-1" />
                          <p className="text-xs text-gray-400">TVL</p>
                          <p className="font-semibold">{formatCurrency(vault.tvl)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="flex-1 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVault(vault);
                        }}
                      >
                        Details
                      </Button>
                      <Button 
                        className={cn(
                          "flex-1",
                          followingVaults.includes(vault.id) 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-cyan-600 hover:bg-cyan-700"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowVault(vault.id);
                        }}
                      >
                        {followingVaults.includes(vault.id) ? 'Unfollow' : 'Follow'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="highest-apy" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {VAULTS.sort((a, b) => b.apy - a.apy).map(vault => (
                  <Card 
                    key={vault.id} 
                    className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => setSelectedVault(vault)}
                  >
                    {/* Card content similar to "all" tab */}
                    <div className="relative h-40 overflow-hidden rounded-t-lg">
                      <Image 
                        src={vault.image} 
                        alt={vault.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                      <Badge className="absolute top-3 right-3 bg-cyan-500 hover:bg-cyan-600">
                        {vault.apy.toFixed(1)}% APY
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{vault.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        by {vault.trader}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{vault.description}</p>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mb-1" />
                          <p className="text-xs text-gray-400">Win Rate</p>
                          <p className="font-semibold">{vault.winRate}%</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <Users className="h-4 w-4 text-cyan-500 mb-1" />
                          <p className="text-xs text-gray-400">Subscribers</p>
                          <p className="font-semibold">{vault.subscribers}</p>
                        </div>
                        <div className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-yellow-500 mb-1" />
                          <p className="text-xs text-gray-400">TVL</p>
                          <p className="font-semibold">{formatCurrency(vault.tvl)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="flex-1 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVault(vault);
                        }}
                      >
                        Details
                      </Button>
                      <Button 
                        className={cn(
                          "flex-1",
                          followingVaults.includes(vault.id) 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-cyan-600 hover:bg-cyan-700"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowVault(vault.id);
                        }}
                      >
                        {followingVaults.includes(vault.id) ? 'Unfollow' : 'Follow'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}