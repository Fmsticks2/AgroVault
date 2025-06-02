import { FC, ReactNode, useMemo } from 'react';
import { WalletProvider as AleoDemoxWalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { WalletAdapterNetwork, DecryptPermission } from '@demox-labs/aleo-wallet-adapter-base';

// Default styles that can be overridden by your app
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  programId?: string;
}

export const WalletProvider: FC<WalletProviderProps> = ({ 
  children, 
  network = WalletAdapterNetwork.Testnet,
  programId = 'marketplace.aleo' // Replace with your actual program ID
}) => {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Testnet) {
      return 'https://testnet.aleo.org/v1';
    } else if (network === 'mainnet') {
      return 'https://mainnet.aleo.org/v1';
    }
    return 'https://testnet.aleo.org/v1';
  }, [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({ appName: 'AgroVault' }),
    ],
    []
  );

  return (
    <AleoDemoxWalletProvider 
      wallets={wallets} 
      decryptPermission={DecryptPermission.UponRequest}
      network={network} 
      autoConnect
    >
      <WalletModalProvider>
        {children}
      </WalletModalProvider>
    </AleoDemoxWalletProvider>
  );
};

export default WalletProvider;