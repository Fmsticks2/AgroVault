import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Staking from './pages/Staking';
import Lending from './pages/Lending';
import YieldFarming from './pages/YieldFarming';
import Governance from './pages/Governance';

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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
