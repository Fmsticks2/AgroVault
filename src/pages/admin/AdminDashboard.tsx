import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog, FaChartLine, FaUsers, FaCoins, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const menuItems = [
    {
      title: 'Platform Settings',
      icon: <FaCog className="text-2xl" />,
      description: 'Manage platform configurations and security settings',
      path: '/admin/settings'
    },
    {
      title: 'Tokenomics',
      icon: <FaCoins className="text-2xl" />,
      description: 'Configure token distribution and economics',
      path: '/admin/tokenomics'
    },
    {
      title: 'User Management',
      icon: <FaUsers className="text-2xl" />,
      description: 'Manage user accounts and permissions',
      path: '/admin/users'
    },
    {
      title: 'Transaction Monitor',
      icon: <FaExchangeAlt className="text-2xl" />,
      description: 'Monitor and manage platform transactions',
      path: '/admin/transactions'
    },
    {
      title: 'Security',
      icon: <FaShieldAlt className="text-2xl" />,
      description: 'Manage platform security settings and logs',
      path: '/admin/security'
    },
    {
      title: 'Analytics',
      icon: <FaChartLine className="text-2xl" />,
      description: 'View platform statistics and analytics',
      path: '/admin/analytics'
    }
  ];

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('isAdmin');
            navigate('/');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="bg-background p-6 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-primary">{item.icon}</div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </div>
            <p className="text-text-secondary">{item.description}</p>
          </div>
        ))}      
      </div>
    </div>
  );
};

export default AdminDashboard;