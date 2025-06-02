import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StakingSettings {
  minimumStake: number;
  lockPeriod: number;
  rewardRate: number;
}

interface YieldFarmingSettings {
  multiplier: number;
  harvestFee: number;
  depositFee: number;
}

interface GovernanceSettings {
  minimumProposalPower: number;
  votingPeriod: number;
  quorumPercentage: number;
}

const PlatformSettings = () => {
  const navigate = useNavigate();
  const [stakingSettings, setStakingSettings] = useState<StakingSettings>({
    minimumStake: 100,
    lockPeriod: 7,
    rewardRate: 12
  });

  const [yieldSettings, setYieldSettings] = useState<YieldFarmingSettings>({
    multiplier: 1.5,
    harvestFee: 2,
    depositFee: 1
  });

  const [governanceSettings, setGovernanceSettings] = useState<GovernanceSettings>({
    minimumProposalPower: 10000,
    votingPeriod: 7,
    quorumPercentage: 50
  });

  // Check admin authentication
  useState(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  });

  const handleStakingUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement staking settings update logic
    console.log('Staking settings updated:', stakingSettings);
  };

  const handleYieldUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement yield farming settings update logic
    console.log('Yield farming settings updated:', yieldSettings);
  };

  const handleGovernanceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement governance settings update logic
    console.log('Governance settings updated:', governanceSettings);
  };

  return (
    <div className="max-w-[2000px] mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Platform Settings</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Staking Settings */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Staking Settings</h2>
          <form onSubmit={handleStakingUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Minimum Stake (AGRI)
              </label>
              <input
                type="number"
                value={stakingSettings.minimumStake}
                onChange={(e) => setStakingSettings({
                  ...stakingSettings,
                  minimumStake: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Lock Period (days)
              </label>
              <input
                type="number"
                value={stakingSettings.lockPeriod}
                onChange={(e) => setStakingSettings({
                  ...stakingSettings,
                  lockPeriod: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Reward Rate (%)
              </label>
              <input
                type="number"
                value={stakingSettings.rewardRate}
                onChange={(e) => setStakingSettings({
                  ...stakingSettings,
                  rewardRate: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update Staking Settings
            </button>
          </form>
        </div>

        {/* Yield Farming Settings */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Yield Farming Settings</h2>
          <form onSubmit={handleYieldUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={yieldSettings.multiplier}
                onChange={(e) => setYieldSettings({
                  ...yieldSettings,
                  multiplier: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Harvest Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={yieldSettings.harvestFee}
                onChange={(e) => setYieldSettings({
                  ...yieldSettings,
                  harvestFee: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Deposit Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={yieldSettings.depositFee}
                onChange={(e) => setYieldSettings({
                  ...yieldSettings,
                  depositFee: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update Yield Settings
            </button>
          </form>
        </div>

        {/* Governance Settings */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Governance Settings</h2>
          <form onSubmit={handleGovernanceUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Minimum Proposal Power
              </label>
              <input
                type="number"
                value={governanceSettings.minimumProposalPower}
                onChange={(e) => setGovernanceSettings({
                  ...governanceSettings,
                  minimumProposalPower: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Voting Period (days)
              </label>
              <input
                type="number"
                value={governanceSettings.votingPeriod}
                onChange={(e) => setGovernanceSettings({
                  ...governanceSettings,
                  votingPeriod: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Quorum Percentage
              </label>
              <input
                type="number"
                value={governanceSettings.quorumPercentage}
                onChange={(e) => setGovernanceSettings({
                  ...governanceSettings,
                  quorumPercentage: Number(e.target.value)
                })}
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update Governance Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;