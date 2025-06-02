import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingGuard from './components/OnboardingGuard';
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
// Onboarding imports
import Onboarding from './pages/onboarding/Onboarding';
import SeedPhraseRecovery from './pages/onboarding/SeedPhraseRecovery';
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
import { Toaster } from '../frontend/src/ui/Toaster';

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
          {/* Onboarding routes */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/seed-phrase-recovery" element={<SeedPhraseRecovery />} />
          
          {/* Main routes - protected by OnboardingGuard */}
          <Route path="/" element={<OnboardingGuard><Dashboard /></OnboardingGuard>} />
          <Route path="/marketplace" element={<OnboardingGuard><Marketplace /></OnboardingGuard>} />
          <Route path="/staking" element={<OnboardingGuard><Staking /></OnboardingGuard>} />
          <Route path="/lending" element={<OnboardingGuard><Lending /></OnboardingGuard>} />
          <Route path="/yield-farming" element={<OnboardingGuard><YieldFarming /></OnboardingGuard>} />
          <Route path="/governance" element={<OnboardingGuard><Governance /></OnboardingGuard>} />
          <Route path="/operations" element={<OnboardingGuard><Operations /></OnboardingGuard>} />
          <Route path="/rates" element={<OnboardingGuard><Rates /></OnboardingGuard>} />
          <Route path="/settings" element={<OnboardingGuard><Settings /></OnboardingGuard>} />
          <Route path="/tokenomics" element={<OnboardingGuard><Tokenomics /></OnboardingGuard>} />
          <Route path="/whitepaper" element={<OnboardingGuard><Whitepaper /></OnboardingGuard>} />
          <Route path="/crypto-prices" element={<OnboardingGuard><CryptoPrices /></OnboardingGuard>} />
          <Route path="/new-transaction" element={<OnboardingGuard><NewTransaction /></OnboardingGuard>} />
          <Route path="/view-all-operations" element={<OnboardingGuard><ViewAllOperations /></OnboardingGuard>} />
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
      <Toaster />
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App;
