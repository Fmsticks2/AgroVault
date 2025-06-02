import { useState, useCallback, useEffect } from 'react';
import { getWallet, WalletType } from '../services/aleoWalletService';

interface UseAleoWalletReturn {
  walletType: WalletType | null;
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  signTransaction: (tx: any) => Promise<string>;
  sendTransaction: (signedTx: string) => Promise<string>;
}

export const useAleoWallet = (): UseAleoWalletReturn => {
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      // Check localStorage for a saved wallet type
      const savedWalletType = localStorage.getItem('aleoWalletType') as WalletType | null;
      const savedAddress = localStorage.getItem('aleoWalletAddress');
      
      if (savedWalletType && savedAddress) {
        try {
          // Try to reconnect to the saved wallet
          const wallet = getWallet(savedWalletType);
          const isAvailable = await wallet.isAvailable();
          
          if (isAvailable) {
            // Set the state without calling connect again
            setWalletType(savedWalletType);
            setAddress(savedAddress);
            setIsConnected(true);
          } else {
            // Clear saved state if wallet is no longer available
            localStorage.removeItem('aleoWalletType');
            localStorage.removeItem('aleoWalletAddress');
          }
        } catch (error) {
          // If reconnection fails, clear the saved state
          localStorage.removeItem('aleoWalletType');
          localStorage.removeItem('aleoWalletAddress');
          console.error('Failed to reconnect to wallet:', error);
        }
      }
    };

    checkExistingConnection();
  }, []);

  const connect = useCallback(async (type: WalletType) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const wallet = getWallet(type);
      
      // Check if wallet is available before attempting connection
      const isAvailable = await wallet.isAvailable();
      if (!isAvailable) {
        throw new Error(`${type} wallet is not available. Please install the wallet extension.`);
      }
      
      const walletAddress = await wallet.connect();
      
      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }
      
      setWalletType(type);
      setAddress(walletAddress);
      setIsConnected(true);
      
      // Save connection info for persistence
      localStorage.setItem('aleoWalletType', type);
      localStorage.setItem('aleoWalletAddress', walletAddress);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error connecting to wallet';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Wallet connection error:', error);
      throw error; // Re-throw to allow caller to handle
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletType(null);
    setAddress('');
    setIsConnected(false);
    setError(null);
    localStorage.removeItem('aleoWalletType');
    localStorage.removeItem('aleoWalletAddress');
  }, []);

  const signTransaction = useCallback(async (tx: any): Promise<string> => {
    if (!walletType || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const wallet = getWallet(walletType);
      return await wallet.signTransaction(tx);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error signing transaction';
      setError(errorMessage);
      throw error;
    }
  }, [walletType, isConnected]);

  const sendTransaction = useCallback(async (signedTx: string): Promise<string> => {
    if (!walletType || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const wallet = getWallet(walletType);
      return await wallet.sendTransaction(signedTx);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error sending transaction';
      setError(errorMessage);
      throw error;
    }
  }, [walletType, isConnected]);

  return {
    walletType,
    address,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    signTransaction,
    sendTransaction,
  };
};