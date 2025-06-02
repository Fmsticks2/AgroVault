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
      // You could implement persistence of wallet connection here
      // For example, check localStorage for a saved wallet type
      const savedWalletType = localStorage.getItem('aleoWalletType') as WalletType | null;
      
      if (savedWalletType) {
        try {
          await connect(savedWalletType);
        } catch (error) {
          // If reconnection fails, clear the saved state
          localStorage.removeItem('aleoWalletType');
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
      const walletAddress = await wallet.connect();
      
      setWalletType(type);
      setAddress(walletAddress);
      setIsConnected(true);
      
      // Save connection info for persistence
      localStorage.setItem('aleoWalletType', type);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error connecting to wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletType(null);
    setAddress('');
    setIsConnected(false);
    localStorage.removeItem('aleoWalletType');
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