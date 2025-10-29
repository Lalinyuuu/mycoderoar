import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-1 via-light-1 to-emerald-1 p-4">
      <div className="max-w-md w-full bg-light-1 rounded-2xl shadow-2xl p-8 border-2 border-purple-3">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-7 via-purple-6 to-purple-5 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-7 mb-6">Login to your Ragnarok account</p>

        {error && (
          <div className="bg-error/10 border-2 border-error text-error px-4 py-3 rounded-lg mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-3 rounded-lg  gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold gray-10 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-3 rounded-lg gray-10 bg-light-1 font-medium placeholder:text-gray-6 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-6 to-purple-5 text-light-1 py-3 rounded-lg font-bold text-base hover:from-purple-7 hover:to-purple-6 hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-7">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="purple-7 font-bold hover:purple-8 hover:underline decoration-purple-4 underline-offset-2 transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}