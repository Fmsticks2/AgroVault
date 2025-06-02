import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, UsersIcon, ArrowTrendingUpIcon, BanknotesIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      className="w-full min-w-0 space-y-4 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with enhanced styling */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <SparklesIcon className="h-8 w-8 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-sm text-text-secondary mt-1">Welcome to your AgroVault control center</p>
          </div>
        </div>
        <motion.div 
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowTrendingUpIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Live Data</span>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </motion.div>
      </motion.div>
      
      {/* Protocol Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 w-full"
        variants={itemVariants}
      >
        {mockData.protocolMetrics.map((metric, index) => (
          <motion.div 
            key={metric.name} 
            className="relative w-[calc(100%-1px)] stat-card flex flex-col p-2 md:p-4 rounded-lg overflow-hidden group"
            variants={cardHoverVariants}
            whileHover="hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(90deg, transparent, rgba(0, 247, 177, 0.2), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }} />
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <metric.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
                </motion.div>
                <span className="text-text-secondary text-[11px] xs:text-xs sm:text-sm lg:text-base truncate group-hover:text-white transition-colors duration-300">{metric.name}</span>
              </div>
              <motion.div 
                className="stat-value text-xs sm:text-sm md:text-base lg:text-lg text-start font-semibold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
              >
                {typeof metric.value === 'number' ? `$${metric.value.toLocaleString()}` : metric.value}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-3 md:gap-4"
        variants={itemVariants}
      >
        {/* Charts Section */}
        <div className="space-y-3 md:space-y-4 w-full">
          {/* Protocol Growth */}
          <motion.div 
            className="card p-3 py-3 !px-2 !-pl-0 sm:!px-10 space-y-6 md:p-4 rounded-lg relative overflow-hidden group"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <motion.h2 
                  className="text-sm md:text-base font-semibold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Protocol Growth
                </motion.h2>
                <motion.div 
                  className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ArrowTrendingUpIcon className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary font-medium">+12.5%</span>
                </motion.div>
              </div>
              
              <motion.div 
                className="h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.tvlData}>
                    <defs>
                      <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F7B1" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="#00F7B1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#00F7B1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00F7B1" />
                        <stop offset="50%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#00F7B1" />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#6F767E"
                      tick={{ fontSize: getResponsiveFontSize() }}
                      tickSize={8}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6F767E"
                      tick={{ 
                        fontSize: getResponsiveFontSize(),
                        // display: getAxisDisplay()
                      }}
                      tickSize={8}
                      width={getAxisDisplay() === 'none' ? 40 : 35}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ 
                        background: 'rgba(26, 29, 31, 0.95)', 
                        border: '1px solid #00F7B1',
                        borderRadius: '12px',
                        fontSize: getResponsiveFontSize(),
                        padding: '8px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
                      stroke="url(#strokeGradient)"
                      fill="url(#tvlGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#00F7B1', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#00F7B1', strokeWidth: 2, fill: '#1A1D1F' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>

          {/* Top Assets */}
          <motion.div 
            className="card py-3 !px-2 sm:!px-10 space-y-6 p-3 md:p-4 rounded-lg relative overflow-hidden group"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-sm md:text-base font-semibold mb-3 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Top Assets
              </motion.h2>
              <div className="flex flex-col gap-2">
                {mockData.topAssets.map((asset, index) => (
                  <motion.div 
                    key={asset.symbol} 
                    className="grid grid-cols-[auto,1fr,auto] sm:grid-cols-[auto,1fr,auto] items-center gap-3 p-2 hover:bg-background-light rounded-lg transition-colors group/item cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <motion.div 
                      className="hidden sm:flex h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary to-secondary items-center justify-center flex-shrink-0 relative overflow-hidden"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-xs sm:text-sm text-black font-bold relative z-10">{asset.symbol.charAt(0)}</span>
                      <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover/item:blur-md transition-all duration-300" />
                    </motion.div>
                    <div className="min-w-0 flex flex-col items-start">
                      <div className="font-medium text-sm xs:text-base truncate group-hover/item:text-white transition-colors duration-300">{asset.name}</div>
                      <div className="text-xs text-text-secondary group-hover/item:text-primary transition-colors duration-300">{asset.symbol}</div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <motion.div 
                        className="text-xs xs:text-base font-medium"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        {asset.price}
                      </motion.div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-text-secondary hidden xs:inline group-hover/item:text-primary transition-colors duration-300">{asset.marketCap}</span>
                        <motion.span 
                          className={`font-medium ${asset.change.startsWith('+') ? 'text-success' : 'text-text-secondary'}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          {asset.change}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="w-full">
          <motion.div 
            className="card py-3 !px-2 sm:!px-10 space-y-6 md:p-4 rounded-lg relative overflow-hidden group"
            variants={cardHoverVariants}
            whileHover="hover"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-sm md:text-lg font-semibold mb-3 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Recent Activity
              </motion.h2>
              <div className="flex flex-col gap-2 max-h-[400px] scrollbar-custom">
                {mockData.recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    className="grid grid-cols-[auto,1fr,auto] items-start gap-2 p-2 hover:bg-background-light rounded-lg transition-colors group/item cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <motion.div 
                      className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5 relative"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover/item:blur-md transition-all duration-300" />
                    </motion.div>
                    <div className="min-w-0 flex flex-col items-start">
                      <div className="font-medium text-sm md:text-base truncate group-hover/item:text-white transition-colors duration-300">{activity.type}</div>
                      <div className="text-xs text-text-secondary truncate group-hover/item:text-primary transition-colors duration-300">{activity.amount}</div>
                    </div>
                    <motion.div 
                      className="text-xs text-text-secondary whitespace-nowrap group-hover/item:text-primary transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {activity.time}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;