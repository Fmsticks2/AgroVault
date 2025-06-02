import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { WalletIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Profile from './Profile';
import WalletService, { WalletInfo, ConnectedWallet } from '../services/walletService';
import { cn } from '../lib/utils';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';


const Navbar = () => {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const wallets = await WalletService.getInstalledWallets();
        setAvailableWallets(wallets);
      } catch (err) {
        console.error('Error loading wallets:', err);
        showError('Failed to load available wallets');
      }
    };
    loadWallets();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const showError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const connectWallet = async (walletName: string) => {
    try {
      setIsLoading(true);
      setError('');
      const walletData = await WalletService.connectWallet(walletName);
      setAccount(walletData.address);
      setSelectedWallet(walletName);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      showError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await WalletService.disconnectWallet();
      setIsConnected(false);
      setAccount('');
      setSelectedWallet('');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      showError('Failed to disconnect wallet');
    }
  };

  // Cart count state (sync with Marketplace page if possible, else mock for now)
  const [cartCount, setCartCount] = useState<number>(0);
  useEffect(() => {
    // TODO: Optionally sync with Marketplace cart state via context or global store
    // For now, mock value
    setCartCount(Number(localStorage.getItem('cartCount')) || 0);
  }, []);

  // Add this function to handle cart click
  const handleCartClick = () => {
    // For now, just show a toast or navigate to cart page if implemented
    toast.info('Go to cart (feature coming soon)', { position: 'top-right', autoClose: 2000 });
  };

  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-background shadow-md">
      {/* Left: Logo + AgroVault name */}
      <div className="flex items-center space-x-2">
        {/* Replace with your logo image if available */}
        <img src="/logo.svg" alt="AgroVault Logo" className="h-8 w-8 mr-2" />
        <Link to="/" className="text-2xl font-bold text-primary">AgroVault</Link>
      </div>
      {/* Center: Navigation Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex space-x-6">
          {localStorage.getItem('isAdmin') && (
            <>
              <Link to="/admin/analytics" className="text-text-primary hover:text-primary transition-colors">Analytics</Link>
              <Link to="/admin/dashboard" className="text-text-primary hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/admin/user-management" className="text-text-primary hover:text-primary transition-colors">User Management</Link>
              <Link to="/admin/platform-settings" className="text-text-primary hover:text-primary transition-colors">Platform Settings</Link>
              <Link to="/admin/settings" className="text-text-primary hover:text-primary transition-colors">Settings</Link>
              <Link to="/admin/tokenomics" className="text-text-primary hover:text-primary transition-colors">Tokenomics</Link>
              <Link to="/admin/transaction-monitor" className="text-text-primary hover:text-primary transition-colors">Transaction Monitor</Link>
              <Link to="/admin/yield-farming" className="text-text-primary hover:text-primary transition-colors">Yield Farming</Link>
            </>
          )}
          {/* User links visible to all users */}
          <Link to="/operations" className="text-text-primary hover:text-primary transition-colors">Operations</Link>
          <Link to="/rates" className="text-text-primary hover:text-primary transition-colors">Rates</Link>
          <Link to="/whitepaper" className="text-text-primary hover:text-primary transition-colors">Whitepaper</Link>
          <Link to="/tokenomics" className="text-text-primary hover:text-primary transition-colors">Tokenomics</Link>
          <Link to="/marketplace" className="text-text-primary hover:text-primary transition-colors">Marketplace</Link>
          <Link to="/settings" className="text-text-primary hover:text-primary transition-colors">Settings</Link>
          <Link to="/crypto-prices" className="text-text-primary hover:text-primary transition-colors">Live Crypto Prices</Link>
        </div>
      </div>
      {/* Right: Cart Icon + Wallet Connect */}
      <div className="flex items-center space-x-4">
        <button onClick={handleCartClick} className="relative">
          <ShoppingCartIcon className="h-7 w-7 text-primary" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
          )}
        </button>
        {isConnected ? (
          // Show connected wallet address in small format
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-mono text-gray-700">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-xs text-red-600 hover:text-red-800 ml-2"
              title="Disconnect Wallet"
            >
              ×
            </button>
          </div>
        ) : (
          // Show wallet connect menu only if not connected
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button ref={buttonRef} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              <WalletIcon className="h-6 w-6 mr-2 text-green-500 animate-bounce" />
              <span>Connect Wallet</span>
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Transition}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                {["LEO", "Puzzle"].map((wallet) => (
                  <Menu.Item key={wallet}>
                    {({ active }) => (
                      <button
                        onClick={() => connectWallet(wallet)}
                        className={`${active ? "bg-gray-100" : ""} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {wallet}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;