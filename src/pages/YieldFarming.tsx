import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowPathIcon, GiftIcon, ScaleIcon } from '@heroicons/react/24/outline';

const mockData = {
  pools: [
    {
      id: 1,
      name: 'AGRI-ETH',
      token1: 'AGRI',
      token2: 'ETH',
      apy: 45.8,
      tvl: 62730000,
      rewards: 'AGRI',
      rewardRate: 250,
      userLiquidity: 0,
      token1Balance: 1000,
      token2Balance: 2.5,
    },
    {
      id: 2,
      name: 'AGRI-USDC',
      token1: 'AGRI',
      token2: 'USDC',
      apy: 38.2,
      tvl: 45280000,
      rewards: 'AGRI',
      rewardRate: 200,
      userLiquidity: 0,
      token1Balance: 1000,
      token2Balance: 5000,
    },
  ],
};

const YieldFarming = () => {
  const [selectedPool, setSelectedPool] = useState(mockData.pools[0]);
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');

  const handleAddLiquidity = () => {
    console.log(`Adding liquidity: ${token1Amount} ${selectedPool.token1} and ${token2Amount} ${selectedPool.token2}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Yield Farming</h1>
        <div className="flex items-center space-x-4">
          <div className="stat-card flex items-center space-x-3 py-2 px-4">
            <ScaleIcon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-text-secondary">Total Value Locked</div>
              <div className="font-medium">${(108010000).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Farming Pools</h2>
            <div className="space-y-4">
              {mockData.pools.map((pool) => (
                <button
                  key={pool.id}
                  className={`w-full p-4 rounded-lg border transition-colors ${pool.id === selectedPool.id ? 'border-primary bg-background-light' : 'border-border hover:border-primary'}`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                          {pool.token1.charAt(0)}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                          {pool.token2.charAt(0)}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{pool.name}</div>
                        <div className="text-sm text-text-secondary">{pool.rewards} Rewards</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-success font-medium">{pool.apy}% APY</div>
                      <div className="text-sm text-text-secondary">
                        ${pool.tvl.toLocaleString()} TVL
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="text-lg font-semibold mb-4">Your Farming Positions</h2>
            <div className="text-center text-text-secondary py-8">
              No active farming positions
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <Tab.Group>
              <Tab.List className="flex space-x-2 mb-6">
                <Tab className={({ selected }) =>
                  `flex-1 py-2 text-sm font-medium rounded-lg focus:outline-none ${selected ? 'bg-background-light text-primary' : 'text-text-secondary hover:text-text-primary'}`
                }>
                  Add Liquidity
                </Tab>
                <Tab className={({ selected }) =>
                  `flex-1 py-2 text-sm font-medium rounded-lg focus:outline-none ${selected ? 'bg-background-light text-primary' : 'text-text-secondary hover:text-text-primary'}`
                }>
                  Remove
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">{selectedPool.token1} Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="input w-full pr-16"
                          placeholder="0.0"
                          value={token1Amount}
                          onChange={(e) => setToken1Amount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                          onClick={() => setToken1Amount(selectedPool.token1Balance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-secondary mb-2">{selectedPool.token2} Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="input w-full pr-16"
                          placeholder="0.0"
                          value={token2Amount}
                          onChange={(e) => setToken2Amount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                          onClick={() => setToken2Amount(selectedPool.token2Balance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Farming APY</span>
                        <span className="text-success">{selectedPool.apy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Daily Rewards</span>
                        <span>{selectedPool.rewardRate} {selectedPool.rewards}/day</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Pool Share</span>
                        <span>0%</span>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full mt-4"
                      onClick={handleAddLiquidity}
                      disabled={!token1Amount || !token2Amount}
                    >
                      Add Liquidity
                    </button>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="text-center text-text-secondary py-8">
                    No liquidity to remove
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ArrowPathIcon className="h-4 w-4" />
              <span>Rewards are auto-compounded daily</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <GiftIcon className="h-4 w-4" />
              <span>Earn additional rewards with longer locks</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ScaleIcon className="h-4 w-4" />
              <span>Provide liquidity to earn trading fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldFarming;