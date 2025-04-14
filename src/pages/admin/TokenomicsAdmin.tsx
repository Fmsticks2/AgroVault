import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TokenMetrics {
  totalSupply: string;
  circulatingSupply: string;
  stakingAPY: string;
  farmingAPY: string;
  treasuryBalance: string;
}

interface TokenAllocation {
  category: string;
  percentage: number;
  amount: string;
  locked: boolean;
  vestingPeriod?: string;
}

const TokenomicsAdmin = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<TokenMetrics>({
    totalSupply: '1,000,000,000 AGRO',
    circulatingSupply: '250,000,000 AGRO',
    stakingAPY: '12%',
    farmingAPY: '18%',
    treasuryBalance: '100,000,000 AGRO'
  });

  const [allocations, setAllocations] = useState<TokenAllocation[]>([
    {
      category: 'Team',
      percentage: 15,
      amount: '150,000,000 AGRO',
      locked: true,
      vestingPeriod: '2 years'
    },
    {
      category: 'Advisors',
      percentage: 5,
      amount: '50,000,000 AGRO',
      locked: true,
      vestingPeriod: '1 year'
    },
    {
      category: 'Community Rewards',
      percentage: 30,
      amount: '300,000,000 AGRO',
      locked: false
    },
    {
      category: 'Liquidity Pool',
      percentage: 20,
      amount: '200,000,000 AGRO',
      locked: true,
      vestingPeriod: '6 months'
    },
    {
      category: 'Treasury',
      percentage: 30,
      amount: '300,000,000 AGRO',
      locked: true,
      vestingPeriod: '3 years'
    }
  ]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchTokenomicsData = async () => {
      try {
        const [metricsResponse, allocationsResponse] = await Promise.all([
          adminService.getTokenMetrics(),
          adminService.getTokenAllocations()
        ]);
        setMetrics(metricsResponse);
        setAllocations(allocationsResponse);
      } catch (error) {
        toast.error('Failed to load tokenomics data');
        console.error('Error loading tokenomics data:', error);
      }
    };

    fetchTokenomicsData();
  }, [navigate]);

  const handleMetricUpdate = (key: keyof TokenMetrics, value: string) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleAllocationUpdate = (index: number, key: keyof TokenAllocation, value: any) => {
    setAllocations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Token Economics Management</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Token Metrics */}
      <div className="bg-background p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Token Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleMetricUpdate(key as keyof TokenMetrics, e.target.value)}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Token Allocation */}
      <div className="bg-background p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Token Allocation</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Vesting Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allocations.map((allocation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={allocation.category}
                      onChange={(e) => handleAllocationUpdate(index, 'category', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={allocation.percentage}
                      onChange={(e) => handleAllocationUpdate(index, 'percentage', parseInt(e.target.value))}
                      className="bg-background-light border border-border rounded px-2 py-1 w-24"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={allocation.amount}
                      onChange={(e) => handleAllocationUpdate(index, 'amount', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={allocation.locked ? 'locked' : 'unlocked'}
                      onChange={(e) => handleAllocationUpdate(index, 'locked', e.target.value === 'locked')}
                      className="bg-background-light border border-border rounded px-2 py-1"
                    >
                      <option value="locked">Locked</option>
                      <option value="unlocked">Unlocked</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={allocation.vestingPeriod || ''}
                      onChange={(e) => handleAllocationUpdate(index, 'vestingPeriod', e.target.value)}
                      className="bg-background-light border border-border rounded px-2 py-1 w-full"
                      placeholder="e.g., 1 year"
                    />
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
          onClick={async () => {
            try {
              await Promise.all([
                adminService.updateTokenMetrics(metrics),
                adminService.updateTokenAllocations(allocations)
              ]);
              toast.success('Changes saved successfully');
            } catch (error) {
              toast.error('Failed to save changes');
              console.error('Error saving changes:', error);
            }
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TokenomicsAdmin;