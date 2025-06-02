import { SidebarContent, SidebarTrigger, useSidebar } from '../components/CustomSidebar';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, CurrencyDollarIcon, BanknotesIcon, BuildingLibraryIcon, UserGroupIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';


const adminNavItems = [
  { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'User Management', path: '/admin/user-management', icon: UserGroupIcon },
  { name: 'Platform Settings', path: '/admin/platform-settings', icon: BuildingLibraryIcon },
  { name: 'Settings', path: '/admin/settings', icon: BuildingLibraryIcon },
  { name: 'Tokenomics', path: '/admin/tokenomics', icon: CurrencyDollarIcon },
  { name: 'Transaction Monitor', path: '/admin/transaction-monitor', icon: BanknotesIcon },
  { name: 'Yield Farming', path: '/admin/yield-farming', icon: BuildingLibraryIcon },
];
const userNavItems = [
  { name: 'Dashboard', path: '/', icon: ChartBarIcon },
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBagIcon },
  { name: 'Staking', path: '/staking', icon: CurrencyDollarIcon },
  { name: 'Lending', path: '/lending', icon: BanknotesIcon },
  { name: 'Yield Farming', path: '/yield-farming', icon: BuildingLibraryIcon },
  { name: 'Governance', path: '/governance', icon: UserGroupIcon },
];

const SidebarNavigation = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const isAdmin = localStorage.getItem('isAdmin');
  return (
    <SidebarContent>
      <SidebarTrigger className="w-full flex justify-end p-2 pt-12" />
      {(isAdmin ? adminNavItems : userNavItems).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-4'} 
             px-4 py-2 mt-6 rounded-lg transition-colors ${
              isActive
                ? 'bg-background-light text-primary'
                : 'text-text-secondary hover:bg-background-light hover:text-text-primary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12 ${isActive ? 'text-blue-500 drop-shadow-lg' : 'text-green-400 hover:text-yellow-400'}`} />
              {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
            </>
          )}
        </NavLink>
      ))}
    </SidebarContent>
  );
};

export default SidebarNavigation