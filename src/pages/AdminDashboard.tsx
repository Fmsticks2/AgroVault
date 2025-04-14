import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartPieIcon, UsersIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface AdminStats {
  totalUsers: number;
  totalStaked: number;
  activeProposals: number;
  tvl: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1250,
    totalStaked: 2500000,
    activeProposals: 3,
    tvl: 5000000
  });

  useEffect(() => {
    // Check admin authentication
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="max-w-[2000px] mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary">Total Users</p>
              <h3 className="text-2xl font-semibold">{stats.totalUsers}</h3>
            </div>
            <UsersIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary">Total Staked</p>
              <h3 className="text-2xl font-semibold">{stats.totalStaked.toLocaleString()} AGRI</h3>
            </div>
            <ChartPieIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary">Active Proposals</p>
              <h3 className="text-2xl font-semibold">{stats.activeProposals}</h3>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary">Total Value Locked</p>
              <h3 className="text-2xl font-semibold">${stats.tvl.toLocaleString()}</h3>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              View All Users
            </button>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Manage Permissions
            </button>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Staking Parameters
            </button>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Yield Farming Settings
            </button>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Governance</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Manage Proposals
            </button>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Voting Parameters
            </button>
          </div>
        </div>

        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              View Reports
            </button>
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;