import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardCard {
  title: string;
  value: string | number;
  change?: string;
  path: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Mock dashboard data
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      path: '/admin/users'
    },
    {
      title: 'Active Loans',
      value: '456',
      change: '+5%',
      path: '/admin/lending'
    },
    {
      title: 'Total Staked',
      value: '789,012 AGRO',
      change: '+8%',
      path: '/admin/staking'
    },
    {
      title: 'Governance Proposals',
      value: '15',
      change: '+2',
      path: '/admin/governance'
    }
  ];

  // Check admin authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('isAdmin');
            navigate('/admin/login');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-background p-6 rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
          >
            <h3 className="text-lg font-medium text-text-secondary mb-2">{card.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold">{card.value}</span>
              {card.change && (
                <span className={`text-sm ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {card.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-background p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 bg-background-light rounded-lg border border-border hover:border-primary transition-colors text-left"
          >
            <h3 className="font-medium mb-2">User Management</h3>
            <p className="text-sm text-text-secondary">Manage user accounts and permissions</p>
          </button>

          <button
            onClick={() => navigate('/admin/tokenomics')}
            className="p-4 bg-background-light rounded-lg border border-border hover:border-primary transition-colors text-left"
          >
            <h3 className="font-medium mb-2">Token Economics</h3>
            <p className="text-sm text-text-secondary">Configure token distribution and parameters</p>
          </button>

          <button
            onClick={() => navigate('/admin/yield-farming')}
            className="p-4 bg-background-light rounded-lg border border-border hover:border-primary transition-colors text-left"
          >
            <h3 className="font-medium mb-2">Yield Farming</h3>
            <p className="text-sm text-text-secondary">Manage farming pools and rewards</p>
          </button>

          <button
            onClick={() => navigate('/admin/settings')}
            className="p-4 bg-background-light rounded-lg border border-border hover:border-primary transition-colors text-left"
          >
            <h3 className="font-medium mb-2">Platform Settings</h3>
            <p className="text-sm text-text-secondary">Configure global platform parameters</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;