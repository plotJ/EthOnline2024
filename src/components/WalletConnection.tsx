'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Button } from './ui/button';
import { createVoterAttestation } from '@/utils/attestation'; // Import the function

// Custom hook for wallet functionality
export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress();
        setAddress(walletAddress);
        console.log('Wallet connected:', walletAddress);

        // Create voter attestation
        await createVoterAttestation(walletAddress); // Create attestation on connect
        console.log("Voter attestation created for wallet:", walletAddress);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.error('Ethereum object not found, do you have MetaMask installed?');
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0) {
        setAddress(accounts[0] as string);
      } else {
        setAddress(null);
      }
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return { connect, disconnect, address };
}

// WalletConnection component
export function WalletConnection() {
  const { connect, disconnect, address } = useWallet();

  return (
    <div>
      {address ? (
        <Button onClick={disconnect}>
          Disconnect: {address.slice(0, 6)}...{address.slice(-4)}
        </Button>
      ) : (
        <Button onClick={connect}>Connect Wallet</Button>
      )}
    </div>
  );
}