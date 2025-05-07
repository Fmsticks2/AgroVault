import { CurrencyDollarIcon, ChartPieIcon, ArrowTrendingUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Tokenomics = () => {
  const tokenDistribution = [
    { category: 'Community Rewards', percentage: 30, description: 'Distributed to platform users through yield farming and staking' },
    { category: 'Team & Advisors', percentage: 15, description: 'Vested over 3 years with a 1-year cliff' },
    { category: 'Development Fund', percentage: 20, description: 'Platform development, technical upgrades, and innovation' },
    { category: 'Treasury', percentage: 15, description: 'Protocol-owned liquidity and strategic investments' },
    { category: 'Ecosystem Growth', percentage: 10, description: 'Partnerships, marketing, and community initiatives' },
    { category: 'Initial Sale', percentage: 10, description: 'Public token sale and initial liquidity' },
  ];

  const tokenUtility = [
    { title: 'Governance', description: 'Vote on protocol decisions and parameter adjustments' },
    { title: 'Staking', description: 'Earn passive rewards by staking AGRI tokens' },
    { title: 'Fee Discounts', description: 'Reduced platform fees for token holders' },
    { title: 'Yield Farming', description: 'Participate in liquidity mining programs' },
  ];

  return (
    <div className="max-w-[2000px] mx-auto space-y-8 pb-8 w-full min-w-0 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tokenomics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ChartPieIcon className="h-6 w-6 text-primary" />
              Token Distribution
            </h2>
            <div className="space-y-4">
              {tokenDistribution.map((item) => (
                <div key={item.category} className="p-4 bg-background-light rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-primary font-medium">{item.percentage}%</span>
                  </div>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-6 w-6 text-primary" />
              Token Utility
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokenUtility.map((item) => (
                <div key={item.title} className="p-4 bg-background-light rounded-lg">
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="h-6 w-6 text-primary" />
              Token Metrics
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Token Name</div>
                <div className="text-xl font-semibold">AGRO</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Total Supply</div>
                <div className="text-xl font-semibold">100,000,000 AGRI</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Initial Circulating Supply</div>
                <div className="text-xl font-semibold">25,000,000 AGRI</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Initial Market Cap</div>
                <div className="text-xl font-semibold">$25,000,000</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="h-6 w-6 text-primary" />
              Token Security
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Smart Contract Audit</h3>
                <p className="text-sm text-text-secondary">Token contract audited by leading security firms ensuring maximum safety</p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Vesting Schedule</h3>
                <p className="text-sm text-text-secondary">Strategic vesting periods to ensure long-term stability</p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Liquidity Lock</h3>
                <p className="text-sm text-text-secondary">Initial liquidity locked for 2 years to protect token holders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokenomics;