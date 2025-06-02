import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAleoWallet } from '../../hooks/useAleoWallet';
import { toast } from 'react-toastify';

const SeedPhraseRecovery = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAleoWallet();
  
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  
  // Check if user has completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted !== 'true') {
      navigate('/onboarding');
    }
  }, [navigate]);
  
  // Check if wallet is connected
  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet to access your seed phrase');
    }
  }, [isConnected]);
  
  // In a real application, this would be retrieved from the wallet
  // For demo purposes, we're using the same mock function as in Onboarding.tsx
  const retrieveSeedPhrase = async () => {
    setIsLoading(true);
    
    try {
      // This is a mock implementation
      // In a real app, you would call the wallet API to get the seed phrase
      const wordList = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
        'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
        'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
        'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
        'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
        'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
        'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger'
      ];
      
      // Generate a deterministic seed phrase based on the address
      // In a real app, this would come from the wallet
      const addressSeed = address || 'default';
      const seedPhrase = [];
      
      for (let i = 0; i < 12; i++) {
        // Use a simple hash of the address and index to pick words
        // This is just for demonstration - not secure for real use
        const charCode = addressSeed.charCodeAt(i % addressSeed.length);
        const index = (charCode + i) % wordList.length;
        seedPhrase.push(wordList[index]);
      }
      
      setSeedPhrase(seedPhrase);
      setHasVerified(true);
    } catch (error) {
      console.error('Error retrieving seed phrase:', error);
      toast.error('Failed to retrieve seed phrase');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerify = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    await retrieveSeedPhrase();
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background-dark rounded-xl shadow-xl p-6 sm:p-8">
        <div className="text-center space-y-6 py-6">
          <h1 className="text-2xl font-bold">Seed Phrase Recovery</h1>
          
          {!isConnected ? (
            <div className="py-8 space-y-4">
              <p className="text-text-secondary">
                Please connect your wallet to access your seed phrase.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : !hasVerified ? (
            <div className="py-8 space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
                <p className="text-yellow-500 font-medium text-sm">
                  <span className="block font-bold mb-2">⚠️ Security Warning</span>
                  Your seed phrase is the master key to your wallet. Never share it with anyone and make sure
                  no one is watching your screen when you view it.
                </p>
              </div>
              
              <p className="text-text-secondary">
                Click the button below to reveal your seed phrase. Make sure you're in a private location.
              </p>
              
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className={`px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Loading...' : 'Reveal Seed Phrase'}
              </button>
            </div>
          ) : (
            <div className="py-8 space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-500 font-medium text-sm">
                  IMPORTANT: Write down your seed phrase and store it in a safe place. 
                  This is the only way to recover your wallet if you lose access.
                  Never share it with anyone!
                </p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-4">
                {seedPhrase.map((word, index) => (
                  <div key={index} className="p-3 bg-background-light rounded-lg flex items-center">
                    <span className="text-text-secondary mr-2 text-sm">{index + 1}.</span>
                    <span className="font-mono">{word}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
                <p className="text-yellow-500 font-medium text-sm flex flex-col gap-2">
                  <span>💡 Pro Tip: Save your seed phrase securely with K33P app</span>
                  <span>K33P is a decentralized mobile app for iOS and Android that securely stores your seed phrases.</span>
                  <a 
                    href="https://k33p.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Download K33P App
                  </a>
                </p>
              </div>
              
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors mt-4"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseRecovery;