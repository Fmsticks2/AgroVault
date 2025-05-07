import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CurrencyDollarIcon, UsersIcon, ArrowTrendingUpIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const mockData = {
  tvlData: [
    { date: 'Jan', value: 150000 },
    { date: 'Feb', value: 180000 },
    { date: 'Mar', value: 210000 },
    { date: 'Apr', value: 250502 },
  ],
  protocolMetrics: [
    { name: 'Total Value Locked', value: 250502938, icon: CurrencyDollarIcon },
    { name: 'Daily Active Users', value: 3457, icon: UsersIcon },
    { name: 'Total Borrowed', value: 115440000, icon: BanknotesIcon },
    { name: 'Total Yield Generated', value: 8250000, icon: ArrowTrendingUpIcon },
  ],
  topAssets: [
    { name: 'AGRI', symbol: 'AGRI', price: '$2.19', marketCap: '$46B', change: '+5.2%' },
    { name: 'Ethereum', symbol: 'ETH', price: '$2,028.84', marketCap: '$244B', change: '+2.8%' },
    { name: 'USD Coin', symbol: 'USDC', price: '$1.00', marketCap: '$42B', change: '0.0%' },
    { name: 'Wrapped BTC', symbol: 'WBTC', price: '$64,102.03', marketCap: '$12B', change: '+3.5%' },
  ],
  recentActivity: [
    { type: 'Stake', amount: '1,000 AGRI', time: '5 minutes ago' },
    { type: 'Supply', amount: '2.5 ETH', time: '15 minutes ago' },
    { type: 'Farm', amount: '500 AGRI-ETH LP', time: '1 hour ago' },
    { type: 'Vote', amount: 'Proposal #1', time: '2 hours ago' },
    { type: 'Borrow', amount: '5,000 USDC', time: '3 hours ago' },
    { type: 'Harvest', amount: '250 AGRI', time: '4 hours ago' },
    { type: 'Supply', amount: '10,000 USDC', time: '5 hours ago' },
    { type: 'Stake', amount: '2,500 AGRI', time: '6 hours ago' },
  ],
};

const Dashboard = () => {
  const getResponsiveFontSize = () => {
    return window.innerWidth <= 640 ? 10 : 12;
  };

  const getAxisDisplay = () => {
    return window.innerWidth <= 480 ? 'none' : 'auto';
  };

  return (
    <div className="w-full min-w-0 space-y-4 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Dashboard</h2>
      </div>
      
      {/* Protocol Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 w-full">
        {mockData.protocolMetrics.map((metric) => (
          <div key={metric.name} className="w-[calc(100%-1px)] stat-card flex flex-col p-2 md:p-4 rounded-lg">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <metric.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              <span className="text-text-secondary text-[11px] xs:text-xs sm:text-sm lg:text-base truncate">{metric.name}</span>
            </div>
            <div className="stat-value text-xs sm:text-sm md:text-base lg:text-lg text-start font-semibold">
              {typeof metric.value === 'number' ? `$${metric.value.toLocaleString()}` : metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-3 md:gap-4">
        {/* Charts Section */}
        <div className="space-y-3 md:space-y-4 w-full">
          {/* Protocol Growth */}
          <div className="card p-3 py-3 !px-2 !-pl-0 sm:!px-10 space-y-6 md:p-4 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold mb-3">Protocol Growth</h2>
            <div className="h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.tvlData}>
                  <defs>
                    <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F7B1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#00F7B1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#6F767E"
                    tick={{ fontSize: getResponsiveFontSize() }}
                    tickSize={8}
                  />
                  <YAxis 
                    stroke="#6F767E"
                    tick={{ 
                      fontSize: getResponsiveFontSize(),
                      // display: getAxisDisplay()
                    }}
                    tickSize={8}
                    width={getAxisDisplay() === 'none' ? 40 : 35}
                  />
                  <Tooltip
                    contentStyle={{ 
                      background: '#1A1D1F', 
                      border: '1px solid #2A2F34',
                      fontSize: getResponsiveFontSize(),
                      padding: '8px'
                    }}
                    itemStyle={{ 
                      color: '#FFFFFF',
                      fontSize: getResponsiveFontSize()
                    }}
                    labelStyle={{
                      fontSize: getResponsiveFontSize()
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00F7B1"
                    fill="url(#tvlGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Assets */}
          <div className="card py-3 !px-2 sm:!px-10 space-y-6 p-3 md:p-4 rounded-lg">
            <h2 className="text-sm md:text-base font-semibold mb-3">Top Assets</h2>
            <div className="flex flex-col gap-2">
              {mockData.topAssets.map((asset) => (
                <div key={asset.symbol} 
                     className="grid grid-cols-[auto,1fr,auto] sm:grid-cols-[auto,1fr,auto] items-center gap-3 p-2 hover:bg-background-light rounded-lg transition-colors">
                  <div className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background-light items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm">{asset.symbol.charAt(0)}</span>
                  </div>
                  <div className="min-w-0 flex flex-col items-start">
                    <div className="font-medium text-sm xs:text-base truncate">{asset.name}</div>
                    <div className="text-xs text-text-secondary">{asset.symbol}</div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="text-xs xs:text-base font-medium">{asset.price}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-text-secondary hidden xs:inline">{asset.marketCap}</span>
                      <span className={asset.change.startsWith('+') ? 'text-success' : 'text-text-secondary'}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="w-full">
          <div className="card py-3 !px-2 sm:!px-10 space-y-6 md:p-4 rounded-lg">
            <h2 className="text-sm md:text-lg font-semibold mb-3">Recent Activity</h2>
            <div className="flex flex-col gap-2 max-h-[400px]scrollbar-custom">
              {mockData.recentActivity.map((activity, index) => (
                <div key={index} className="grid grid-cols-[auto,1fr,auto] items-start gap-2 p-2 hover:bg-background-light rounded-lg transition-colors">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  <div className="min-w-0 flex flex-col items-start">
                    <div className="font-medium text-sm md:text-base truncate">{activity.type}</div>
                    <div className="text-xs text-text-secondary truncate">{activity.amount}</div>
                  </div>
                  <div className="text-xs text-text-secondary whitespace-nowrap">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;