import { BrowserWallet } from '@meshsdk/core';

export interface WalletInfo {
  name: string;
  icon: string;
  installed: boolean;
}

export interface ConnectedWallet {
  address: string;
  network: string;
  balance: string;
}

class WalletService {
  private static availableWallets: WalletInfo[] = [
    { name: 'Nami', icon: 'nami-logo', installed: false },
    { name: 'Eternl', icon: 'eternl-logo', installed: false },
    { name: 'Flint', icon: 'flint-logo', installed: false },
    { name: 'Gero', icon: 'gero-logo', installed: false },
    { name: 'Typhon', icon: 'typhon-logo', installed: false }
  ];

  static async getInstalledWallets(): Promise<WalletInfo[]> {
    const installedWallets = await BrowserWallet.getInstalledWallets();
    return this.availableWallets.map(wallet => ({
      ...wallet,
      installed: installedWallets.some(w => w.name.toLowerCase() === wallet.name.toLowerCase())
    }));
  }

  static async connectWallet(walletName: string): Promise<ConnectedWallet> {
    try {
      // Check if wallet is installed
      const installedWallets = await BrowserWallet.getInstalledWallets();
      const isWalletInstalled = installedWallets.some(w => w.name.toLowerCase() === walletName.toLowerCase());
      if (!isWalletInstalled) {
        throw new Error(`${walletName} wallet is not installed`);
      }

      // Try to enable the wallet
      const wallet = await BrowserWallet.enable(walletName);
      if (!wallet) {
        throw new Error('Wallet service is unavailable');
      }

      const networkId = await wallet.getNetworkId();
      const network = networkId === 1 ? 'Mainnet' : 'Testnet';
      const usedAddresses = await wallet.getUsedAddresses();
      const balance = await wallet.getBalance();

      if (!usedAddresses || usedAddresses.length === 0) {
        throw new Error('No wallet addresses available');
      }

      return {
        address: usedAddresses[0],
        network,
        balance: balance.toString()
      };
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  static async disconnectWallet(): Promise<void> {
    // Implement any cleanup needed when disconnecting
    localStorage.removeItem('connectedWallet');
  }
}

export default WalletService;