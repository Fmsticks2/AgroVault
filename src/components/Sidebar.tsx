import { SidebarContent, SidebarTrigger, useSidebar } from '../components/CustomSidebar';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, CurrencyDollarIcon, BanknotesIcon, BuildingLibraryIcon, UserGroupIcon } from '@heroicons/react/24/outline';


const navItems = [
  { name: 'Dashboard', path: '/', icon: ChartBarIcon },
  { name: 'Staking', path: '/staking', icon: CurrencyDollarIcon },
  { name: 'Lending', path: '/lending', icon: BanknotesIcon },
  { name: 'Yield Farming', path: '/yield-farming', icon: BuildingLibraryIcon },
  { name: 'Governance', path: '/governance', icon: UserGroupIcon },
];

const SidebarNavigation = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarContent>
      <SidebarTrigger className="w-full flex justify-end p-2 pt-12" />
      {navItems.map((item) => (
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
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
        </NavLink>
      ))}
    </SidebarContent>
  );
};

export default SidebarNavigation