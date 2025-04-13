import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { WalletIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
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
          <Link to="/" className="flex items-center space-x-2">
            <img src="/new logo.svg" alt="AgroVault" className="h-16 w-16" />
            <span className="text-xl font-semibold text-text-primary">AgroVault</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors">Analytics</Link>
            <Link to="/operations" className="text-text-secondary hover:text-text-primary transition-colors">Operations</Link>
            <Link to="/rates" className="text-text-secondary hover:text-text-primary transition-colors">Rates</Link>
            <Link to="/settings" className="text-text-secondary hover:text-text-primary transition-colors">Settings</Link>
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
                <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors">Analytics</Link>
                <Link to="/operations" className="text-text-secondary hover:text-text-primary transition-colors">Operations</Link>
                <Link to="/rates" className="text-text-secondary hover:text-text-primary transition-colors">Rates</Link>
                <Link to="/settings" className="text-text-secondary hover:text-text-primary transition-colors">Settings</Link>
              </div>
            </div>
          </Transition>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <Menu as="div" className="relative">
              <Menu.Button className="btn-secondary flex items-center space-x-2">
                <WalletIcon className="h-5 w-5" />
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
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
            <button 
              onClick={connectWallet} 
              disabled={isLoading}
              className={`btn-primary flex items-center space-x-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <WalletIcon className="h-5 w-5" />
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
