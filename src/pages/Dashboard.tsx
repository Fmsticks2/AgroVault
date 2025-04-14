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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.protocolMetrics.map((metric) => (
          <div key={metric.name} className="stat-card flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <metric.icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-text-secondary text-left">{metric.name}</span>
            </div>
            <div className="stat-value text-left">
              {typeof metric.value === 'number' ? `$${metric.value.toLocaleString()}` : metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Protocol Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.tvlData}>
                  <defs>
                    <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F7B1" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#00F7B1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6F767E" />
                  <YAxis stroke="#6F767E" />
                  <Tooltip
                    contentStyle={{ background: '#1A1D1F', border: '1px solid #2A2F34' }}
                    itemStyle={{ color: '#FFFFFF' }}
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

          <div className="card mt-6">
            <h2 className="text-lg font-semibold mb-4">Top Assets</h2>
            <div className="space-y-4">
              {mockData.topAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 hover:bg-background-light rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-background-light flex items-center justify-center flex-shrink-0">
                      {asset.symbol.charAt(0)}
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-text-secondary">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div>{asset.price}</div>
                    <div className="text-sm flex items-center space-x-2">
                      <span className="text-text-secondary">{asset.marketCap}</span>
                      <span className={`${asset.change.startsWith('+') ? 'text-success' : 'text-text-secondary'}`}>
                        {asset.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
              {mockData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-background-light rounded-lg transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{activity.type}</div>
                      <div className="text-sm text-text-secondary truncate">{activity.amount}</div>
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary flex-shrink-0 ml-4">{activity.time}</div>
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