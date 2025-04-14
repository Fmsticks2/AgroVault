import React from 'react';

const Operations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-text-primary">Operations</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Transaction History Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Transaction History</h2>
          <div className="space-y-4">
            {/* Add transaction history items here */}
            <p className="text-text-secondary">No transactions yet</p>
          </div>
        </div>

        {/* Active Operations Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Active Operations</h2>
          <div className="space-y-4">
            {/* Add active operations here */}
            <p className="text-text-secondary">No active operations</p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full btn-primary py-2 px-4 rounded-lg">
              New Transaction
            </button>
            <button className="w-full btn-secondary py-2 px-4 rounded-lg">
              View All Operations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;