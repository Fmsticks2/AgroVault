import { useState } from 'react';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAleoWallet } from '../hooks/useAleoWallet';
import { toast } from 'react-toastify';

const mockData = {
  stakingPools: [
    {
      id: 1,
      name: 'AGRI Staking',
      token: 'AGRI',
      apy: 12.5,
      totalStaked: 102450000,
      minStake: 100,
      lockPeriod: 30,
    },
    {
      id: 2,
      name: 'AGRI-ETH LP',
      token: 'LP',
      apy: 25.8,
      totalStaked: 45320000,
      minStake: 50,
      lockPeriod: 60,
    },
  ],
};

const Staking = () => {
  const [selectedPool, setSelectedPool] = useState(mockData.stakingPools[0]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  
  // Use our custom hook for wallet functionality
  const {
    address,
    isConnected,
    signTransaction,
    sendTransaction
  } = useAleoWallet();

  const handleStake = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) < selectedPool.minStake) {
      toast.error(`Minimum stake amount is ${selectedPool.minStake} ${selectedPool.token}`);
      return;
    }
    
    try {
      setIsStaking(true);
      
      // Create transaction object for the smart contract
      const transaction = {
        programId: "marketplace.aleo",
        functionName: "stake",
        inputs: [
          stakeAmount,                // amount to stake
          selectedPool.id.toString(), // pool ID
          selectedPool.lockPeriod.toString() // lock period in days
        ]
      };
      
      // Sign the transaction
      const signedTx = await signTransaction(transaction);
      
      // Send the transaction
      const txId = await sendTransaction(signedTx);
      
      console.log(`Staking transaction submitted: ${txId}`);
      toast.success(`Staking ${stakeAmount} ${selectedPool.token}! Transaction ID: ${txId.slice(0, 10)}...`);
      setStakeAmount('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Staking error:', error);
      toast.error(`Staking failed: ${errorMessage}`);
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="max-w-[2000px] mx-auto space-y-6w-full min-w-0 space-y-4 md:space-y-6 py-6 pt-20 pl-20 md:pl-24 lg:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Staking</h1>
        <div className="flex items-center space-x-4">
          <div className="stat-card flex items-center space-x-3 py-2 px-4">
            <CurrencyDollarIcon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-text-secondary">Total Staked</div>
              <div className="font-medium">${(147770000).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Staking Pools</h2>
            <div className="space-y-4">
              {mockData.stakingPools.map((pool) => (
                <button
                  key={pool.id}
                  className={`w-full p-4 rounded-lg border transition-colors ${pool.id === selectedPool.id ? 'border-primary bg-background-light' : 'border-border hover:border-primary'}`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                        {pool.token.charAt(0)}
                      </div>
                      <div className="flex flex-col items-start">
                        <div className="font-medium">{pool.name}</div>
                        <div className="text-sm text-text-secondary">{pool.token}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-success font-medium">{pool.apy}% APY</div>
                      <div className="text-sm text-text-secondary">
                        ${(pool.totalStaked).toLocaleString()} TVL
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Your Positions</h2>
            <div className="text-center text-text-secondary py-8">
              No active staking positions
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Stake {selectedPool.token}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  className="input w-full pr-16"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                  onClick={() => setStakeAmount('100')}
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Min. Stake</span>
                <span>{selectedPool.minStake} {selectedPool.token}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Lock Period</span>
                <span>{selectedPool.lockPeriod} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">APY</span>
                <span className="text-success">{selectedPool.apy}%</span>
              </div>
            </div>

            <button
              className="btn-primary w-full mt-4"
              onClick={handleStake}
              disabled={!stakeAmount || isStaking || !isConnected}
            >
              {!isConnected ? 'Connect Wallet First' : 
               isStaking ? 'Processing...' : 
               `Stake ${selectedPool.token}`}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>Higher APY for longer lock periods</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ClockIcon className="h-4 w-4" />
              <span>Rewards are distributed daily</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;