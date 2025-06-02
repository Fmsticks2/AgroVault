import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAleoWallet } from '../../hooks/useAleoWallet';
import { detectWalletAvailability } from '../../services/aleoWalletService';
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Onboarding steps
const STEPS = {
  WELCOME: 0,
  ABOUT: 1,
  FEATURES: 2,
  WALLET_CONNECTION: 3,
  SEED_PHRASE: 4,
  VERIFY_SEED_PHRASE: 5,
  COMPLETE: 6
};

// Mock seed phrase generation (in a real app, this would come from the wallet)
const generateSeedPhrase = () => {
  const wordList = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
    'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
    'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger'
  ];
  
  const seedPhrase = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    seedPhrase.push(wordList[randomIndex]);
  }
  
  return seedPhrase;
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { connect, disconnect, isConnected, address } = useAleoWallet();
  
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [inputSeedPhrase, setInputSeedPhrase] = useState<string[]>(Array(12).fill(''));
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [walletAvailability, setWalletAvailability] = useState<{LEO: boolean, Puzzle: boolean}>({LEO: false, Puzzle: false});
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      navigate('/');
    }
  }, [navigate]);
  
  // Generate seed phrase when reaching that step
  useEffect(() => {
    if (currentStep === STEPS.SEED_PHRASE && seedPhrase.length === 0) {
      setSeedPhrase(generateSeedPhrase());
    }
  }, [currentStep, seedPhrase]);

  // Check wallet availability when component mounts or when reaching wallet connection step
  useEffect(() => {
    const checkWalletAvailability = async () => {
      try {
        const [leoAvailable, puzzleAvailable] = await Promise.all([
          detectWalletAvailability.LEO(),
          detectWalletAvailability.Puzzle()
        ]);
        setWalletAvailability({ LEO: leoAvailable, Puzzle: puzzleAvailable });
      } catch (error) {
        console.error('Error checking wallet availability:', error);
        setWalletAvailability({ LEO: false, Puzzle: false });
      }
    };

    if (currentStep === STEPS.WALLET_CONNECTION) {
      checkWalletAvailability();
    }
  }, [currentStep]);
  
  // Handle wallet connection
  const handleConnectWallet = async (walletType: 'LEO' | 'Puzzle') => {
    try {
      await connect(walletType);
      // Only show success and proceed if connection was actually successful
      if (isConnected) {
        toast.success(`${walletType} Wallet connected successfully!`);
        // Don't auto-advance, let user click continue when ready
      }
    } catch (error) {
      toast.error(`Failed to connect ${walletType} wallet. Please try again.`);
      console.error('Wallet connection error:', error);
    }
  };
  
  // Handle seed phrase verification
  const handleVerifySeedPhrase = () => {
    setIsVerifying(true);
    
    // Check if input matches the generated seed phrase
    const isCorrect = inputSeedPhrase.every((word, index) => 
      word.toLowerCase().trim() === seedPhrase[index].toLowerCase());
    
    if (isCorrect) {
      toast.success('Seed phrase verified successfully!');
      setHasCompletedOnboarding(true);
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('seedPhraseVerified', 'true');
      goToNextStep();
    } else {
      toast.error('Seed phrase verification failed. Please check your input and try again.');
    }
    
    setIsVerifying(false);
  };
  
  // Handle input change for seed phrase verification
  const handleSeedPhraseInputChange = (index: number, value: string) => {
    const newInputSeedPhrase = [...inputSeedPhrase];
    newInputSeedPhrase[index] = value;
    setInputSeedPhrase(newInputSeedPhrase);
  };
  
  // Navigation functions
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const finishOnboarding = () => {
    navigate('/');
  };
  
  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Welcome to AgroVault</h1>
            <p className="text-lg text-text-secondary">
              Your gateway to decentralized agricultural finance
            </p>
            <div className="py-8">
              <img 
                src="/logo.svg" 
                alt="AgroVault Logo" 
                className="w-32 h-32 mx-auto"
              />
            </div>
            <p className="text-text-secondary">
              Let's get you set up with everything you need to start using AgroVault
            </p>
          </div>
        );
      
      case STEPS.ABOUT:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">About AgroVault</h1>
            <p className="text-text-secondary">
              AgroVault is a decentralized finance platform built specifically for the agricultural sector.
              We connect farmers, investors, and agricultural businesses through blockchain technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Our Mission</h3>
                <p className="text-sm text-text-secondary">
                  To democratize agricultural finance and create new opportunities for growth and sustainability in farming.
                </p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Built on Aleo</h3>
                <p className="text-sm text-text-secondary">
                  Leveraging Aleo's privacy-preserving blockchain technology for secure and efficient transactions.
                </p>
              </div>
            </div>
          </div>
        );
      
      case STEPS.FEATURES:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">Key Features</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Marketplace</h3>
                <p className="text-sm text-text-secondary">
                  Buy and sell agricultural assets and commodities in a decentralized marketplace.
                </p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Staking</h3>
                <p className="text-sm text-text-secondary">
                  Stake your tokens to earn rewards and participate in platform governance.
                </p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Lending</h3>
                <p className="text-sm text-text-secondary">
                  Access loans using your agricultural assets as collateral or lend your funds to earn interest.
                </p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Yield Farming</h3>
                <p className="text-sm text-text-secondary">
                  Provide liquidity and earn additional rewards through yield farming strategies.
                </p>
              </div>
            </div>
          </div>
        );
      
      case STEPS.WALLET_CONNECTION:
        return (
          <div className="space-y-6 text-center">
            <h1 className="text-2xl font-bold">Connect Your Wallet</h1>
            <p className="text-text-secondary">
              To use AgroVault, you'll need to connect an Aleo-compatible wallet.
              Choose from the supported wallets below.
            </p>
            <div className="py-6">
              {!isConnected ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                      onClick={() => handleConnectWallet('LEO')}
                      disabled={isConnecting || !walletAvailability.LEO}
                      className={`py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center space-y-2 ${
                        walletAvailability.LEO 
                          ? 'bg-primary text-white hover:bg-primary-dark' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="font-semibold">LEO Wallet</span>
                      <span className="text-sm opacity-90">
                        {walletAvailability.LEO ? 'Browser Extension' : 'Not Installed'}
                      </span>
                      {walletAvailability.LEO && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </button>
                    <button
                      onClick={() => handleConnectWallet('Puzzle')}
                      disabled={isConnecting || !walletAvailability.Puzzle}
                      className={`py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center space-y-2 ${
                        walletAvailability.Puzzle 
                          ? 'bg-secondary text-white hover:bg-secondary-dark' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="font-semibold">Puzzle Wallet</span>
                      <span className="text-sm opacity-90">
                        {walletAvailability.Puzzle ? 'Mobile & Web' : 'Not Available'}
                      </span>
                      {walletAvailability.Puzzle && (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      )}
                    </button>
                  </div>
                  
                  {/* Wallet installation help */}
                  {(!walletAvailability.LEO || !walletAvailability.Puzzle) && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Need to install a wallet?</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        {!walletAvailability.LEO && (
                          <p>• <strong>LEO Wallet:</strong> Install from the Chrome Web Store for browser use</p>
                        )}
                        {!walletAvailability.Puzzle && (
                          <p>• <strong>Puzzle Wallet:</strong> Available as mobile app or web wallet</p>
                        )}
                      </div>
                    </div>
                  )}
                  {isConnecting && (
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-text-secondary">Connecting to wallet...</span>
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">Wallet Connected Successfully</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">Connected Address:</p>
                    <p className="font-mono text-sm break-all bg-white p-2 rounded border">{address}</p>
                    <p className="text-xs text-text-secondary mt-2">Wallet Type: {walletType}</p>
                  </div>
                  <button
                    onClick={goToNextStep}
                    className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Continue to Next Step
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case STEPS.SEED_PHRASE:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">Your Seed Phrase</h1>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
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
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
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
          </div>
        );
      
      case STEPS.VERIFY_SEED_PHRASE:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">Verify Your Seed Phrase</h1>
            <p className="text-text-secondary text-center">
              Please enter your seed phrase in the correct order to verify that you've saved it.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-4">
              {inputSeedPhrase.map((word, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-xs text-text-secondary mb-1">{index + 1}.</label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => handleSeedPhraseInputChange(index, e.target.value)}
                    className="p-2 bg-background-light border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={`Word ${index + 1}`}
                    disabled={isVerifying}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      
      case STEPS.COMPLETE:
        return (
          <div className="text-center space-y-6">
            <div className="py-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Setup Complete!</h1>
            <p className="text-lg text-text-secondary">
              You're all set to start using AgroVault
            </p>
            <div className="py-4">
              <p className="text-text-secondary">
                Your wallet is connected and your seed phrase has been verified.
                You can now access all features of the platform.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Render navigation buttons based on current step
  const renderNavButtons = () => {
    const isLastStep = currentStep === STEPS.COMPLETE;
    const isWalletConnectionStep = currentStep === STEPS.WALLET_CONNECTION;
    const isVerificationStep = currentStep === STEPS.VERIFY_SEED_PHRASE;
    
    return (
      <div className="flex justify-between pt-8">
        {currentStep > STEPS.WELCOME && (
          <button
            onClick={goToPreviousStep}
            className="px-4 py-2 border border-border rounded-lg hover:bg-background-light transition-colors"
            disabled={isVerifying}
          >
            Back
          </button>
        )}
        
        {currentStep < STEPS.COMPLETE && !isWalletConnectionStep && !isVerificationStep && (
          <button
            onClick={goToNextStep}
            className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Next
          </button>
        )}
        
        {isVerificationStep && (
          <button
            onClick={handleVerifySeedPhrase}
            className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            disabled={isVerifying || inputSeedPhrase.some(word => !word.trim())}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        )}
        
        {isLastStep && (
          <button
            onClick={finishOnboarding}
            className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </button>
        )}
      </div>
    );
  };
  
  // Progress indicator
  const renderProgressIndicator = () => {
    const totalSteps = Object.keys(STEPS).length / 2; // Divide by 2 because STEPS is an enum
    
    return (
      <div className="w-full py-4">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i}
              className={`h-2 w-2 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>
        <div className="w-full bg-border rounded-full h-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen w-full bg-background-dark flex flex-col">
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
          {renderProgressIndicator()}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-2xl">
              {renderStepContent()}
            </div>
          </div>
          {renderNavButtons()}
        </div>
      </div>
    </div>
  );

};

export default Onboarding;