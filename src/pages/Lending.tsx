import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ArrowDownIcon, ArrowUpIcon, ShieldCheckIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const mockData = {
  markets: [
    {
      token: 'AGRI',
      supplyApy: 3.2,
      borrowApy: 5.8,
      totalSupplied: 85320000,
      totalBorrowed: 65240000,
      walletBalance: 1000,
      collateralFactor: 0.75,
    },
    {
      token: 'ETH',
      supplyApy: 2.1,
      borrowApy: 4.2,
      totalSupplied: 42150000,
      totalBorrowed: 31280000,
      walletBalance: 2.5,
      collateralFactor: 0.8,
    },
    {
      token: 'USDC',
      supplyApy: 4.5,
      borrowApy: 6.9,
      totalSupplied: 25480000,
      totalBorrowed: 18920000,
      walletBalance: 5000,
      collateralFactor: 0.85,
    },
  ],
};

const Lending = () => {
  const [selectedMarket, setSelectedMarket] = useState(mockData.markets[0]);
  const [amount, setAmount] = useState('');

  const handleAction = (action: 'supply' | 'borrow') => {
    console.log(`${action === 'supply' ? 'Supplying' : 'Borrowing'} ${amount} ${selectedMarket.token}`);
  };

  return (
    <div className="space-y-6 w-full min-w-0 md:space-y-6 py-6 pt-20 pl-20 md:pl-24 lg:px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Lending</h1>
        <div className="flex items-center space-x-4">
          <div className="stat-card flex items-center space-x-3 py-2 px-4">
            <BanknotesIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex flex-col items-start">
              <div className="text-sm text-text-secondary">Total Market Size</div>
              <div className="font-medium">${(152950000).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Lending Markets</h2>
            <div className="overflow-x-auto scrollbar-custom">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-text-secondary text-sm">
                    <th className="text-left pb-4 whitespace-nowrap">Asset</th>
                    <th className="text-right pb-4 whitespace-nowrap px-4">Supply APY</th>
                    <th className="text-right pb-4 whitespace-nowrap px-4">Borrow APY</th>
                    <th className="text-right pb-4 whitespace-nowrap px-4">Total Supplied</th>
                    <th className="text-right pb-4 whitespace-nowrap px-4">Total Borrowed</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.markets.map((market) => (
                    <tr
                      key={market.token}
                      className="cursor-pointer hover:bg-background-light transition-colors"
                      onClick={() => setSelectedMarket(market)}
                    >
                      <td className="bg-background-light rounded-l-lg p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                            {market.token.charAt(0)}
                          </div>
                          <span>{market.token}</span>
                        </div>
                      </td>
                      <td className="bg-background-light p-4 text-right text-success whitespace-nowrap">
                        {market.supplyApy}%
                      </td>
                      <td className="bg-background-light p-4 text-right text-error whitespace-nowrap">
                        {market.borrowApy}%
                      </td>
                      <td className="bg-background-light p-4 text-right whitespace-nowrap">
                        ${market.totalSupplied.toLocaleString()}
                      </td>
                      <td className="bg-background-light rounded-r-lg p-4 text-right whitespace-nowrap">
                        ${market.totalBorrowed.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  Supply
                </Tab>
                <Tab className={({ selected }) =>
                  `flex-1 py-2 text-sm font-medium rounded-lg focus:outline-none ${selected ? 'bg-background-light text-primary' : 'text-text-secondary hover:text-text-primary'}`
                }>
                  Borrow
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Amount to Supply</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="input w-full pr-16"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                          onClick={() => setAmount(selectedMarket.walletBalance.toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Supply APY</span>
                        <span className="text-success">{selectedMarket.supplyApy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Wallet Balance</span>
                        <span>{selectedMarket.walletBalance} {selectedMarket.token}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Collateral Factor</span>
                        <span>{selectedMarket.collateralFactor * 100}%</span>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full mt-4"
                      onClick={() => handleAction('supply')}
                      disabled={!amount}
                    >
                      Supply {selectedMarket.token}
                    </button>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">Amount to Borrow</label>
                      <div className="relative">
                        <input
                          type="number"
                          className="input w-full pr-16"
                          placeholder="0.0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                          onClick={() => setAmount((selectedMarket.totalSupplied * 0.75).toString())}
                        >
                          MAX
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Borrow APY</span>
                        <span className="text-error">{selectedMarket.borrowApy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Available to Borrow</span>
                        <span>{(selectedMarket.totalSupplied * 0.75).toFixed(2)} {selectedMarket.token}</span>
                      </div>
                    </div>

                    <button
                      className="btn-primary w-full mt-4"
                      onClick={() => handleAction('borrow')}
                      disabled={!amount}
                    >
                      Borrow {selectedMarket.token}
                    </button>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="card space-y-3">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>All lending pools are audited and secured</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ArrowUpIcon className="h-4 w-4" />
              <span>Supply assets to earn interest</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ArrowDownIcon className="h-4 w-4" />
              <span>Borrow against your supplied collateral</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lending;