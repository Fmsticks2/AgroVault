import { useState } from 'react';
import { CheckCircleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const mockData = {
  proposals: [
    {
      id: 1,
      title: 'Farming reward adjustment',
      description: 'Adjust farming rewards distribution to optimize yield farming incentives',
      status: 'active',
      votesFor: 2450000,
      votesAgainst: 850000,
      endTime: '2026-05-01',
      quorum: 45,
    },
    {
      id: 2,
      title: 'Add new lending market',
      description: 'Add support for new asset in lending markets',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      endTime: '2024-05-15',
      quorum: 0,
    },
  ],
  userVotingPower: 1000,
  totalVotingPower: 5000000,
};

const Governance = () => {
  const [selectedProposal, setSelectedProposal] = useState(mockData.proposals[0]);
  const [voteAmount, setVoteAmount] = useState('');
  const [voteType, setVoteType] = useState<'for' | 'against'>('for');

  const handleVote = () => {
    console.log(`Voting ${voteType} with ${voteAmount} voting power on proposal ${selectedProposal.id}`);
  };

  return (
    <div className="max-w-[2000px] mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Governance</h1>
        <div className="flex items-center space-x-4">
          <div className="stat-card flex items-center space-x-3 py-2 px-4">
            <UserGroupIcon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-text-secondary">Your Voting Power</div>
              <div className="font-medium">{mockData.userVotingPower.toLocaleString()} AGRI</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Active Proposals</h2>
            <div className="space-y-4">
              {mockData.proposals.map((proposal) => (
                <button
                  key={proposal.id}
                  className={`w-full p-4 rounded-lg border transition-colors ${proposal.id === selectedProposal.id ? 'border-primary bg-background-light' : 'border-border hover:border-primary'}`}
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-left">{proposal.title}</div>
                      <div className="text-sm text-text-secondary text-left">{proposal.description}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${proposal.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        Ends {new Date(proposal.endTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Cast Vote</h2>
            {selectedProposal.status === 'active' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Voting Power</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input w-full pr-16"
                      placeholder="0.0"
                      value={voteAmount}
                      onChange={(e) => setVoteAmount(e.target.value)}
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary text-sm"
                      onClick={() => setVoteAmount(mockData.userVotingPower.toString())}
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className={`flex-1 py-2 rounded-lg transition-colors ${voteType === 'for' ? 'bg-success text-background-dark' : 'bg-background-light text-text-secondary'}`}
                    onClick={() => setVoteType('for')}
                  >
                    For
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-lg transition-colors ${voteType === 'against' ? 'bg-error text-background-dark' : 'bg-background-light text-text-secondary'}`}
                    onClick={() => setVoteType('against')}
                  >
                    Against
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Current Votes For</span>
                    <span className="text-success">{selectedProposal.votesFor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Current Votes Against</span>
                    <span className="text-error">{selectedProposal.votesAgainst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Quorum Progress</span>
                    <span>{selectedProposal.quorum}%</span>
                  </div>
                </div>

                <button
                  className="btn-primary w-full mt-4"
                  onClick={handleVote}
                  disabled={!voteAmount}
                >
                  Cast Vote
                </button>
              </div>
            ) : (
              <div className="text-center text-text-secondary py-8">
                This proposal is not active
              </div>
            )}
          </div>

          <div className="card space-y-3">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <CheckCircleIcon className="h-4 w-4" />
              <span>One AGRI token equals one vote</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <ClockIcon className="h-4 w-4" />
              <span>Voting period lasts for 7 days</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <UserGroupIcon className="h-4 w-4" />
              <span>50% quorum required for proposal to pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;