import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { WalletIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Profile from './Profile';

const Navbar = () => {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        setError('');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Failed to connect wallet. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please install MetaMask to connect your wallet.');
    }
  };

  return (
    <nav className="bg-background border-b border-border w-full px-6 py-4">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/new logo.svg" alt="AgroVault" className="h-12 w-12" />
            <span className="text-xl font-semibold text-text-primary whitespace-nowrap">AgroVault</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {error && <p className="text-red-500 text-sm px-2">{error}</p>}
            <Link to="/" className={`relative px-2 py-1 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Analytics
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/operations" className={`relative px-2 py-1 transition-colors ${location.pathname === '/operations' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Operations
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/rates" className={`relative px-2 py-1 transition-colors ${location.pathname === '/rates' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Rates
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/whitepaper" className={`relative px-2 py-1 transition-colors ${location.pathname === '/whitepaper' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Whitepaper
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/tokenomics" className={`relative px-2 py-1 transition-colors ${location.pathname === '/tokenomics' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Tokenomics
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
            <Link to="/settings" className={`relative px-2 py-1 transition-colors ${location.pathname === '/settings' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
              Settings
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </Link>
          </div>
          
          <button
            className="md:hidden text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <Transition
            show={isMobileMenuOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden">
              <div className="flex flex-col space-y-4">
                <Link to="/" className={`relative px-2 py-1 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Analytics
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
                <Link to="/operations" className={`relative px-2 py-1 transition-colors ${location.pathname === '/operations' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Operations
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
                <Link to="/rates" className={`relative px-2 py-1 transition-colors ${location.pathname === '/rates' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Rates
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
                <Link to="/whitepaper" className={`relative px-2 py-1 transition-colors ${location.pathname === '/whitepaper' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Whitepaper
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
                <Link to="/tokenomics" className={`relative px-2 py-1 transition-colors ${location.pathname === '/tokenomics' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Tokenomics
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
                <Link to="/settings" className={`relative px-2 py-1 transition-colors ${location.pathname === '/settings' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'} group`}>
                  Settings
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </Link>
              </div>
            </div>
          </Transition>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <Menu as="div" className="relative">
              <Menu.Button className="btn-secondary flex items-center justify-center space-x-3 px-4 py-2 min-w-[160px]">
                <WalletIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{account.slice(0, 6)}...{account.slice(-4)}</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-background-light border border-border rounded-lg shadow-lg py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? 'bg-background' : ''} w-full text-left px-4 py-2 text-text-primary`}
                      onClick={() => setIsConnected(false)}
                    >
                      Disconnect
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={connectWallet} 
                disabled={isLoading}
                className={`btn-primary flex items-center justify-center space-x-3 px-4 py-2 min-w-[160px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <WalletIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
              {isConnected && <Profile />}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
