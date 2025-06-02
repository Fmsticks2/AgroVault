import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAleoWallet } from '../../hooks/useAleoWallet';
import { detectWalletAvailability } from '../../services/aleoWalletService';
import { 
  CheckIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  CubeIcon,
  SparklesIcon,
  BanknotesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

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

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -50, scale: 0.95 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 247, 177, 0.3)',
      '0 0 40px rgba(0, 247, 177, 0.5)',
      '0 0 20px rgba(0, 247, 177, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
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
  const { connect, disconnect, isConnected, address, isConnecting, error, walletType } = useAleoWallet();
  
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
  const handleConnectWallet = async (selectedWalletType: 'LEO' | 'Puzzle') => {
    try {
      await connect(selectedWalletType);
      toast.success(`${selectedWalletType} Wallet connected successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to connect ${selectedWalletType} wallet: ${errorMessage}`);
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
          <motion.div 
            className="text-center space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
                variants={floatingVariants}
                animate="animate"
              />
              <motion.div 
                className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-lg"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '2s' }}
              />
            </div>

            <motion.div variants={itemVariants} className="relative z-10">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                Welcome to
              </motion.h1>
              <motion.h1 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent mt-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              >
                AgroVault
              </motion.h1>
            </motion.div>

            <motion.p 
              className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              The future of <span className="text-primary font-semibold">decentralized agricultural finance</span> built on Aleo's privacy-preserving blockchain
            </motion.p>

            <motion.div 
              className="py-12 relative"
              variants={itemVariants}
            >
              <motion.div
                className="relative mx-auto w-40 h-40"
                variants={glowVariants}
                animate="animate"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl" />
                <motion.img 
                  src="/logo.svg" 
                  alt="AgroVault Logo" 
                  className="relative z-10 w-full h-full drop-shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              variants={itemVariants}
            >
              <motion.div 
                className="p-6 bg-gradient-to-br from-background-light/50 to-background-light/20 backdrop-blur-sm rounded-2xl border border-primary/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ShieldCheckIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-sm text-text-secondary">Built on Aleo's zero-knowledge blockchain</p>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-gradient-to-br from-background-light/50 to-background-light/20 backdrop-blur-sm rounded-2xl border border-primary/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CubeIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Decentralized</h3>
                <p className="text-sm text-text-secondary">No central authority, full user control</p>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-gradient-to-br from-background-light/50 to-background-light/20 backdrop-blur-sm rounded-2xl border border-primary/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SparklesIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Innovative</h3>
                <p className="text-sm text-text-secondary">Cutting-edge DeFi for agriculture</p>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-text-secondary max-w-xl mx-auto"
              variants={itemVariants}
            >
              Let's get you set up with everything you need to start your journey in decentralized agricultural finance
            </motion.p>
          </motion.div>
        );
      
      case STEPS.ABOUT:
        return (
          <motion.div 
            className="space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,247,177,0.3) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            <motion.div variants={itemVariants} className="text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                About AgroVault
              </motion.h1>
              <motion.div 
                className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>

            <motion.div 
              className="max-w-3xl mx-auto text-center"
              variants={itemVariants}
            >
              <p className="text-xl text-text-secondary leading-relaxed">
                AgroVault is a <span className="text-primary font-semibold">revolutionary decentralized finance platform</span> built specifically for the agricultural sector. We bridge the gap between traditional farming and cutting-edge blockchain technology.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8"
              variants={containerVariants}
            >
              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-8 bg-gradient-to-br from-background-light/80 to-background-light/40 backdrop-blur-sm rounded-2xl border border-primary/30 h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl mr-4">
                      <GlobeAltIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    To democratize agricultural finance and create new opportunities for growth and sustainability in farming. We believe in empowering farmers with the tools they need to thrive in the digital economy.
                  </p>
                  <div className="mt-6 flex items-center text-primary text-sm font-medium">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Empowering Global Agriculture
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-8 bg-gradient-to-br from-background-light/80 to-background-light/40 backdrop-blur-sm rounded-2xl border border-primary/30 h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary/20 rounded-xl mr-4">
                      <ShieldCheckIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Built on Aleo</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Leveraging Aleo's revolutionary zero-knowledge blockchain technology for secure, private, and efficient transactions. Your data remains confidential while ensuring complete transparency.
                  </p>
                  <div className="mt-6 flex items-center text-primary text-sm font-medium">
                    <CubeIcon className="w-4 h-4 mr-2" />
                    Zero-Knowledge Privacy
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full border border-primary/30">
                <ChartBarIcon className="w-5 h-5 text-primary mr-2" />
                <span className="text-white font-medium">Connecting Farmers • Investors • Agricultural Businesses</span>
              </div>
            </motion.div>
          </motion.div>
        );
      
      case STEPS.FEATURES:
        return (
          <motion.div 
            className="space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                Platform Features
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.p 
                className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Discover the powerful tools that make AgroVault the future of agricultural finance
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8"
              variants={containerVariants}
            >
              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-primary/20 h-full">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <BanknotesIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Marketplace</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    Buy and sell agricultural assets and commodities in a fully decentralized marketplace with transparent pricing and secure transactions.
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                    Decentralized Trading
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-primary/20 h-full">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ChartBarIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Staking</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    Stake your tokens to earn competitive rewards while participating in platform governance and decision-making processes.
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                    Earn Rewards
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-primary/20 h-full">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CubeIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Lending</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    Access instant loans using your agricultural assets as collateral, or lend your funds to earn attractive interest rates.
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                    Collateralized Loans
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-primary/20 h-full">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <SparklesIcon className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Yield Farming</h3>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    Provide liquidity to earn additional rewards through sophisticated yield farming strategies and automated market making.
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                    Liquidity Mining
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                <GlobeAltIcon className="w-6 h-6 text-primary mr-3" />
                <span className="text-white font-semibold text-lg">All powered by Aleo's zero-knowledge technology</span>
              </div>
            </motion.div>
          </motion.div>
        );
      
      case STEPS.WALLET_CONNECTION:
        return (
          <motion.div 
            className="space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated background grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: '50px 50px'
              }} />
            </div>

            <motion.div variants={itemVariants} className="text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                Connect Your Wallet
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.p 
                className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Choose your preferred Aleo wallet to securely access the AgroVault ecosystem
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="space-y-6 max-w-2xl mx-auto"
              variants={containerVariants}
            >
              {!isConnected ? (
                <>
                  {/* LEO Wallet */}
                  <motion.div 
                    className="group relative"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative p-6 bg-gradient-to-br from-background-light/80 to-background-light/40 backdrop-blur-sm rounded-2xl border border-primary/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="text-white font-bold text-2xl">L</span>
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">LEO Wallet</h3>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${walletAvailability.LEO ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                              <p className={`text-sm font-medium ${
                                walletAvailability.LEO ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {walletAvailability.LEO ? 'Available & Ready' : 'Not Installed'}
                              </p>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              Official Aleo wallet with advanced features
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleConnectWallet('LEO')}
                          disabled={!walletAvailability.LEO || isConnecting}
                          className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isConnecting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Connecting...</span>
                            </div>
                          ) : (
                            'Connect'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Puzzle Wallet */}
                  <motion.div 
                    className="group relative"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative p-6 bg-gradient-to-br from-background-light/80 to-background-light/40 backdrop-blur-sm rounded-2xl border border-secondary/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center shadow-lg"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <span className="text-white font-bold text-2xl">P</span>
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">Puzzle Wallet</h3>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${walletAvailability.Puzzle ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                              <p className={`text-sm font-medium ${
                                walletAvailability.Puzzle ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {walletAvailability.Puzzle ? 'Available & Ready' : 'Not Available'}
                              </p>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              Community-driven Aleo wallet solution
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleConnectWallet('Puzzle')}
                          disabled={!walletAvailability.Puzzle || isConnecting}
                          className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-secondary/90 hover:to-secondary/70 transition-all duration-200 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isConnecting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Connecting...</span>
                            </div>
                          ) : (
                            'Connect'
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Wallet installation help */}
                  {(!walletAvailability.LEO || !walletAvailability.Puzzle) && (
                    <motion.div 
                      className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-sm"
                      variants={itemVariants}
                    >
                      <h4 className="font-semibold text-blue-400 mb-3">Need to install a wallet?</h4>
                      <div className="space-y-2 text-sm text-blue-300">
                        {!walletAvailability.LEO && (
                          <p>• <strong>LEO Wallet:</strong> Install from the Chrome Web Store for browser use</p>
                        )}
                        {!walletAvailability.Puzzle && (
                          <p>• <strong>Puzzle Wallet:</strong> Available as mobile app or web wallet</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm">
                          <p className="text-red-400 text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div 
                        className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckIcon className="w-5 h-5 text-green-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-green-400">Wallet Connected Successfully!</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background-light/30 rounded-xl">
                        <span className="text-sm font-medium text-text-secondary">Wallet Type:</span>
                        <span className="text-sm font-semibold text-white capitalize">{walletType}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background-light/30 rounded-xl">
                        <span className="text-sm font-medium text-text-secondary">Address:</span>
                        <span className="text-sm font-mono text-white truncate max-w-xs">
                          {address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={goToNextStep}
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Next Step
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      
      case STEPS.SEED_PHRASE:
        return (
          <motion.div 
            className="space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Security-themed background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-primary/5" />
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-500/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-yellow-500 to-white bg-clip-text text-transparent"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                Your Seed Phrase
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.p 
                className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Your unique 12-word recovery phrase - the key to your digital assets
              </motion.p>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="p-3 bg-red-500/20 rounded-xl"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 10px rgba(239, 68, 68, 0)',
                      '0 0 0 0 rgba(239, 68, 68, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShieldCheckIcon className="w-8 h-8 text-red-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Critical Security Notice</h3>
                  <p className="text-red-300 leading-relaxed">
                    Write down your seed phrase and store it safely offline. This is the <strong>only way</strong> to recover your wallet if you lose access. Never share it with anyone or store it digitally.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={containerVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-xl" />
              <div className="relative p-8 bg-gradient-to-br from-background-light/80 to-background-light/40 backdrop-blur-sm rounded-3xl border border-primary/20">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                >
                  {seedPhrase.map((word, index) => (
                    <motion.div 
                      key={index} 
                      className="group relative"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl blur group-hover:blur-md transition-all duration-300" />
                      <div className="relative p-4 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-xl border border-primary/30 text-center">
                        <span className="text-xs text-primary font-semibold mb-2 block">{index + 1}</span>
                        <div className="font-mono font-bold text-white text-lg">{word}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 rounded-2xl backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="p-3 bg-yellow-500/20 rounded-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <SparklesIcon className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Pro Tip</h3>
                  <p className="text-yellow-300 leading-relaxed mb-3">
                    Consider using the <strong>K33P app</strong> for secure seed phrase storage and backup. It provides military-grade encryption and distributed storage for maximum security.
                  </p>
                  <a 
                    href="https://k33p.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    Download K33P App →
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-background-light/60 to-background-light/30 rounded-2xl border border-primary/20 backdrop-blur-sm">
                <ShieldCheckIcon className="w-6 h-6 text-primary mr-3" />
                <span className="text-white font-semibold text-lg">Your security is our priority</span>
              </div>
            </motion.div>
          </motion.div>
        );
      
      case STEPS.VERIFY_SEED_PHRASE:
        return (
          <motion.div 
            className="space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Verification-themed background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/20 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <motion.div variants={itemVariants} className="text-center relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              >
                Verify Your Seed Phrase
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.p 
                className="text-lg text-text-secondary mt-6 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Enter your 12-word seed phrase to confirm you've saved it correctly
              </motion.p>
            </motion.div>

            <motion.div 
              className="p-6 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-2xl backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className="p-3 bg-primary/20 rounded-xl"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.4)',
                      '0 0 0 8px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <ShieldCheckIcon className="w-8 h-8 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">Security Verification</h3>
                  <p className="text-primary/90 leading-relaxed">
                    This step ensures you've correctly saved your seed phrase. Enter each word in the exact order you received them.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={containerVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background-light/20 to-background-light/10 rounded-3xl blur-xl" />
              <div className="relative p-8 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-3xl border border-primary/20">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                >
                  {inputSeedPhrase.map((word, index) => (
                    <motion.div 
                      key={index} 
                      className="relative group"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <span className="absolute -top-3 left-3 text-xs font-bold text-primary bg-background-light px-2 py-1 rounded-full border border-primary/30">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={word}
                          onChange={(e) => handleSeedPhraseInputChange(index, e.target.value)}
                          className="w-full p-4 pt-6 border-2 border-primary/30 rounded-xl bg-gradient-to-br from-background-light/80 to-background-light/60 backdrop-blur-sm text-center font-mono font-semibold text-white placeholder-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder={`Word ${index + 1}`}
                          disabled={isVerifying}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-background-light/60 to-background-light/30 rounded-2xl border border-primary/20 backdrop-blur-sm">
                <LockClosedIcon className="w-6 h-6 text-primary mr-3" />
                <span className="text-white font-semibold text-lg">
                  {isVerifying ? 'Verifying your seed phrase...' : 'Secure verification in progress'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      
      case STEPS.COMPLETE:
        return (
          <motion.div 
            className="text-center space-y-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Celebration background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 200)}%`,
                    y: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 200)}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>

            <motion.div 
              className="py-8 relative z-10"
              variants={itemVariants}
            >
              <motion.div
                className="relative mx-auto w-32 h-32 mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.3
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-primary/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-gradient-to-br from-green-500/20 to-primary/20 rounded-full flex items-center justify-center border-2 border-green-500/30 backdrop-blur-sm">
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-green-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    <motion.path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-primary to-white bg-clip-text text-transparent"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
              >
                Welcome to AgroVault!
              </motion.h1>
              
              <motion.div 
                className="w-32 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              />
            </motion.div>

            <motion.p 
              className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Your journey into <span className="text-primary font-semibold">decentralized agricultural finance</span> begins now
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8"
              variants={containerVariants}
            >
              <motion.div 
                className="group p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-green-500/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                  <CheckIcon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Wallet Connected</h3>
                <p className="text-sm text-text-secondary">Your Aleo wallet is securely linked</p>
              </motion.div>
              
              <motion.div 
                className="group p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-primary/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <ShieldCheckIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Seed Phrase Verified</h3>
                <p className="text-sm text-text-secondary">Your recovery phrase is confirmed</p>
              </motion.div>
              
              <motion.div 
                className="group p-6 bg-gradient-to-br from-background-light/60 to-background-light/30 backdrop-blur-sm rounded-2xl border border-secondary/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                  <SparklesIcon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-white mb-2">Ready to Explore</h3>
                <p className="text-sm text-text-secondary">All features are now available</p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-background-light/40 to-background-light/20 backdrop-blur-sm rounded-2xl border border-primary/20 p-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-white mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">Explore the marketplace for agricultural assets</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">Start staking your tokens for rewards</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">Access lending and borrowing features</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-text-secondary">Participate in yield farming opportunities</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="pt-4"
              variants={itemVariants}
            >
              <p className="text-text-secondary text-sm">
                Welcome to the future of agricultural finance. Your privacy is protected by Aleo's zero-knowledge technology.
              </p>
            </motion.div>
          </motion.div>
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
      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {currentStep > STEPS.WELCOME && (
          <motion.button
            onClick={goToPreviousStep}
            className="group relative px-6 py-3 border-2 border-primary/30 rounded-xl bg-gradient-to-r from-background-light/60 to-background-light/30 backdrop-blur-sm text-white font-medium transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isVerifying}
            whileHover={{ scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </div>
          </motion.button>
        )}
        
        {currentStep < STEPS.COMPLETE && !isWalletConnectionStep && !isVerificationStep && (
          <motion.button
            onClick={goToNextStep}
            className="group relative ml-auto px-8 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white font-semibold transition-all duration-300 hover:from-primary/90 hover:to-primary hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        )}
        
        {isVerificationStep && (
          <motion.button
            onClick={handleVerifySeedPhrase}
            className="group relative ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white font-semibold transition-all duration-300 hover:from-green-400 hover:to-green-500 hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            disabled={isVerifying || inputSeedPhrase.some(word => !word.trim())}
            whileHover={{ scale: isVerifying ? 1 : 1.02 }}
            whileTap={{ scale: isVerifying ? 1 : 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-2">
              {isVerifying ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Verify Seed Phrase</span>
                </>
              )}
            </div>
          </motion.button>
        )}
        
        {isLastStep && (
          <motion.button
            onClick={finishOnboarding}
            className="group relative ml-auto px-8 py-4 bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-xl text-white font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center space-x-3">
              <span>Enter AgroVault</span>
              <motion.div
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <SparklesIcon className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.button>
        )}
      </motion.div>
    );
  };
  
  // Progress indicator
  const renderProgressIndicator = () => {
    const totalSteps = Object.keys(STEPS).length / 2; // Divide by 2 because STEPS is an enum
    const stepNames = ['Welcome', 'About', 'Features', 'Wallet', 'Seed', 'Verify', 'Complete'];
    
    return (
      <motion.div 
        className="w-full py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Step indicators */}
        <div className="flex justify-between mb-4 relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-border via-primary/30 to-border transform -translate-y-1/2 z-0" />
          
          {Array.from({ length: totalSteps }, (_, i) => {
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            
            return (
              <motion.div 
                key={i}
                className="relative z-10 flex flex-col items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary to-primary/80 border-primary shadow-lg shadow-primary/30' 
                      : 'bg-background-light border-border'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={isCurrent ? {
                    boxShadow: [
                      '0 0 0 0 rgba(0, 247, 177, 0.4)',
                      '0 0 0 10px rgba(0, 247, 177, 0)',
                      '0 0 0 0 rgba(0, 247, 177, 0.4)'
                    ]
                  } : {}}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }
                  }}
                >
                  {isActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      {i === totalSteps - 1 ? (
                        <CheckIcon className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </motion.div>
                  ) : (
                    <div className="w-2 h-2 bg-border rounded-full" />
                  )}
                </motion.div>
                
                {/* Step label */}
                <motion.span 
                  className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-text-secondary'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  {stepNames[i]}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Progress bar */}
        <div className="relative">
          <div className="w-full bg-gradient-to-r from-border/50 via-border to-border/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-full relative"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.div>
          </div>
          
          {/* Progress percentage - moved to bottom right */}
          <motion.div 
            className="absolute top-4 right-0 text-xs font-semibold text-primary bg-background-light/80 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round((currentStep / (totalSteps - 1)) * 100)}%
          </motion.div>
        </div>
      </motion.div>
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