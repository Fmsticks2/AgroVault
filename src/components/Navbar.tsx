import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { WalletIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Profile from './Profile';
import WalletService, { WalletInfo, ConnectedWallet } from '../services/walletService';
import { cn } from '../lib/utils';

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

  return (
    <nav className="bg-background border-b border-border w-full px-3 sm:px-4 md:px-6 py-3 md:py-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center max-xs:gap-0 xs:gap-2 sm:gap-3">
            <img src="/new logo.svg" alt="AgroVault" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-lg sm:text-xl font-semibold text-text-primary">AgroVault</span>
          </Link>
        </div>
        {/* Desktop Navigation & Cart */}
        <div className="flex items-center gap-8">
          <Link to="/" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/" && "text-primary underline")}>Dashboard</Link>
          <Link to="/staking" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/staking" && "text-primary underline")}>Staking</Link>
          <Link to="/lending" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/lending" && "text-primary underline")}>Lending</Link>
          <Link to="/yield-farming" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/yield-farming" && "text-primary underline")}>Yield Farming</Link>
          <Link to="/governance" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/governance" && "text-primary underline")}>Governance</Link>
          <Link to="/marketplace" className={cn("text-text-primary hover:text-primary font-medium transition-colors", location.pathname === "/marketplace" && "text-primary underline")}>Marketplace</Link>
          {/* Cart Icon with count */}
          <Link to="/marketplace#cart" className="relative flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.5 14.25a2.25 2.25 0 002.25 1.75h6.75a2.25 2.25 0 002.25-1.75l1.394-7.978a1.125 1.125 0 00-1.107-1.272H6.272z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
          </Link>
        </div>
        {/* Right Section: Wallet */}
        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button ref={buttonRef} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
              <WalletIcon className="h-6 w-6 mr-2 text-green-500 animate-bounce" />
              {isConnected ? (
                <span className="truncate max-w-[100px]">{account}</span>
              ) : (
                <span>Connect Wallet</span>
              )}
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
                {['LEO', 'Puzzle'].map((wallet) => (
                  <Menu.Item key={wallet}>
                    {({ active }) => (
                      <button
                        onClick={() => connectWallet(wallet)}
                        className={`${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        <span className="mr-2">
                          {wallet === 'LEO' ? (
                            <img src="/logo.svg" alt="Leo Wallet" className="h-5 w-5 inline" />
                          ) : (
                            <img src="/vite.svg" alt="Puzzle Wallet" className="h-5 w-5 inline" />
                          )}
                        </span>
                        {wallet} Wallet
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
          {isConnected && (
            <button
              onClick={disconnectWallet}
              className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;