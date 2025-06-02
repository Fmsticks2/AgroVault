/**
 * Aleo Service Configuration for Smart Contract Interactions
 * Handles all interactions with Aleo blockchain and smart contracts
 */

import { Account, ProgramManager, AleoKeyProvider, AleoNetworkClient, NetworkRecordProvider } from '@aleohq/sdk';

// Type definitions for better type safety
interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  harvest_date: string;
  certification: string;
}

interface AccountInfo {
  address: string;
  privateKey: string;
}

interface NewAccountInfo extends AccountInfo {
  viewKey: string;
}

// Aleo Configuration
const ALEO_NETWORK = import.meta.env.VITE_ALEO_NETWORK || 'testnet3';
const ALEO_PROGRAM_ID = import.meta.env.VITE_ALEO_PROGRAM_ID || 'marketplace.aleo';
const ALEO_PRIVATE_KEY = import.meta.env.VITE_ALEO_PRIVATE_KEY;

// Network configuration
const NETWORK_URL = ALEO_NETWORK === 'testnet3' 
  ? 'https://api.explorer.aleo.org/v1'
  : 'https://api.explorer.aleo.org/v1';

// Initialize Aleo components
let account: Account | null = null;
let programManager: ProgramManager | null = null;
let keyProvider: AleoKeyProvider | null = null;
let networkClient: AleoNetworkClient | null = null;
let recordProvider: NetworkRecordProvider | null = null;

/**
 * Initialize Aleo SDK components
 */
export async function initializeAleo(privateKey?: string): Promise<void> {
  try {
    // Use provided private key or environment variable
    const key = privateKey || ALEO_PRIVATE_KEY;
    
    if (!key) {
      throw new Error('Private key is required to initialize Aleo SDK');
    }

    // Create account from private key
    account = new Account({ privateKey: key });
    
    // Initialize network client
    networkClient = new AleoNetworkClient(NETWORK_URL);
    
    // Initialize key provider
    keyProvider = new AleoKeyProvider();
    
    // Initialize record provider
    recordProvider = new NetworkRecordProvider(account, networkClient);
    
    // Initialize program manager
    programManager = new ProgramManager(
      NETWORK_URL,
      keyProvider,
      recordProvider
    );
    
    console.log('Aleo SDK initialized successfully');
    console.log('Account address:', account.address().to_string());
    
  } catch (error) {
    console.error('Failed to initialize Aleo SDK:', error);
    throw error;
  }
}

/**
 * Get account information
 */
export function getAccountInfo(): AccountInfo | null {
  if (!account) {
    console.warn('Aleo account not initialized');
    return null;
  }
  
  return {
    address: account.address().to_string(),
    privateKey: account.privateKey().to_string()
  };
}

/**
 * Get account balance
 */
export async function getAccountBalance(): Promise<number> {
  if (!account || !networkClient) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    const balance = await networkClient.getProgramMappingValue(
      'credits.aleo',
      'account', 
      account.address().to_string()
    );
    return balance && typeof balance === 'string' ? parseInt(balance.replace('u64', '')) : 0;
  } catch (error) {
    console.error('Failed to get account balance:', error);
    return 0; // Return 0 if account has no balance or doesn't exist
  }
}

/**
 * Create a new product on the marketplace
 */
export async function createProduct(productData: ProductData): Promise<string> {
  if (!programManager || !account) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    // Convert product data to Aleo format
    const inputs = [
      `${productData.name}field`,
      `${productData.description}field`,
      `${productData.price}u64`,
      `${productData.category}field`,
      `${productData.quantity}u64`,
      `${productData.harvest_date}field`,
      `${productData.certification}field`
    ];
    
    // Execute the create_product function
    const transaction = await programManager.execute(
      ALEO_PROGRAM_ID,
      'create_product',
      0.01, // Fee in credits
      false, // Not a deployment
      inputs
    );
    
    console.log('Product creation transaction:', transaction);
    return transaction.toString();
    
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

/**
 * Purchase a product from the marketplace
 */
export async function purchaseProduct(productId: string, price: number): Promise<string> {
  if (!programManager || !account) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    const inputs = [
      `${productId}field`,
      `${price}u64`
    ];
    
    const transaction = await programManager.execute(
      ALEO_PROGRAM_ID,
      'purchase_product',
      0.01, // Fee in credits
      false,
      inputs
    );
    
    console.log('Product purchase transaction:', transaction);
    return transaction.toString();
    
  } catch (error) {
    console.error('Failed to purchase product:', error);
    throw error;
  }
}

/**
 * Update product listing status
 */
export async function updateProductStatus(productId: string, isListed: boolean): Promise<string> {
  if (!programManager || !account) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    const inputs = [
      `${productId}field`,
      `${isListed}bool`
    ];
    
    const transaction = await programManager.execute(
      ALEO_PROGRAM_ID,
      'update_product_status',
      0.01,
      false,
      inputs
    );
    
    console.log('Product status update transaction:', transaction);
    return transaction.toString();
    
  } catch (error) {
    console.error('Failed to update product status:', error);
    throw error;
  }
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(transactionId: string): Promise<any> {
  if (!networkClient) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    const status = await networkClient.getTransaction(transactionId);
    return status;
  } catch (error) {
    console.error('Failed to get transaction status:', error);
    throw error;
  }
}

/**
 * Get program state
 */
export async function getProgramState(): Promise<any> {
  if (!networkClient) {
    throw new Error('Aleo SDK not initialized');
  }
  
  try {
    const state = await networkClient.getProgram(ALEO_PROGRAM_ID);
    return state;
  } catch (error) {
    console.error('Failed to get program state:', error);
    throw error;
  }
}

/**
 * Generate a new Aleo account
 */
export function generateNewAccount(): NewAccountInfo {
  const newAccount = new Account();
  
  return {
    address: newAccount.address().to_string(),
    privateKey: newAccount.privateKey().to_string(),
    viewKey: newAccount.viewKey().to_string()
  };
}

/**
 * Validate Aleo address format
 */
export function isValidAleoAddress(address: string): boolean {
  try {
    // Basic validation - Aleo addresses start with 'aleo1' and are 63 characters long
    return address.startsWith('aleo1') && address.length === 63;
  } catch {
    return false;
  }
}

/**
 * Export configuration
 */
export const ALEO_CONFIG = {
  NETWORK: ALEO_NETWORK,
  PROGRAM_ID: ALEO_PROGRAM_ID,
  NETWORK_URL: NETWORK_URL
};

/**
 * Aleo Service Class for easier usage
 */
export class AleoService {
  static async initialize(privateKey?: string) {
    return initializeAleo(privateKey);
  }
  
  static getAccount() {
    return getAccountInfo();
  }
  
  static async getBalance() {
    return getAccountBalance();
  }
  
  static async createProduct(productData: ProductData) {
    return createProduct(productData);
  }
  
  static async purchaseProduct(productId: string, price: number) {
    return purchaseProduct(productId, price);
  }
  
  static async updateProductStatus(productId: string, isListed: boolean) {
    return updateProductStatus(productId, isListed);
  }
  
  static async getTransactionStatus(transactionId: string) {
    return getTransactionStatus(transactionId);
  }
  
  static generateAccount() {
    return generateNewAccount();
  }
  
  static validateAddress(address: string) {
    return isValidAleoAddress(address);
  }
}