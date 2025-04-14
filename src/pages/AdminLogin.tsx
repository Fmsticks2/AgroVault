import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock admin credentials - In a real app, these would be stored securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // In a real app, we would set a secure JWT token or session
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="bg-background p-10 rounded-lg border border-border w-full max-w-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-base font-medium text-text-secondary mb-3">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background-light border border-border rounded-lg px-5 py-3 text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-text-secondary mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background-light border border-border rounded-lg px-5 py-3 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors text-lg font-medium mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;