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

  return (
    <nav className="bg-background border-b border-border w-full px-3 sm:px-4 md:px-6 py-3 md:py-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/new logo.svg" alt="AgroVault" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-lg sm:text-xl font-semibold text-text-primary">AgroVault</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center gap-6 lg:gap-8">
            {[
              { path: '/', label: 'Analytics' },
              { path: '/operations', label: 'Operations' },
              { path: '/rates', label: 'Rates' },
              { path: '/whitepaper', label: 'Whitepaper' },
              { path: '/tokenomics', label: 'Tokenomics' },
              { path: '/settings', label: 'Settings' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "relative px-2 py-1 text-sm font-medium transition-colors duration-200",
                  "hover:text-primary",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
                  "after:origin-left after:scale-x-0 after:bg-primary",
                  "after:transition-transform after:duration-200",
                  "hover:after:scale-x-100",
                  location.pathname === path ? "text-primary after:scale-x-100" : "text-text-secondary"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section: Wallet & Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Wallet Connection */}
          <div className="flex items-center">
            {isConnected ? (
              <Menu as="div" className="relative">
                <Menu.Button className="btn-secondary flex items-center space-x-2 px-3 py-1.5 text-sm">
                  <WalletIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {selectedWallet} - {account.slice(0, 4)}...{account.slice(-4)}
                  </span>
                  <span className="sm:hidden">{account.slice(0, 4)}...</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-background-light border border-border rounded-lg shadow-lg py-1 z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-background' : ''} w-full text-left px-4 py-2 text-text-primary`}
                        onClick={disconnectWallet}
                      >
                        Disconnect
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Menu as="div" className="relative">
                <Menu.Button
                  className={`btn-primary flex items-center space-x-2 px-3 py-1.5 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  <WalletIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                  <span className="sm:hidden">Connect</span>
                  <ChevronDownIcon className="h-3 w-3" />
                </Menu.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-background-light border border-border rounded-lg shadow-lg py-1 z-50">
                    {availableWallets.map((wallet) => (
                      <Menu.Item key={wallet.name}>
                        {({ active }) => (
                          <button
                            className={`${active ? 'bg-background' : ''} w-full text-left px-4 py-2 text-text-primary ${!wallet.installed ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => wallet.installed && connectWallet(wallet.name)}
                            disabled={!wallet.installed || isLoading}
                          >
                            {wallet.name} {!wallet.installed && '(Not Installed)'}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>

          {/* Profile Component */}
          {isConnected && <Profile />}

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            type="button"
            className="p-2 rounded-lg hover:bg-background-light lg:hidden transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef}>
        <Transition
          show={isMobileMenuOpen}
          enter="transition-all ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
          className="absolute top-full left-0 right-0 bg-background border-b border-border lg:hidden z-40"
        >
          <div className="p-4 space-y-3">
            <div className="flex flex-col space-y-2">
              {[
                { path: '/', label: 'Analytics' },
                { path: '/operations', label: 'Operations' },
                { path: '/rates', label: 'Rates' },
                { path: '/whitepaper', label: 'Whitepaper' },
                { path: '/tokenomics', label: 'Tokenomics' },
                { path: '/settings', label: 'Settings' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg",
                    location.pathname === path 
                      ? "bg-background-light text-primary" 
                      : "text-text-secondary hover:bg-background-light"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Wallet Connection */}
            <div className="pt-2 border-t border-border">
              {isConnected ? (
                <button
                  onClick={disconnectWallet}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-background-light rounded-lg"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <div className="space-y-2">
                  {availableWallets.map((wallet) => (
                    wallet.installed && (
                      <button
                        key={wallet.name}
                        onClick={() => connectWallet(wallet.name)}
                        disabled={isLoading}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-background-light'
                        }`}
                      >
                        <WalletIcon className="h-4 w-4" />
                        <span>Connect {wallet.name}</span>
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  );
};

export default Navbar;