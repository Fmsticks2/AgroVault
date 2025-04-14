import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminService.login(credentials);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light p-6">
      <div className="w-full max-w-md bg-background rounded-lg border border-border p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full">
            <FaLock className="text-4xl text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-8">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-background-light border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-2 px-4 border border-border rounded-lg hover:bg-background-light transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;