"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, ArrowUpRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data interfaces
interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  startTime: number;
  endTime: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  category: 'protocol' | 'treasury' | 'governance' | 'community';
  userVoted?: 'for' | 'against' | 'abstain';
}

// Mock proposals
const PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Add New Trading Pairs: SOL/USDC and DOT/USDC',
    description: `This proposal aims to expand ArmaDEX's trading pairs by adding support for Solana (SOL) and Polkadot (DOT) against USDC. Adding these pairs will increase platform utility and attract users from these ecosystems. Implementation will require liquidity mining incentives of 50,000 ARMA tokens over 3 months.`,
    proposer: '0xe3a45b078a6f1f...a1b',
    status: 'active',
    startTime: Date.now() - 86400000 * 2, // 2 days ago
    endTime: Date.now() + 86400000 * 3, // 3 days from now
    votesFor: 1250000,
    votesAgainst: 450000,
    votesAbstain: 125000,
    quorum: 2000000,
    category: 'protocol',
  },
  {
    id: 'prop-002',
    title: 'Reduce Trading Fees for High Volume Traders',
    description: `Proposal to implement a tiered fee structure that reduces trading fees for high volume traders. Current fee is flat 0.1%, proposed structure: >$100k/month: 0.08%, >$1M/month: 0.06%, >$10M/month: 0.04%. Expected to increase platform competitiveness and attract larger traders.`,
    proposer: '0x7a1b2c3d4e5f...890',
    status: 'passed',
    startTime: Date.now() - 86400000 * 10, // 10 days ago
    endTime: Date.now() - 86400000 * 3, // 3 days ago
    votesFor: 1750000,
    votesAgainst: 250000,
    votesAbstain: 50000,
    quorum: 1500000,
    category: 'protocol',
    userVoted: 'for',
  },
  {
    id: 'prop-003',
    title: 'Deploy ArmaDEX on Arbitrum Network',
    description: `This proposal suggests deploying ArmaDEX contracts on Arbitrum to leverage lower gas fees and higher throughput. Implementation cost estimated at $120,000 for development, testing, and security audits. Expected timeline is 2 months from approval.`,
    proposer: '0x3d4e5f6a7b8c...901',
    status: 'pending',
    startTime: Date.now() + 86400000 * 1, // Starts in 1 day
    endTime: Date.now() + 86400000 * 8, // Ends in 8 days
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    quorum: 2000000,
    category: 'protocol',
  },
  {
    id: 'prop-004',
    title: 'Allocate 500,000 ARMA for Marketing Campaign',
    description: `Proposal to allocate 500,000 ARMA tokens from the treasury for a comprehensive marketing campaign across social media, influencer partnerships, and community events. Campaign expected to run for 6 months with detailed monthly reporting.`,
    proposer: '0x2c3d4e5f6a7b...129',
    status: 'rejected',
    startTime: Date.now() - 86400000 * 15, // 15 days ago
    endTime: Date.now() - 86400000 * 8, // 8 days ago
    votesFor: 900000,
    votesAgainst: 1200000,
    votesAbstain: 75000,
    quorum: 1500000,
    category: 'treasury',
    userVoted: 'against',
  },
  {
    id: 'prop-005',
    title: 'Implement Multi-Chain Bridge Security Upgrade',
    description: `This proposal addresses security enhancements for the multi-chain bridge, including implementation of a 2/3 threshold signature scheme, additional oracle validation, and 24-hour timelock for large transfers. Estimated cost is $180,000 for development and $50,000 for audits.`,
    proposer: '0x9a8b7c6d5e4f...321',
    status: 'active',
    startTime: Date.now() - 86400000 * 1, // 1 day ago
    endTime: Date.now() + 86400000 * 6, // 6 days from now
    votesFor: 950000,
    votesAgainst: 150000,
    votesAbstain: 75000,
    quorum: 1500000,
    category: 'governance',
  },
];

export default function GovernancePage() {
  const { connected, balance } = useWallet();
  const { toast } = useToast();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userVotes, setUserVotes] = useState<{[key: string]: 'for' | 'against' | 'abstain'}>({});
  
  // Get user voting power
  const userVotingPower = parseFloat(balance?.ARMA || '0');
  
  // Format votes
  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(2)}M`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    } else {
      return votes.toString();
    }
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate time remaining or elapsed
  const getTimeStatus = (proposal: Proposal) => {
    const now = Date.now();
    
    if (proposal.status === 'pending') {
      const daysToStart = Math.ceil((proposal.startTime - now) / (1000 * 60 * 60 * 24));
      return `Starts in ${daysToStart} day${daysToStart !== 1 ? 's' : ''}`;
    } else if (proposal.status === 'active') {
      const daysRemaining = Math.ceil((proposal.endTime - now) / (1000 * 60 * 60 * 24));
      return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
    } else {
      return `Ended ${formatDate(proposal.endTime)}`;
    }
  };
  
  // Calculate progress
  const calculateProgress = (proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    return Math.min((totalVotes / proposal.quorum) * 100, 100);
  };
  
  // Calculate vote percentages
  const calculateVotePercentage = (votes: number, proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };
  
  // Handle vote
  const handleVote = (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }
    
    if (userVotingPower <= 0) {
      toast({
        title: "Insufficient voting power",
        description: "You need ARMA tokens to vote on proposals",
        variant: "destructive",
      });
      return;
    }
    
    // Update local state
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: vote
    }));
    
    // If we're viewing a proposal, update its userVoted property
    if (selectedProposal && selectedProposal.id === proposalId) {
      setSelectedProposal({
        ...selectedProposal,
        userVoted: vote
      });
    }
    
    toast({
      title: "Vote cast successfully",
      description: `You have voted ${vote} proposal ${proposalId}`,
    });
  };
  
  // Get proposal status badge
  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'passed':
        return <Badge className="bg-cyan-600">Passed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      default:
        return null;
    }
  };
  
  // Get category badge
  const getCategoryBadge = (category: Proposal['category']) => {
    switch (category) {
      case 'protocol':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Protocol</Badge>;
      case 'treasury':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Treasury</Badge>;
      case 'governance':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Governance</Badge>;
      case 'community':
        return <Badge variant="outline" className="border-green-500 text-green-500">Community</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ArmaDEX Governance</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Participate in the decentralized governance of ArmaDEX by voting on proposals
          </p>
        </div>
        
        {selectedProposal ? (
          <div className="pb-4">
            <Button 
              variant="ghost" 
              className="mb-6 hover:bg-gray-800"
              onClick={() => setSelectedProposal(null)}
            >
              ← Back to Proposals
            </Button>
            
            <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(selectedProposal.status)}
                      {getCategoryBadge(selectedProposal.category)}
                    </div>
                    <CardTitle className="text-2xl">{selectedProposal.title}</CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      Proposed by {selectedProposal.proposer.substring(0, 10)}...{selectedProposal.proposer.substring(selectedProposal.proposer.length - 3)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 flex items-center justify-end mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeStatus(selectedProposal)}
                    </div>
                    <div className="text-sm">
                      {formatDate(selectedProposal.startTime)} - {formatDate(selectedProposal.endTime)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line">{selectedProposal.description}</p>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Voting Results</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span>Quorum Progress</span>
                      <span>{formatVotes(selectedProposal.votesFor + selectedProposal.votesAgainst + selectedProposal.votesAbstain)} / {formatVotes(selectedProposal.quorum)}</span>
                    </div>
                    <Progress value={calculateProgress(selectedProposal)} className="h-3 bg-gray-800 scale-y-75" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-green-500">For</span>
                        <span className="text-green-500">{calculateVotePercentage(selectedProposal.votesFor, selectedProposal).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateVotePercentage(selectedProposal.votesFor, selectedProposal)} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
                      <div className="mt-2 text-sm text-gray-300">{formatVotes(selectedProposal.votesFor)} votes</div>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-red-500">Against</span>
                        <span className="text-red-500">{calculateVotePercentage(selectedProposal.votesAgainst, selectedProposal).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateVotePercentage(selectedProposal.votesAgainst, selectedProposal)} className="h-2 bg-gray-800" indicatorClassName="bg-red-500" />
                      <div className="mt-2 text-sm text-gray-300">{formatVotes(selectedProposal.votesAgainst)} votes</div>
                    </div>
                    
                    <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Abstain</span>
                        <span className="text-gray-500">{calculateVotePercentage(selectedProposal.votesAbstain, selectedProposal).toFixed(1)}%</span>
                      </div>
                      <Progress value={calculateVotePercentage(selectedProposal.votesAbstain, selectedProposal)} className="h-2 bg-gray-800" indicatorClassName="bg-gray-500" />
                      <div className="mt-2 text-sm text-gray-300">{formatVotes(selectedProposal.votesAbstain)} votes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {selectedProposal.status === 'active' && (
                <CardFooter className="border-t border-gray-800 pt-6 flex flex-col">
                  <div className="mb-4 flex items-center justify-between w-full">
                    <div>
                      <h4 className="text-lg font-medium">Cast Your Vote</h4>
                      {connected ? (
                        <p className="text-sm text-gray-400">Voting Power: {userVotingPower.toFixed(2)} ARMA</p>
                      ) : (
                        <p className="text-sm text-gray-400">Connect your wallet to vote</p>
                      )}
                    </div>
                    
                    {userVotes[selectedProposal.id] || selectedProposal.userVoted ? (
                      <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <span>Voted: {userVotes[selectedProposal.id] || selectedProposal.userVoted}</span>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="flex gap-4 w-full">
                    <Button 
                      className={cn(
                        "flex-1 border-green-500 hover:bg-green-500/20",
                        (userVotes[selectedProposal.id] === 'for' || selectedProposal.userVoted === 'for') ? "bg-green-500/20" : ""
                      )}
                      variant="outline"
                      onClick={() => handleVote(selectedProposal.id, 'for')}
                      disabled={!connected || userVotingPower <= 0}
                    >
                      Vote For
                    </Button>
                    <Button 
                      className={cn(
                        "flex-1 border-red-500 hover:bg-red-500/20",
                        (userVotes[selectedProposal.id] === 'against' || selectedProposal.userVoted === 'against') ? "bg-red-500/20" : ""
                      )}
                      variant="outline"
                      onClick={() => handleVote(selectedProposal.id, 'against')}
                      disabled={!connected || userVotingPower <= 0}
                    >
                      Vote Against
                    </Button>
                    <Button 
                      className={cn(
                        "flex-1 border-gray-500 hover:bg-gray-500/20",
                        (userVotes[selectedProposal.id] === 'abstain' || selectedProposal.userVoted === 'abstain') ? "bg-gray-500/20" : ""
                      )}
                      variant="outline"
                      onClick={() => handleVote(selectedProposal.id, 'abstain')}
                      disabled={!connected || userVotingPower <= 0}
                    >
                      Abstain
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="mb-8 bg-gray-900/50">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="all">All Proposals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              <div className="space-y-4">
                {PROPOSALS.filter(p => p.status === 'active').length === 0 ? (
                  <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-semibold mb-2">No Active Proposals</h3>
                    <p className="text-gray-400">There are currently no active proposals to vote on.</p>
                  </div>
                ) : (
                  PROPOSALS.filter(p => p.status === 'active').map(proposal => (
                    <Card 
                      key={proposal.id} 
                      className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(proposal.status)}
                              {getCategoryBadge(proposal.category)}
                            </div>
                            <CardTitle>{proposal.title}</CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 3)}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400 flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1" />
                              {getTimeStatus(proposal)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                        
                        <div className="mb-2">
                          <div className="flex justify-between mb-1 text-sm">
                            <span>Quorum Progress</span>
                            <span>{formatVotes(proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)} / {formatVotes(proposal.quorum)}</span>
                          </div>
                          <Progress value={calculateProgress(proposal)} className="h-2 bg-gray-800" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-green-500">For</span>
                              <span className="text-green-500">{calculateVotePercentage(proposal.votesFor, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesFor, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-green-500" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-red-500">Against</span>
                              <span className="text-red-500">{calculateVotePercentage(proposal.votesAgainst, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesAgainst, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-red-500" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Abstain</span>
                              <span className="text-gray-500">{calculateVotePercentage(proposal.votesAbstain, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesAbstain, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-gray-500" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-4">
                        <Button
                          variant="outline" 
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="space-y-4">
                {PROPOSALS.filter(p => p.status === 'pending').length === 0 ? (
                  <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-semibold mb-2">No Pending Proposals</h3>
                    <p className="text-gray-400">There are currently no pending proposals.</p>
                  </div>
                ) : (
                  PROPOSALS.filter(p => p.status === 'pending').map(proposal => (
                    <Card 
                      key={proposal.id} 
                      className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      {/* Similar to active proposals but with pending status */}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(proposal.status)}
                              {getCategoryBadge(proposal.category)}
                            </div>
                            <CardTitle>{proposal.title}</CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 3)}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-yellow-500 flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1" />
                              {getTimeStatus(proposal)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                        
                        <div className="flex items-center justify-center py-4 text-yellow-500">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <span>Voting has not started yet</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-4">
                        <Button
                          variant="outline" 
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-0">
              <div className="space-y-4">
                {PROPOSALS.filter(p => p.status === 'passed' || p.status === 'rejected').length === 0 ? (
                  <div className="text-center py-12 bg-gray-900/30 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-semibold mb-2">No Closed Proposals</h3>
                    <p className="text-gray-400">There are currently no closed proposals.</p>
                  </div>
                ) : (
                  PROPOSALS.filter(p => p.status === 'passed' || p.status === 'rejected').map(proposal => (
                    <Card 
                      key={proposal.id} 
                      className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(proposal.status)}
                              {getCategoryBadge(proposal.category)}
                            </div>
                            <CardTitle>{proposal.title}</CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 3)}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              Ended {formatDate(proposal.endTime)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-green-500">For</span>
                              <span className="text-green-500">{calculateVotePercentage(proposal.votesFor, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesFor, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-green-500" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-red-500">Against</span>
                              <span className="text-red-500">{calculateVotePercentage(proposal.votesAgainst, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesAgainst, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-red-500" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Abstain</span>
                              <span className="text-gray-500">{calculateVotePercentage(proposal.votesAbstain, proposal).toFixed(1)}%</span>
                            </div>
                            <Progress value={calculateVotePercentage(proposal.votesAbstain, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-gray-500" />
                          </div>
                        </div>
                        
                        {proposal.userVoted && (
                          <div className="mt-3 flex items-center text-sm border-t border-gray-800 pt-3">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            <span>You voted: {proposal.userVoted}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t border-gray-800 pt-4">
                        <Button
                          variant="outline" 
                          className="w-full"
                        >
                          View Results
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {PROPOSALS.map(proposal => (
                  <Card 
                    key={proposal.id} 
                    className="bg-gray-900/60 border-gray-800 backdrop-blur-sm hover:border-gray-700 transition-all cursor-pointer"
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(proposal.status)}
                            {getCategoryBadge(proposal.category)}
                          </div>
                          <CardTitle>{proposal.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 3)}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 flex items-center justify-end">
                            {proposal.status === 'active' || proposal.status === 'pending' ? (
                              <>
                                <Clock className="h-4 w-4 mr-1" />
                                {getTimeStatus(proposal)}
                              </>
                            ) : (
                              <>Ended {formatDate(proposal.endTime)}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                      
                      {proposal.status === 'pending' ? (
                        <div className="flex items-center justify-center py-4 text-yellow-500">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <span>Voting has not started yet</span>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2">
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Quorum Progress</span>
                              <span>{formatVotes(proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain)} / {formatVotes(proposal.quorum)}</span>
                            </div>
                            <Progress value={calculateProgress(proposal)} className="h-2 bg-gray-800" />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div>
                              <div className="flex justify-between text-xs">
                                <span className="text-green-500">For</span>
                                <span className="text-green-500">{calculateVotePercentage(proposal.votesFor, proposal).toFixed(1)}%</span>
                              </div>
                              <Progress value={calculateVotePercentage(proposal.votesFor, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-green-500" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs">
                                <span className="text-red-500">Against</span>
                                <span className="text-red-500">{calculateVotePercentage(proposal.votesAgainst, proposal).toFixed(1)}%</span>
                              </div>
                              <Progress value={calculateVotePercentage(proposal.votesAgainst, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-red-500" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Abstain</span>
                                <span className="text-gray-500">{calculateVotePercentage(proposal.votesAbstain, proposal).toFixed(1)}%</span>
                              </div>
                              <Progress value={calculateVotePercentage(proposal.votesAbstain, proposal)} className="h-1 bg-gray-800" indicatorClassName="bg-gray-500" />
                            </div>
                          </div>
                        </>
                      )}
                      
                      {proposal.userVoted && (
                        <div className="mt-3 flex items-center text-sm border-t border-gray-800 pt-3">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          <span>You voted: {proposal.userVoted}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t border-gray-800 pt-4">
                      <Button
                        variant="outline" 
                        className="w-full"
                      >
                        View Details
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