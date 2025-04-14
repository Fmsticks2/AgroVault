import React from 'react';

const Rates = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-text-primary">Rates & Markets</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Rates Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Current Rates</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Lending APY</span>
              <span className="text-text-primary font-medium">0.00%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Borrowing APR</span>
              <span className="text-text-primary font-medium">0.00%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Staking Rewards</span>
              <span className="text-text-primary font-medium">0.00%</span>
            </div>
          </div>
        </div>

        {/* Market Statistics Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Market Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Value Locked</span>
              <span className="text-text-primary font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">24h Volume</span>
              <span className="text-text-primary font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Active Users</span>
              <span className="text-text-primary font-medium">0</span>
            </div>
          </div>
        </div>

        {/* Rate History Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Rate History</h2>
          <div className="space-y-4">
            <div className="h-40 flex items-center justify-center border border-border rounded-lg">
              <span className="text-text-secondary">Chart Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rates;