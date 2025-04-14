import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlatformSettings from './pages/admin/PlatformSettings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-dark text-text-primary font-sans">
        <Navbar />
        <div className="flex w-full">
          <Sidebar />
          <main className="flex-1 p-8 max-w-[2000px] mx-auto">
            <Routes>
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><PlatformSettings /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App
