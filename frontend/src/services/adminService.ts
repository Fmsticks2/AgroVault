import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface AdminCredentials {
  username: string;
  password: string;
}

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

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  registrationDate: string;
  permissions: string[];
}

const adminService = {
  // Authentication
  login: async (credentials: AdminCredentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('isAdmin', 'true');
      }
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
  },

  // Platform Settings
  getPlatformSettings: async (): Promise<PlatformSettings[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/settings`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch platform settings');
    }
  },

  updatePlatformSettings: async (settings: PlatformSettings[]) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/settings`, settings);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update platform settings');
    }
  },

  // Staking Settings
  getStakingSettings: async (): Promise<StakingSettings> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/staking-settings`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch staking settings');
    }
  },

  updateStakingSettings: async (settings: StakingSettings) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/staking-settings`, settings);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update staking settings');
    }
  },

  // Yield Farming Settings
  getYieldFarmingSettings: async (): Promise<YieldFarmingSettings> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/yield-settings`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch yield farming settings');
    }
  },

  updateYieldFarmingSettings: async (settings: YieldFarmingSettings) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/yield-settings`, settings);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update yield farming settings');
    }
  },

  // Governance Settings
  getGovernanceSettings: async (): Promise<GovernanceSettings> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/governance-settings`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch governance settings');
    }
  },

  updateGovernanceSettings: async (settings: GovernanceSettings) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/governance-settings`, settings);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update governance settings');
    }
  },

  // User Management
  getUsers: async (): Promise<{ data: User[] }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user status');
    }
  },

  updateUserRole: async (userId: string, role: User['role']) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user role');
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  },
};

export default adminService;