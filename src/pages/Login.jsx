import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, BookMarked, ArrowRight, Loader2 } from 'lucide-react';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Email and password are required');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      navigate(data.user.profile_setup_done ? '/dashboard' : '/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center">
            <BookMarked className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Linkvault</h1>
            <p className="text-dark-300 text-xs">Your personal bookmark vault</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark-50">Welcome back</h2>
            <p className="text-dark-300 text-sm mt-1">Sign in to access your bookmarks</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-dark-200 text-xs font-medium mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-dark-200 text-xs font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>
              ) : (
                <>Sign in<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-dark-300 text-sm mt-6">
            {"Don't have an account? "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
