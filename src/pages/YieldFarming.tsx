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
    <div className="max-w-[2000px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Yield Farming</h1>
        <div className="w-full sm:w-auto">
          <div className="stat-card w-full sm:w-auto flex items-center space-x-3 py-3 px-4 rounded-lg">
            <ScaleIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-sm text-text-secondary">Total Value Locked</div>
              <div className="font-medium">${(108010000).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Farming Pools</h2>
            <div className="space-y-4">
              {mockData.pools.map((pool) => (
                <button
                  key={pool.id}
                  className={`w-full p-6 rounded-xl border transition-all hover:shadow-md ${pool.id === selectedPool.id ? 'border-primary bg-background-light shadow-sm' : 'border-border hover:border-primary'}`}
                  onClick={() => setSelectedPool(pool)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center text-lg font-medium shadow-sm">
                          {pool.token1.charAt(0)}
                        </div>
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center text-lg font-medium shadow-sm">
                          {pool.token2.charAt(0)}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-medium">{pool.name}</div>
                        <div className="text-sm text-text-secondary">{pool.rewards} Rewards</div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-end gap-4 sm:gap-1 ml-auto sm:ml-0">
                      <div className="text-success font-medium text-lg">{pool.apy}% APY</div>
                      <div className="text-sm text-text-secondary">
                        ${pool.tvl.toLocaleString()} TVL
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card mt-6 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Farming Positions</h2>
            <div className="text-center text-text-secondary py-8">
              No active farming positions
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 rounded-xl shadow-sm sticky top-4">
            <Tab.Group>
              <Tab.List className="flex space-x-2 mb-6">
                <Tab className={({ selected }) =>
                  `flex-1 py-3 text-sm font-medium rounded-lg focus:outline-none transition-colors ${selected ? 'bg-background-light text-primary' : 'text-text-secondary hover:text-text-primary'}`
                }>
                  Add Liquidity
                </Tab>
                <Tab className={({ selected }) =>
                  `flex-1 py-3 text-sm font-medium rounded-lg focus:outline-none transition-colors ${selected ? 'bg-background-light text-primary' : 'text-text-secondary hover:text-text-primary'}`
                }>
                  Remove
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">{selectedPool.token1} Amount</label>
                      <div className="relative rounded-lg overflow-hidden">
                        <input
                          type="number"
                          className="input w-full pr-20 py-3 bg-background-light"
                          placeholder="0.0"
                          value={token1Amount}
                          onChange={(e) => setToken1Amount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-primary text-sm bg-background rounded-md hover:bg-background-light transition-colors"
                          onClick={() => setToken1Amount(selectedPool.token1Balance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">{selectedPool.token2} Amount</label>
                      <div className="relative rounded-lg overflow-hidden">
                        <input
                          type="number"
                          className="input w-full pr-20 py-3 bg-background-light"
                          placeholder="0.0"
                          value={token2Amount}
                          onChange={(e) => setToken2Amount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-primary text-sm bg-background rounded-md hover:bg-background-light transition-colors"
                          onClick={() => setToken2Amount(selectedPool.token2Balance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-background-light rounded-lg">
                        <span className="text-sm font-medium text-text-secondary">Farming APY</span>
                        <span className="text-success font-medium">{selectedPool.apy}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background-light rounded-lg">
                        <span className="text-sm font-medium text-text-secondary">Daily Rewards</span>
                        <span className="font-medium">{selectedPool.rewardRate} {selectedPool.rewards}/day</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background-light rounded-lg">
                        <span className="text-sm font-medium text-text-secondary">Pool Share</span>
                        <span className="font-medium">0%</span>
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