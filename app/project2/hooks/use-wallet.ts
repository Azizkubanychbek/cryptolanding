"use client";

import { useState, useEffect, useCallback } from 'react';

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<{ [key: string]: string }>({
    USDC: '0',
    ETH: '0',
    BTC: '0',
    ARMA: '0',
  });

  // Mock connect function - in a real app, this would connect to a wallet provider
  const connect = useCallback(async () => {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock wallet address
      const mockAddress = '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Mock balances
      const mockBalances = {
        USDC: (Math.random() * 10000).toFixed(2),
        ETH: (Math.random() * 10).toFixed(4),
        BTC: (Math.random() * 1).toFixed(6),
        ARMA: (Math.random() * 5000).toFixed(2),
      };
      
      setAddress(mockAddress);
      setBalance(mockBalances);
      setConnected(true);
      
      // Store in localStorage for persistence
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('walletBalances', JSON.stringify(mockBalances));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return { success: false, error };
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setAddress(null);
    setBalance({
      USDC: '0',
      ETH: '0',
      BTC: '0',
      ARMA: '0',
    });
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletBalances');
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const isConnected = localStorage.getItem('walletConnected') === 'true';
    const storedAddress = localStorage.getItem('walletAddress');
    const storedBalances = localStorage.getItem('walletBalances');
    
    if (isConnected && storedAddress) {
      setConnected(true);
      setAddress(storedAddress);
      
      if (storedBalances) {
        try {
          setBalance(JSON.parse(storedBalances));
        } catch (e) {
          console.error('Failed to parse stored balances');
        }
      }
    }
  }, []);

  return {
    connected,
    address,
    balance,
    connect,
    disconnect,
  };
};