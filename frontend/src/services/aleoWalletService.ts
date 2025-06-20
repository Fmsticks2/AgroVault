// aleoWalletService.ts
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Transaction } from '@demox-labs/aleo-wallet-adapter-base';
import * as PuzzleSDK from '@puzzlehq/sdk';

export type WalletType = 'LEO' | 'Puzzle';

export interface Wallet {
  connect(): Promise<string>; // Returns address
  signTransaction(tx: any): Promise<string>; // Returns signed tx
  sendTransaction(signedTx: string): Promise<string>; // Returns tx hash
  isAvailable(): Promise<boolean>; // Check if wallet is available
}

// Utility functions for wallet detection
export const detectWalletAvailability = {
  LEO: async (): Promise<boolean> => {
    try {
      // Check if LEO wallet extension is installed
      return typeof window !== 'undefined' && 
             'leo' in window && 
             typeof (window as any).leo === 'object';
    } catch {
      return false;
    }
  },
  
  Puzzle: async (): Promise<boolean> => {
    try {
      // Check if Puzzle wallet is available by checking for the SDK and wallet object
      if (typeof window !== 'undefined' && (window as any).puzzle) {
        return true;
      }
      // Alternative check: try to initialize SDK without connecting
      const isAvailable = await PuzzleSDK.isAvailable?.() || false;
      return isAvailable;
    } catch {
      // If SDK is not loaded or wallet is not available
      return false;
    }
  }
};

// LEO Wallet integration using @demox-labs/aleo-wallet-adapter-leo
export class LEOWallet implements Wallet {
  private adapter: LeoWalletAdapter;
  private programId: string;
  
  constructor(programId: string = 'marketplace.aleo') {
    this.adapter = new LeoWalletAdapter({ appName: 'AgroVault' });
    this.programId = programId;
  }

  async isAvailable(): Promise<boolean> {
    return detectWalletAvailability.LEO();
  }

  async connect(): Promise<string> {
    try {
      // First check if wallet is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('LEO Wallet extension is not installed. Please install it from the Chrome Web Store.');
      }

      if (!this.adapter.connected) {
        await this.adapter.connect();
      }
      
      const walletAccount = this.adapter.publicKey;
      if (!walletAccount) {
        throw new Error('Wallet connection failed: No public key found');
      }
      
      return walletAccount.toString();
    } catch (error) {
      console.error('LEO Wallet connection error:', error);
      throw new Error(`LEO Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async signTransaction(tx: any): Promise<string> {
    try {
      if (!this.adapter.connected) {
        throw new Error('Wallet not connected');
      }

      // Create a new transaction object
      const transaction = new Transaction();
      
      // Add the function call to the transaction
      transaction.add({
        program: this.programId,
        function: tx.functionName || tx.function,
        inputs: tx.inputs || [],
        fee: tx.fee || 0.001
      });

      // Sign the transaction using the adapter
      const signedTx = await this.adapter.signTransaction(transaction);
      return JSON.stringify(signedTx);
    } catch (error) {
      console.error('LEO Wallet sign transaction error:', error);
      throw new Error(`LEO Wallet sign transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendTransaction(signedTx: string): Promise<string> {
    try {
      if (!this.adapter.connected) {
        throw new Error('Wallet not connected');
      }

      // Parse the signed transaction
      const transaction = JSON.parse(signedTx);
      
      // Submit the transaction
      const txId = await this.adapter.submitTransaction(transaction);
      return txId;
    } catch (error) {
      console.error('LEO Wallet send transaction error:', error);
      throw new Error(`LEO Wallet send transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Puzzle Wallet integration using @puzzlehq/sdk
export class PuzzleWallet implements Wallet {
  private programId: string;
  
  constructor(programId: string = 'marketplace.aleo') {
    this.programId = programId;
  }

  async isAvailable(): Promise<boolean> {
    return detectWalletAvailability.Puzzle();
  }

  async connect(): Promise<string> {
    try {
      // First check if wallet is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Puzzle Wallet is not available. Please install the Puzzle Wallet app or use a supported browser.');
      }

      // Check if already connected
      const connectionStatus = await PuzzleSDK.getAccount();
      
      // If not connected, request connection
      if (!connectionStatus.account) {
        // Updated for SDK v1.0.3
        const result = await PuzzleSDK.connect();
        if (!result.account) {
          throw new Error('Puzzle Wallet connection failed: No account found');
        }
        return result.account.address;
      }
      
      return connectionStatus.account.address;
    } catch (error) {
      console.error('Puzzle Wallet connection error:', error);
      throw new Error(`Puzzle Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async signTransaction(tx: any): Promise<string> {
    try {
      // Check if connected
      const connectionStatus = await PuzzleSDK.getAccount();
      if (!connectionStatus.account) {
        throw new Error('Wallet not connected');
      }

      // Create a transaction event using the SDK's requestCreateEvent method
      const result = await PuzzleSDK.requestCreateEvent({
        type: 'Execute' as any, // Use string instead of enum
        programId: this.programId,
        functionId: tx.functionName || tx.function,
        fee: tx.fee || 0.001,
        inputs: tx.inputs || [],
      });

      if (!result.eventId) {
        throw new Error(result.error || 'Failed to create transaction');
      }

      return result.eventId;
    } catch (error) {
      console.error('Puzzle Wallet sign transaction error:', error);
      throw new Error(`Puzzle Wallet sign transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendTransaction(eventId: string): Promise<string> {
    try {
      // Check if connected
      const connectionStatus = await PuzzleSDK.getAccount();
      if (!connectionStatus.account) {
        throw new Error('Wallet not connected');
      }

      // Get the event status using the SDK's getEvent method
      const result = await PuzzleSDK.getEvent({ id: eventId });

      if (!result.event) {
        throw new Error(result.error || 'Failed to get event');
      }

      // Poll for transaction completion if needed
      if (result.event.status !== 'Finalized') {
        // In a real implementation, you might want to implement polling here
        // For now, we'll just return the event ID and let the caller check status
        return eventId;
      }

      // Return the transaction ID if available
      if (result.event.transactionId) {
        return result.event.transactionId;
      }
      
      return eventId; // Return event ID if transaction ID is not available
    } catch (error) {
      console.error('Puzzle Wallet send transaction error:', error);
      throw new Error(`Puzzle Wallet send transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export function getWallet(type: WalletType, programId: string = 'marketplace.aleo'): Wallet {
  if (type === 'LEO') return new LEOWallet(programId);
  if (type === 'Puzzle') return new PuzzleWallet(programId);
  throw new Error('Unsupported wallet type');
}