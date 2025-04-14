import { DocumentTextIcon, LightBulbIcon, ChartBarIcon, RocketLaunchIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Whitepaper = () => {
  return (
    <div className="max-w-[2000px] mx-auto space-y-8 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Whitepaper</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LightBulbIcon className="h-6 w-6 text-primary" />
              Vision & Mission
            </h2>
            <p className="text-text-secondary mb-4">
              AgroVault is revolutionizing agricultural finance by creating a decentralized platform that bridges the gap between traditional farming and DeFi. Our mission is to provide farmers, agricultural businesses, and investors with innovative financial tools while promoting sustainable farming practices.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Core Objectives</h3>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Democratize access to agricultural financing</li>
                  <li>Create sustainable yield farming opportunities</li>
                  <li>Promote transparency in agricultural investments</li>
                  <li>Support sustainable farming practices</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DocumentTextIcon className="h-6 w-6 text-primary" />
              Technology
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Smart Contracts</h3>
                <p className="text-text-secondary">
                  Our platform utilizes advanced smart contracts built on the Ethereum blockchain, ensuring secure and transparent transactions. The contracts are audited by leading security firms and implement industry-standard safety measures.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Yield Generation</h3>
                <p className="text-text-secondary">
                  AgroVault implements innovative yield farming strategies that combine traditional agricultural returns with DeFi mechanisms, creating sustainable and attractive yields for investors.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-3">Risk Management</h3>
                <p className="text-text-secondary">
                  Our platform incorporates advanced risk management protocols, including automated monitoring systems and diversification strategies to protect user investments.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <RocketLaunchIcon className="h-6 w-6 text-primary" />
              Roadmap
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0 font-medium">Phase 1</div>
                <div className="space-y-2">
                  <h3 className="font-medium">Platform Launch</h3>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary">
                    <li>Core platform development</li>
                    <li>Smart contract deployment</li>
                    <li>Security audits</li>
                    <li>Initial partnerships</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0 font-medium">Phase 2</div>
                <div className="space-y-2">
                  <h3 className="font-medium">Expansion</h3>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary">
                    <li>Additional yield farming strategies</li>
                    <li>Cross-chain integration</li>
                    <li>Mobile app development</li>
                    <li>Governance implementation</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 flex-shrink-0 font-medium">Phase 3</div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ecosystem Growth</h3>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary">
                    <li>Real-world asset integration</li>
                    <li>Advanced financial products</li>
                    <li>Global expansion</li>
                    <li>Institutional partnerships</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-primary" />
              Key Metrics
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Total Value Locked</div>
                <div className="text-2xl font-semibold">$250.5M</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Active Users</div>
                <div className="text-2xl font-semibold">3,457</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Supported Assets</div>
                <div className="text-2xl font-semibold">15+</div>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <div className="text-sm text-text-secondary mb-2">Average APY</div>
                <div className="text-2xl font-semibold">12.5%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GlobeAltIcon className="h-6 w-6 text-primary" />
              Market Analysis
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Market Size</h3>
                <p className="text-text-secondary">The global agricultural finance market is projected to reach $12.9 trillion by 2027, growing at a CAGR of 7.1%</p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Growth Drivers</h3>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  <li>Increasing demand for sustainable farming</li>
                  <li>Digital transformation in agriculture</li>
                  <li>Rising adoption of DeFi solutions</li>
                  <li>Government support for agtech initiatives</li>
                </ul>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Competitive Advantage</h3>
                <p className="text-text-secondary">AgroVault's unique combination of DeFi and agricultural expertise positions us to capture significant market share in this growing sector.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6 text-primary" />
              Team
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Leadership</h3>
                <p className="text-text-secondary">Our team combines expertise in DeFi, traditional finance, and agricultural technology with over 50 years of collective experience.</p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Advisors</h3>
                <p className="text-text-secondary">Supported by industry leaders from major agricultural companies, blockchain platforms, and financial institutions.</p>
              </div>
              <div className="p-4 bg-background-light rounded-lg">
                <h3 className="font-medium mb-2">Partners</h3>
                <p className="text-text-secondary">Strategic partnerships with leading agricultural organizations, technology providers, and financial institutions.</p>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-medium">Resources</h3>
            <a
              href="#"
              className="block p-3 rounded-lg hover:bg-background-light transition-colors"
            >
              <div className="font-medium">Technical Documentation</div>
              <div className="text-sm text-text-secondary">Detailed platform specifications</div>
            </a>
            <a
              href="#"
              className="block p-3 rounded-lg hover:bg-background-light transition-colors"
            >
              <div className="font-medium">Security Audit Report</div>
              <div className="text-sm text-text-secondary">Third-party security assessment</div>
            </a>
            <Link
              to="/tokenomics"
              className="block p-3 rounded-lg hover:bg-background-light transition-colors"
            >
              <div className="font-medium">Tokenomics</div>
              <div className="text-sm text-text-secondary">Token distribution and economics</div>
            </Link>
            <a
              href="#"
              className="block p-3 rounded-lg hover:bg-background-light transition-colors"
            >
              <div className="font-medium">Economic Paper</div>
              <div className="text-sm text-text-secondary">Token economics and incentives</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;