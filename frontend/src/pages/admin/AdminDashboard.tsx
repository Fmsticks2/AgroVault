import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCog, FaChartLine, FaUsers, FaCoins, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { 
  ShieldCheckIcon, 
  CogIcon, 
  UsersIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  const menuItems = [
    {
      title: 'Platform Settings',
      icon: CogIcon,
      description: 'Manage platform configurations and security settings',
      path: '/admin/settings',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Tokenomics',
      icon: CurrencyDollarIcon,
      description: 'Configure token distribution and economics',
      path: '/admin/tokenomics',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'User Management',
      icon: UsersIcon,
      description: 'Manage user accounts and permissions',
      path: '/admin/users',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Transaction Monitor',
      icon: CommandLineIcon,
      description: 'Monitor and manage platform transactions',
      path: '/admin/transactions',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Security',
      icon: ShieldCheckIcon,
      description: 'Manage platform security settings and logs',
      path: '/admin/security',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Analytics',
      icon: ChartBarIcon,
      description: 'View platform statistics and analytics',
      path: '/admin/analytics',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-500/10'
    }
  ];

  return (
    <motion.div 
      className="max-w-[2000px] mx-auto p-6 space-y-6 min-h-screen bg-gradient-to-br from-background via-background to-background-light"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SparklesIcon className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-text-secondary mt-1">Manage your AgroVault platform</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => {
            localStorage.removeItem('isAdmin');
            navigate('/');
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </motion.div>

      {/* Admin Menu Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="relative bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary cursor-pointer transition-all duration-300 overflow-hidden group"
              variants={cardHoverVariants}
              whileHover="hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 247, 177, 0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite'
              }} />
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} opacity-60`} />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <motion.div 
                    className={`p-3 rounded-xl ${item.bgColor} relative overflow-hidden`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className={`h-6 w-6 bg-gradient-to-r ${item.color} bg-clip-text text-transparent relative z-10`} />
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300`} />
                  </motion.div>
                  <motion.h2 
                    className="text-xl font-semibold group-hover:text-white transition-colors duration-300"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {item.title}
                  </motion.h2>
                </div>
                
                <motion.p 
                  className="text-text-secondary group-hover:text-gray-300 transition-colors duration-300 leading-relaxed"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.description}
                </motion.p>
                
                {/* Hover arrow indicator */}
                <motion.div 
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}      
      </motion.div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;