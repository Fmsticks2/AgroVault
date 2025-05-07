
const Settings = () => {
  return (
    <div className="space-y-6 w-full min-w-0 md:space-y-6 py-6 pt-24 pl-20 md:pl-24 lg:px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings Card */}
        <div className="bg-background p-6 rounded-lg border border-border text-start">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-text-secondary">Display Name</label>
              <input
                type="text"
                className="w-full bg-background-light border border-border rounded-lg px-4 py-2"
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-text-secondary">Email Notifications</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="rounded border-border"
                />
                <label htmlFor="email-notifications" className="sr-only">
                  Enable email notifications
                </label>
                <span className="text-text-primary">Enable email notifications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings Card */}
        <div className="bg-background p-6 rounded-lg border border-border text-start">
          <h2 className="text-lg font-medium mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-text-secondary">Two-Factor Authentication</label>
              <button className="btn-secondary py-2 px-4 rounded-lg">
                Enable 2FA
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-text-secondary">Transaction Signing</label>
              <div className="flex items-center space-x-2">
                <input title="theme" type="checkbox" className="rounded border-border" />
                <span className="text-text-primary">Require password for all transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings Card */}
        <div className="bg-background p-6 rounded-lg border border-border text-start">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-text-secondary">Theme</label>
              <select title="theme" className="w-full bg-background-light border border-border rounded-lg px-4 py-2">
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>
          </div>
        </div>

        {/* Network Settings Card */}
        <div className="bg-background p-6 rounded-lg border border-border text-start">
          <h2 className="text-lg font-medium mb-4">Network Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-text-secondary">Default Network</label>
              <select title="theme" className="w-full bg-background-light border border-border rounded-lg px-4 py-2">
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-text-secondary">Gas Price Alerts</label>
              <div className="flex items-center space-x-2">
                <input title="theme"  type="checkbox" className="rounded border-border" />
                <span className="text-text-primary">Enable gas price alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;