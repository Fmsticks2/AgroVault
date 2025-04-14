import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FarmingPool {
  id: number;
  name: string;
  stakingToken: string;
  rewardToken: string;
  totalStaked: string;
  apy: string;
  duration: string;
  status: 'active' | 'inactive';
}

const YieldFarmingAdmin = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState<FarmingPool[]>([
    {
      id: 1,
      name: 'AGRO-ETH LP',
      stakingToken: 'LP Token',
      rewardToken: 'AGRO',
      totalStaked: '1,000,000 LP',
      apy: '25%',
      duration: '90 days',
      status: 'active'
    },
    {
      id: 2,
      name: 'AGRO Staking',
      stakingToken: 'AGRO',
      rewardToken: 'AGRO',
      totalStaked: '5,000,000 AGRO',
      apy: '12%',
      duration: '180 days',
      status: 'active'
    }
  ]);

  // Check admin authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handlePoolUpdate = (id: number, key: keyof FarmingPool, value: string) => {
    setPools(prev =>
      prev.map(pool =>
        pool.id === id ? { ...pool, [key]: value } : pool
      )
    );
  };

  const handleAddPool = () => {
    const newPool: FarmingPool = {
      id: pools.length + 1,
      name: 'New Pool',
      stakingToken: '',
      rewardToken: 'AGRO',
      totalStaked: '0',
      apy: '0%',
      duration: '30 days',
      status: 'inactive'
    };
    setPools(prev => [...prev, newPool]);
  };

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Yield Farming Management</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Farming Pools */}
      <div className="bg-background p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Farming Pools</h2>
          <button
            onClick={handleAddPool}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add New Pool
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Pool Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Staking Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Reward Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Total Staked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">APY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pools.map(pool => (
                <tr key={pool.id}>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.name}
                      onChange={(e) => handlePoolUpdate(pool.id, 'name', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.stakingToken}
                      onChange={(e) => handlePoolUpdate(pool.id, 'stakingToken', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.rewardToken}
                      onChange={(e) => handlePoolUpdate(pool.id, 'rewardToken', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.totalStaked}
                      onChange={(e) => handlePoolUpdate(pool.id, 'totalStaked', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.apy}
                      onChange={(e) => handlePoolUpdate(pool.id, 'apy', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={pool.duration}
                      onChange={(e) => handlePoolUpdate(pool.id, 'duration', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-32"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={pool.status}
                      onChange={(e) => handlePoolUpdate(pool.id, 'status', e.target.value as 'active' | 'inactive')}
                      className="bg-background-light border border-border rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // Implement save changes functionality
            console.log('Saving pool changes:', pools);
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default YieldFarmingAdmin;