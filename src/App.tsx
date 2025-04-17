import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlatformSettings from './pages/admin/PlatformSettings';
import SettingsAdmin from './pages/admin/SettingsAdmin';
import TokenomicsAdmin from './pages/admin/TokenomicsAdmin';
import Analytics from './pages/admin/Analytics';
import TransactionMonitor from './pages/admin/TransactionMonitor';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background-dark text-text-primary font-sans">
      {/* Only show Navbar and Sidebar for non-admin routes except login */}
      {(!isAdminRoute || location.pathname === '/admin/login') && <Navbar />}
      <div className="flex w-full">
        {!isAdminRoute && <Sidebar />}
        <main className={`flex-1 ${!isAdminRoute ? 'p-8' : 'p-0'} max-w-[2000px] mx-auto`}>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/lending" element={<Lending />} />
            <Route path="/yield-farming" element={<YieldFarming />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tokenomics" element={<Tokenomics />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            
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

export default App
