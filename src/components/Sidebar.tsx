import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/', icon: ChartBarIcon },
  { name: 'Staking', path: '/staking', icon: CurrencyDollarIcon },
  { name: 'Lending', path: '/lending', icon: BanknotesIcon },
  { name: 'Yield Farming', path: '/yield-farming', icon: BuildingLibraryIcon },
  { name: 'Governance', path: '/governance', icon: UserGroupIcon },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-background border-r border-border min-h-screen p-6">
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-background-light text-primary'
                  : 'text-text-secondary hover:bg-background-light hover:text-text-primary'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;