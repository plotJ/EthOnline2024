import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

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