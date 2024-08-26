import { ethers } from 'ethers';

export async function getProvider() {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('No Ethereum provider found');
}
