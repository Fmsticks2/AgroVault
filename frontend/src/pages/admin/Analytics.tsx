import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUsers, FaCoins, FaExchangeAlt, FaChartLine } from 'react-icons/fa';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: string;
  stakingStats: {
    totalStaked: string;
    activeStakers: number;
    averageStakingPeriod: number;
  };
  yieldFarmingStats: {
    totalLocked: string;
    activeFarmers: number;
    averageYield: string;
  };
  dailyStats: Array<{
    date: string;
    transactions: number;
    volume: string;
    newUsers: number;
  }>;
}

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 1500,
    activeUsers: 850,
    totalTransactions: 12500,
    totalVolume: '2,500,000 AGRO',
    stakingStats: {
      totalStaked: '750,000 AGRO',
      activeStakers: 450,
      averageStakingPeriod: 90
    },
    yieldFarmingStats: {
      totalLocked: '500,000 AGRO',
      activeFarmers: 300,
      averageYield: '18%'
    },
    dailyStats: [
      {
        date: '2024-01-20',
        transactions: 150,
        volume: '25,000 AGRO',
        newUsers: 12
      },
      {
        date: '2024-01-19',
        transactions: 145,
        volume: '23,500 AGRO',
        newUsers: 15
      }
    ]
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        const response = await adminService.getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to load analytics data');
        console.error('Error loading analytics:', error);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) => (
    <div className="bg-background p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-secondary">{title}</h3>
        <Icon className={`text-2xl ${color}`} />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={FaUsers}
          color="text-blue-500"
        />
        <StatCard
          title="Total Volume"
          value={analytics.totalVolume}
          icon={FaCoins}
          color="text-yellow-500"
        />
        <StatCard
          title="Total Transactions"
          value={analytics.totalTransactions}
          icon={FaExchangeAlt}
          color="text-green-500"
        />
        <StatCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={FaChartLine}
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staking Statistics */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Staking Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Staked:</span>
              <span className="font-medium">{analytics.stakingStats.totalStaked}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Active Stakers:</span>
              <span className="font-medium">{analytics.stakingStats.activeStakers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Average Staking Period:</span>
              <span className="font-medium">{analytics.stakingStats.averageStakingPeriod} days</span>
            </div>
          </div>
        </div>

        {/* Yield Farming Statistics */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Yield Farming Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Locked:</span>
              <span className="font-medium">{analytics.yieldFarmingStats.totalLocked}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Active Farmers:</span>
              <span className="font-medium">{analytics.yieldFarmingStats.activeFarmers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Average Yield:</span>
              <span className="font-medium">{analytics.yieldFarmingStats.averageYield}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Statistics */}
      <div className="bg-background p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Daily Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">New Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analytics.dailyStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{stat.date}</td>
                  <td className="px-6 py-4">{stat.transactions}</td>
                  <td className="px-6 py-4">{stat.volume}</td>
                  <td className="px-6 py-4">{stat.newUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;