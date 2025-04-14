import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

interface PlatformSettings {
  category: string;
  settings: {
    name: string;
    value: string;
    description: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
  }[];
}

const SettingsAdmin = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PlatformSettings[]>([
    {
      category: 'Security',
      settings: [
        {
          name: 'minimumPasswordLength',
          value: '8',
          description: 'Minimum required password length',
          type: 'number'
        },
        {
          name: 'twoFactorAuth',
          value: 'optional',
          description: 'Two-factor authentication requirement',
          type: 'select',
          options: ['disabled', 'optional', 'required']
        }
      ]
    },
    {
      category: 'Transaction Limits',
      settings: [
        {
          name: 'minDepositAmount',
          value: '100',
          description: 'Minimum deposit amount in AGRO',
          type: 'number'
        },
        {
          name: 'maxWithdrawalAmount',
          value: '10000',
          description: 'Maximum withdrawal amount in AGRO',
          type: 'number'
        },
        {
          name: 'dailyWithdrawalLimit',
          value: '50000',
          description: 'Daily withdrawal limit in AGRO',
          type: 'number'
        }
      ]
    },
    {
      category: 'Platform Features',
      settings: [
        {
          name: 'enableStaking',
          value: 'true',
          description: 'Enable staking functionality',
          type: 'boolean'
        },
        {
          name: 'enableYieldFarming',
          value: 'true',
          description: 'Enable yield farming functionality',
          type: 'boolean'
        },
        {
          name: 'enableGovernance',
          value: 'true',
          description: 'Enable governance functionality',
          type: 'boolean'
        }
      ]
    }
  ]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    
    // Fetch initial settings
    const fetchSettings = async () => {
      try {
        const platformSettings = await adminService.getPlatformSettings();
        setSettings(platformSettings);
      } catch (error) {
        toast.error('Failed to load settings');
        console.error('Error loading settings:', error);
      }
    };
    
    fetchSettings();
  }, [navigate]);

  const handleSettingUpdate = (categoryIndex: number, settingIndex: number, value: string) => {
    setSettings(prev => {
      const updated = [...prev];
      updated[categoryIndex].settings[settingIndex].value = value;
      return updated;
    });
  };

  const renderSettingInput = (setting: PlatformSettings['settings'][0], categoryIndex: number, settingIndex: number) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingUpdate(categoryIndex, settingIndex, e.target.value)}
            className="bg-background-light border border-border rounded px-3 py-2"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        );
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingUpdate(categoryIndex, settingIndex, e.target.value)}
            className="bg-background-light border border-border rounded px-3 py-2"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingUpdate(categoryIndex, settingIndex, e.target.value)}
            className="bg-background-light border border-border rounded px-3 py-2"
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingUpdate(categoryIndex, settingIndex, e.target.value)}
            className="bg-background-light border border-border rounded px-3 py-2"
          />
        );
    }
  };

  return (
    <div className="max-w-[2000px] mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Platform Settings</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {settings.map((category, categoryIndex) => (
        <div key={category.category} className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
          <div className="space-y-6">
            {category.settings.map((setting, settingIndex) => (
              <div key={setting.name} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    {setting.name.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-sm text-text-secondary">{setting.description}</p>
                </div>
                <div>
                  {renderSettingInput(setting, categoryIndex, settingIndex)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          onClick={async () => {
            try {
              await adminService.updatePlatformSettings(settings);
              toast.success('Settings updated successfully');
            } catch (error) {
              toast.error('Failed to update settings');
              console.error('Error updating settings:', error);
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

export default SettingsAdmin;