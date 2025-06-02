import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Staking from './pages/Staking';
import Lending from './pages/Lending';
import YieldFarming from './pages/YieldFarming';
import Governance from './pages/Governance';
import Operations from './pages/Operations';
import Rates from './pages/Rates';
import Settings from './pages/Settings';
import Tokenomics from './pages/Tokenomics';
import Whitepaper from './pages/Whitepaper';
import CryptoPrices from './pages/CryptoPrices';
import NewTransaction from './pages/NewTransaction';
import ViewAllOperations from './pages/ViewAllOperations';
import Marketplace from './pages/Marketplace';
// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlatformSettings from './pages/admin/PlatformSettings';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import TokenomicsAdmin from './pages/admin/TokenomicsAdmin';
import Analytics from './pages/admin/Analytics';
import TransactionMonitor from './pages/admin/TransactionMonitor';
import { SidebarProvider, Sidebar, useSidebar } from './components/CustomSidebar';
import SidebarNavigation from './components/Sidebar';
import { cn } from './lib/utils';

const MainContent = () => {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <main className={cn(
      "min-h-screen",
      "transition-all duration-300 ease-in-out",
      "w-[calc(100vw-1rem)]",
      "md:w-[calc(100vw-2rem)]",
      isCollapsed 
        ? "lg:w-[calc(100vw-4rem)]" 
        : "lg:w-[calc(100vw-16rem)]",
      "overflow-x-hidden"
    )}>
      <div className="w-full max-w-full">
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/lending" element={<Lending />} />
          <Route path="/yield-farming" element={<YieldFarming />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tokenomics" element={<Tokenomics />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/crypto-prices" element={<CryptoPrices />} />
          <Route path="/new-transaction" element={<NewTransaction />} />
          <Route path="/view-all-operations" element={<ViewAllOperations />} />
        </Routes>
      </div>
    </main>
  );
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background-dark text-text-primary font-sans">
      {(!isAdminRoute || location.pathname === '/admin/login') && (
        <div className="fixed top-0 left-0 right-0 z-50 h-16">
          <Navbar />
        </div>
      )}
      <div className="overflow-x-hidden">
        {!isAdminRoute ? (
          <SidebarProvider defaultOpen={false}>
            <div className="grid grid-cols-[auto,1fr] w-full">
              <Sidebar className="border-r bg-background h-full">
                <SidebarNavigation />
              </Sidebar>
              <MainContent />
            </div>
          </SidebarProvider>
        ) : (
          <main className="flex-1">
            <Routes>
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><PlatformSettings /></ProtectedRoute>} />
              <Route path="/admin/platform-settings" element={<ProtectedRoute><SettingsAdmin /></ProtectedRoute>} />
              <Route path="/admin/tokenomics" element={<ProtectedRoute><TokenomicsAdmin /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/admin/transactions" element={<ProtectedRoute><TransactionMonitor /></ProtectedRoute>} />
            </Routes>
          </main>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App;
