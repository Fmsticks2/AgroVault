import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/scrollbar.css';
import { WalletProvider } from './components/WalletProvider';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider network={WalletAdapterNetwork.Testnet} programId="marketplace.aleo">
      <App />
    </WalletProvider>
  </React.StrictMode>,
);
